#!/usr/bin/env python3
"""Real Chromium validation; optional development dependency: Python Playwright.
Run with an already running local server. No advertising or WhatsApp requests are sent.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8080')
parser.add_argument('--artifacts', default='/workspace/artifacts/lucrattiva')
parser.add_argument('--axe', help='Optional path to local axe-core distribution (development only)')
args = parser.parse_args()
artifacts = Path(args.artifacts)
artifacts.mkdir(parents=True, exist_ok=True)
checks = []
errors = []
responses = []
routes = ['/', '/agronegocio/', '/industria/', '/servicos/', '/transportes/', '/trocar-de-contador/', '/sobre/', '/equipe/', '/contato/', '/privacidade/', '/depoimentos/']

def check(value, label):
    if not value:
        raise AssertionError(label)
    checks.append(label)

def open_page(context, path='/'):
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: responses.append({'url': r.url, 'status': r.status}) if r.url.startswith(args.base_url) else None)
    r = page.goto(args.base_url + path, wait_until='networkidle')
    check(r.status == 200, f'HTTP 200: {path}')
    return page

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    # Deliberately prevent real external communications during automated checks.
    context.route('https://wa.me/**', lambda r: r.fulfill(status=200, body='WhatsApp simulated for local validation.'))
    page = open_page(context)
    check(page.locator('h1').count() == 1, 'One H1 on home')
    check(page.locator('[data-team-grid] .person-card').count() == 2, 'Two partner profiles rendered from configuration')
    check(page.locator('[data-team-grid]').text_content().count('Foto a inserir') == 2, 'Explicit photo placeholders')
    check(page.locator('[data-consent-banner]').is_visible(), 'Initial privacy choice is available')
    check(page.locator('script[src*="googletagmanager"]').count() == 0, 'Default build has no optional tags')
    page.screenshot(path=str(artifacts / 'home-desktop-cookies.png'))
    page.locator('[data-consent-reject]').click()
    page.screenshot(path=str(artifacts / 'home-desktop-dobra.png'))
    page.screenshot(path=str(artifacts / 'home-desktop.png'), full_page=True)
    page.locator('#areas').scroll_into_view_if_needed()
    page.screenshot(path=str(artifacts / 'desktop-areas.png'))
    for path in routes:
        page.goto(args.base_url + path, wait_until='networkidle')
        check(page.locator('h1').count() == 1, f'One H1: {path}')
        check(bool(page.title()), f'Title: {path}')
        for width in [360, 390, 430, 768, 1280, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 1000})
            check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'No overflow: {path} @ {width}')
        for a in page.locator('[data-whatsapp]').all():
            check(a.get_attribute('href').startswith('https://wa.me/5565999513928?text='), f'Central WhatsApp number: {path}')
        if path in ['/agronegocio/', '/industria/', '/servicos/', '/transportes/', '/trocar-de-contador/']:
            expected = dict(zip(routes[1:6], ['agro', 'industria', 'servicos', 'transportes', 'troca']))[path]
            check(page.locator('select[name=segment]').input_value() == expected, f'Sector preselected: {path}')
            check(page.locator('[data-whatsapp]').nth(1).get_attribute('data-whatsapp') == expected, f'Contextual hero CTA: {path}')
    for path in ['/', '/equipe/']:
        page.goto(args.base_url + path, wait_until='networkidle')
        for width in [360, 390, 430, 768, 1280, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 1000})
            check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Responsive: {path} @ {width}')
    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(args.base_url, wait_until='networkidle')
    menu = page.locator('[data-menu-toggle]')
    menu.click()
    check(menu.get_attribute('aria-expanded') == 'true', 'Mobile menu opens')
    page.keyboard.press('Escape')
    check(menu.get_attribute('aria-expanded') == 'false', 'Escape closes menu')
    check(menu.evaluate('(el) => el === document.activeElement'), 'Escape restores toggle focus')
    menu.click()
    page.mouse.click(10, 750)
    check(menu.get_attribute('aria-expanded') == 'false', 'Outside click closes menu')
    menu.click()
    trigger = page.locator('.nav-drop-trigger')
    trigger.focus()
    page.keyboard.press('Enter')
    check(trigger.get_attribute('aria-expanded') == 'true', 'Keyboard expands sectors')
    page.locator('.dropdown-menu a[href="/industria/"]').click()
    check(page.url.endswith('/industria/'), 'Mobile sector navigation works')
    check(menu.get_attribute('aria-expanded') == 'false', 'Menu closes after navigation')
    # Test blocked popup recovery without sending the test message anywhere.
    page.evaluate('''() => {const original = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function(){if(this.href.startsWith('https://wa.me/'))return;original.call(this)};
    }''')
    page.locator('[name=name]').fill('   ')
    page.locator('#lead-privacy').check()
    page.locator('[data-lead-form] button[type=submit]').click()
    check(page.locator('[name=name]').evaluate('(e)=>!e.checkValidity()'), 'Whitespace name is invalid')
    page.locator('[name=name]').fill('Teste de homologação')
    page.locator('[name=issue]').fill('Verificar mensagem sem envio')
    page.locator('[data-lead-form] button[type=submit]').click()
    recovery = page.locator('[data-form-recovery]')
    check(recovery.is_visible(), 'Recovery visible when popup is blocked')
    check('indústria' in recovery.locator('textarea').input_value(), 'Recovery preserves chosen segment')
    check(page.locator('[name=name]').input_value() == 'Teste de homologação', 'Form answers remain intact')
    check('Teste de homologação' in recovery.locator('textarea').input_value(), 'Prepared message preserves answers')
    check('lead' not in page.url and 'Teste' not in page.url, 'No form submission to site server')
    check(page.evaluate('!window.dataLayer || !window.dataLayer.some(e=>e.event)'), 'Form works without optional analytics')
    page.screenshot(path=str(artifacts / 'formulario-recuperacao.png'), full_page=True)
    page.goto(args.base_url + '/', wait_until='networkidle')
    page.screenshot(path=str(artifacts / 'mobile-dobra.png'))
    page.screenshot(path=str(artifacts / 'home-mobile.png'), full_page=True)
    page.locator('#areas').scroll_into_view_if_needed()
    page.screenshot(path=str(artifacts / 'mobile-areas.png'))
    for width, label in [(1440, 'desktop'), (390, 'mobile')]:
        page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
        page.goto(args.base_url + '/equipe/', wait_until='networkidle')
        page.screenshot(path=str(artifacts / f'equipe-{label}.png'), full_page=True)
    for path in routes[1:]:
        for width, label in [(1440, 'desktop'), (390, 'mobile')]:
            page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
            page.goto(args.base_url + path, wait_until='networkidle')
            page.screenshot(path=str(artifacts / (path.strip('/') + '-' + label + '.png')), full_page=True)
            if path == '/agronegocio/' and width == 1440:
                page.screenshot(path=str(artifacts / 'agronegocio-desktop-dobra.png'))
    page.goto(args.base_url + '/privacidade/', wait_until='networkidle')
    page.locator('[data-consent-open]').click()
    check(page.locator('[data-consent-preferences]').is_visible(), 'Privacy page can reopen preferences')
    page.locator('[data-consent-reject]').click()
    # User-requested demonstration cards must be clearly labelled as fictional.
    page.goto(args.base_url + '/', wait_until='networkidle')
    check(page.locator('#depoimentos [data-testimonials-example-notice]').is_visible(), 'Fictional demonstration notice is visible on home')
    check(page.locator('#depoimentos .testimonial-card').count() == 3, 'Three requested example cards on home')
    check(page.locator('#depoimentos .testimonial-example-badge').count() == 3, 'Each demonstration is individually labelled fictional')
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.locator('[data-main-nav] a[href="#depoimentos"]').click()
    check(page.url.endswith('/#depoimentos'), 'Testimonials menu reaches homepage section')
    check(page.locator('#depoimentos').is_visible(), 'Testimonials remain in the main homepage')
    check(page.locator('[data-testimonials-empty]').is_hidden(), 'Example cards replace empty state')
    fixture_config = Path(__file__).resolve().parents[1].joinpath('assets/js/config.js').read_text()
    testimonials = [dict(quote='Texto sintético para validar o componente, sem representar um cliente real.', name=f'Autor de teste {i}', company='Empresa de teste', role='Cargo de teste', approved=True) for i in range(4)]
    testimonials[0]['name'] = '<img src=x onerror=alert(1)>'
    testimonials.extend([dict(quote='Rascunho não autorizado', name='Rascunho', approved=False), dict(quote='Sem aprovação explícita', name='Sem aprovação'), dict(quote=42, name='Dado inválido', approved=True)])
    tc = browser.new_context()
    tc.route('**/assets/js/config.js', lambda r: r.fulfill(content_type='text/javascript', body=fixture_config + '\nwindow.LUCRATTIVA.testimonials=' + json.dumps(testimonials) + ';'))
    for path, expected in [('/', 4), ('/depoimentos/', 4)]:
        q = open_page(tc, path)
        check(q.locator('.testimonial-card').count() == expected, f'All approved valid entries: {path}')
        check(q.locator('[data-testimonials-empty]').is_hidden(), f'Empty state replaced when approved data exists: {path}')
        check(q.locator('.testimonial-example-badge').count() == 0, 'Approved real records are not mixed with fictional examples')
        check(q.locator('[data-testimonials-example-notice]').is_hidden(), 'Example notice hidden when approved real records exist')
        check(q.locator('.testimonial-name').first.text_content() == '<img src=x onerror=alert(1)>', 'Testimonial names inserted as text')
        check(q.locator('.testimonial-card img').count() == 0, 'Testimonial data cannot inject markup')
        check(q.locator('.testimonial-detail').first.text_content() == 'Cargo de teste · Empresa de teste', 'Optional testimonial attribution')
        for width in [360, 390, 430, 768, 941, 1024, 1100, 1280, 1440, 1920]:
            q.set_viewport_size({'width': width, 'height': 1000})
            check(q.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Populated testimonials do not overflow: {path} @ {width}')
        if args.axe:
            q.add_script_tag(path=args.axe)
            v = q.evaluate('async () => (await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}})).violations')
            check(not v, f'Approved testimonial card accessibility: {path}: {[x["id"] for x in v]}')
        q.close()
    tc.close()
    empty_context = browser.new_context()
    empty_context.route('**/assets/js/config.js', lambda r: r.fulfill(content_type='text/javascript', body=fixture_config + '\nwindow.LUCRATTIVA.testimonials=[];window.LUCRATTIVA.showTestimonialExamples=false;'))
    empty_page = open_page(empty_context)
    check(empty_page.locator('[data-testimonials-empty]').is_visible(), 'Examples can be disabled without editing HTML')
    check(empty_page.locator('.testimonial-card').count() == 0, 'Disabled examples do not masquerade as approved testimonials')
    empty_context.close()
    # Changing the configuration updates both the count and optional fields without HTML edits.
    team_config = Path(__file__).resolve().parents[1].joinpath('assets/js/config.js').read_text()
    dynamic = browser.new_context()
    dynamic.route('**/assets/js/config.js', lambda r: r.fulfill(content_type='text/javascript', body=team_config + '\nwindow.LUCRATTIVA.team = [{name:"Teste de configuração",role:"Exemplo de teste",photo:"",bio:"Biografia de teste",socials:{LinkedIn:"https://www.linkedin.com/",Inseguro:"javascript:alert(1)"}}];'))
    for path in ['/', '/equipe/']:
        q = open_page(dynamic, path)
        check(q.locator('[data-team-grid] .person-card').count() == 1, f'Data-only team editing: {path}')
        check(q.locator('[data-team-grid] .person-bio').inner_text() == 'Biografia de teste', f'Team bio: {path}')
        check(q.locator('[data-team-grid] a').count() == 1, f'Unsafe team URLs rejected: {path}')
        q.close()
    dynamic.close()
    # GTM is only a stub in an isolated context; no actual analytics endpoint is contacted.
    for category in ['analytics', 'marketing']:
        c = browser.new_context()
        c.route('**/assets/js/config.js', lambda r: r.fulfill(content_type='text/javascript', body=team_config + '\nwindow.LUCRATTIVA.trackingReviewed=true;window.LUCRATTIVA.gtMId="GTM-TEST123";'))
        requests = []
        def tag_stub(route):
            requests.append(route.request.url)
            route.fulfill(content_type='text/javascript', body='/* Isolated test stub; no tracking. */')
        c.route('https://www.googletagmanager.com/**', tag_stub)
        q = open_page(c)
        check(len(requests) == 0, f'No tag before consent ({category})')
        q.locator('[data-consent-configure]').click()
        q.locator(f'[name={category}-consent]').check()
        q.locator('[data-consent-save]').click()
        q.wait_for_timeout(100)
        check(len(requests) == 1, f'Reviewed stub loads after {category} choice')
        consent = q.evaluate('Array.from(window.dataLayer[1])[2]')
        check(consent['analytics_storage'] == ('granted' if category == 'analytics' else 'denied'), f'Analytics category independent: {category}')
        check(consent['ad_storage'] == ('granted' if category == 'marketing' else 'denied'), f'Marketing category independent: {category}')
        check(q.evaluate('Array.from(window.dataLayer[0])[1]') == 'default', 'Default command precedes update and tag')
        q.locator('[data-consent-reopen]').click()
        check(q.locator(f'[name={category}-consent]').is_checked(), 'Saved choices restored in controls')
        q.locator('[data-consent-reject]').click()
        q.wait_for_load_state('networkidle')
        check(q.locator('[data-gtm-script]').count() == 0, f'Revocation unloads optional code ({category})')
        check(len(requests) == 1, 'Revocation does not reload tracking')
        c.close()
    # Real browser validation of the default (disabled) integration, even after full acceptance.
    clean = browser.new_context()
    q = open_page(clean)
    q.locator('[data-consent-all]').click()
    check(q.locator('[data-gtm-script]').count() == 0, 'Production configuration remains disabled after acceptance')
    clean.close()
    a11y = []
    if args.axe:
        for path in routes:
            for width in [1440, 390]:
                page.set_viewport_size({'width': width, 'height': 1000})
                page.goto(args.base_url + path, wait_until='networkidle')
                page.add_script_tag(path=args.axe)
                report = page.evaluate('async () => await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}})')
                a11y.append({'path': path, 'width': width, 'violations': report['violations'], 'incomplete': report['incomplete']})
                check(not report['violations'], f'axe WCAG A/AA: {path} @ {width}: {[v["id"] for v in report["violations"]]}')
    # Reduced motion preference removes transitions and smooth scrolling.
    page.emulate_media(reduced_motion='reduce')
    check(page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto', 'Reduced motion is respected')
    check(not errors, f'No JavaScript errors: {errors}')
    check(not [r for r in responses if r['status'] >= 400], 'No failed local page or asset requests')
    context.close()
    browser.close()
report = {'checks_passed': len(checks), 'checks': checks, 'console_errors': errors, 'local_responses_checked': len(responses), 'a11y': a11y, 'notes': ['WhatsApp navigation simulated; no message sent.', 'GTM stub only in isolated test contexts; production IDs remain empty.', 'axe incomplete results require manual review; zero violations is not a full accessibility certification.']}
(artifacts / 'browser-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(f'BROWSER: {len(checks)} checks passed; {len(responses)} local responses; no JavaScript errors or failed assets.')
