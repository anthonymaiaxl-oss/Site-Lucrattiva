// Contract checks without dependencies. Browser tests exercise the real DOM separately.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/site.js'), 'utf8');
let checks = 0;
const check = (ok, message) => { checks++; assert.ok(ok, message); };
class El {
  constructor(tag = 'div', attrs = {}) {
    this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.listeners = {};
    this.children = []; this.dataset = {}; this.hidden = false; this.value = ''; this.checked = false;
    this.textContent = ''; this.style = {}; this.classes = new Set();
    this.classList = { add: c => this.classes.add(c), remove: c => this.classes.delete(c), contains: c => this.classes.has(c), toggle: c => this.classes.has(c) ? (this.classes.delete(c), false) : (this.classes.add(c), true) };
  }
  get nextElementSibling() { const nodes = this.parentElement?.children || []; return nodes[nodes.indexOf(this) + 1]; }
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener(k, fn) { (this.listeners[k] ||= []).push(fn); }
  emit(k, options = {}) { for (const fn of this.listeners[k] || []) fn({ target: this, preventDefault() {}, ...options }); }
  click() { this.emit('click'); }
  focus() { this.focused = true; }
  select() { this.selected = true; }
  setCustomValidity(text) { this.invalid = text; }
  reportValidity() { return !this.querySelector('[name=name]')?.invalid; }
  append(...nodes) { nodes.forEach(n => { n.parentElement = this; this.children.push(n); }); }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  remove() { this.parentElement?.children.splice(this.parentElement.children.indexOf(this), 1); }
  contains(node) { return node === this || this.children.some(n => n.contains(node)); }
  matches(selector) {
    if (selector.startsWith('.')) return this.className === selector.slice(1);
    const m = selector.match(/^\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/);
    if (m) {
      const key = m[1];
      const dataKey = key.startsWith('data-') ? key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : '';
      const present = key in this.attrs || (dataKey && dataKey in this.dataset);
      return !!present && (m[2] === undefined || this.attrs[key] === m[2]);
    }
    return this.tagName === selector.toUpperCase();
  }
  querySelectorAll(selector) { return this.children.flatMap(n => [ ...(n.matches(selector) ? [n] : []), ...n.querySelectorAll(selector) ]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}
function fixture(options = {}) {
  const document = new El('document');
  document.head = new El('head'); document.body = new El('body'); document.append(document.head, document.body);
  document.createElement = tag => new El(tag);
  const make = (tag, attrs, parent = document.body) => { const e = new El(tag, attrs); parent.append(e); return e; };
  const general = make('a', { 'data-whatsapp': 'geral', 'data-cta': 'header' });
  const agro = make('a', { 'data-whatsapp': 'agro', 'data-cta': 'agro-hero' });
  const sector = make('a', { 'data-sector': 'agro', 'data-cta': 'home-sector' });
  const elements = {};
  for (const name of ['banner', 'preferences', 'all', 'reject', 'configure', 'save', 'reopen']) {
    elements[name] = make('button', { ['data-consent-' + name]: '' });
  }
  const analytics = make('input', { name: 'analytics-consent' });
  const marketing = make('input', { name: 'marketing-consent' });
  let form, name, select;
  if (options.form) {
    form = make('form', { 'data-lead-form': '' });
    name = make('input', { name: 'name' }, form); name.value = 'Maria';
    select = make('select', { name: 'segment' }, form); select.value = 'geral';
    const issue = make('textarea', { name: 'issue' }, form); issue.value = 'Organizar minha empresa';
  }
  const grid = options.team ? make('div', { 'data-team-grid': '' }) : null;
  const storage = new Map(options.consent ? [['lucrattiva_consent_v1', JSON.stringify(options.consent)]] : []);
  const context = {
    window: { LUCRATTIVA: { whatsapp: '5565999513928', gtMId: 'GTM-TEST123', trackingReviewed: options.reviewed !== false, team: options.team || [] }, dataLayer: [] },
    location: { pathname: options.path || '/agronegocio/', search: '?utm_source=google&utm_medium=cpc&utm_campaign=agro', reload: () => { context.reloaded = true; } },
    localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
    navigator: { clipboard: { writeText: async text => { context.copied = text; } } },
    document, console, URL, URLSearchParams, encodeURIComponent,
    FormData: class { constructor(el) { this.el = el; } get(key) { return this.el.querySelector(`[name=${key}]`)?.value; } }
  };
  vm.runInNewContext(source, context, { filename: 'site.js' });
  return { ...elements, analytics, marketing, context, document, general, agro, sector, form, name, select, grid, storage };
}
const f = fixture();
check(f.general.getAttribute('href').startsWith('https://wa.me/5565999513928?text='), 'Número centralizado');
check(decodeURIComponent(f.agro.getAttribute('href')).includes('agronegócio'), 'WhatsApp com contexto');
check(f.banner.hidden === false, 'Escolha inicial visível');
check(!f.document.querySelector('[data-gtm-script]'), 'Sem tags antes da escolha');
f.agro.click();
check(f.context.window.dataLayer.length === 0, 'Sem eventos antes da escolha');
check(!!f.document.querySelector('.whatsapp-recovery-trigger'), 'Recuperação de WhatsApp disponível');
f.all.click();
check(f.document.querySelectorAll('[data-gtm-script]').length === 1, 'Container revisado carrega uma vez');
const sequence = f.context.window.dataLayer;
check(sequence[0][0] === 'consent' && sequence[0][1] === 'default' && sequence[0][2].ad_storage === 'denied', 'Default denied antecede carregamento');
check(sequence[1][1] === 'update' && sequence[1][2].ad_user_data === 'granted', 'Consent Mode v2 inclui dados publicitários');
f.agro.click();
check(sequence.at(-1).event === 'whatsapp_click' && sequence.at(-1).segment === 'agro', 'Evento de intenção contextual');
check(sequence.at(-1).page_path === '/agronegocio/' && sequence.at(-1).utm_source === 'google', 'Página e atribuição mínima');
f.sector.click();
check(sequence.at(-1).event === 'sector_cta_click', 'Evento de navegação setorial');
f.all.click();
check(f.document.querySelectorAll('[data-gtm-script]').length === 1, 'Sem tag duplicada');
f.reopen.click();
check(f.analytics.checked && f.marketing.checked && !f.preferences.hidden, 'Reabertura reflete escolha');
f.marketing.checked = false; f.save.click();
check(f.context.reloaded, 'Revogação parcial remove tags executadas via recarregamento');
check(JSON.parse(f.storage.get('lucrattiva_consent_v1')).marketing === false, 'Escolha parcial persistida');
const reject = fixture(); reject.reject.click(); reject.agro.click();
check(!reject.document.querySelector('[data-gtm-script]') && reject.context.window.dataLayer.length === 0, 'Recusar mantém tags e eventos inativos');
const unreviewed = fixture({ reviewed: false }); unreviewed.all.click();
check(!unreviewed.document.querySelector('[data-gtm-script]'), 'ID preenchido sem revisão não ativa container');
const separate = fixture(); separate.configure.click(); separate.analytics.checked = true; separate.save.click();
check(separate.context.window.dataLayer[1][2].analytics_storage === 'granted' && separate.context.window.dataLayer[1][2].ad_storage === 'denied', 'Estatísticas separadas de publicidade');
const lead = fixture({ form: true });
check(lead.select.value === 'agro', 'Pré-seleção por landing page');
lead.form.emit('submit');
check(lead.form.querySelector('textarea').value === 'Organizar minha empresa', 'Respostas preservadas');
const recovery = lead.form.querySelector('[data-form-recovery]');
check(recovery.querySelector('a').href.includes('https://wa.me/'), 'Alternativa de abertura do formulário');
check(recovery.querySelector('textarea').value.includes('Maria') && recovery.querySelector('textarea').value.includes('agronegócio'), 'Mensagem completa recuperável');
check(lead.context.window.dataLayer.length === 0, 'Formulário funciona com opcionais recusados');
lead.name.value = '   '; lead.form.emit('submit');
check(!!lead.name.invalid, 'Nome em branco não passa como válido');
const team = fixture({ team: [{ name: '<script>exemplo</script>', role: 'Atendimento', bio: 'Uma biografia.', socials: { LinkedIn: 'https://www.linkedin.com/', Inválido: 'javascript:alert(1)' } }, { name: 'Outro', role: 'Direção' }] });
check(team.grid.children.length === 2, 'Número de cartões vem somente da configuração');
check(team.grid.querySelector('strong').textContent === '<script>exemplo</script>', 'Dados de equipe inseridos como texto');
check(team.grid.querySelectorAll('a').length === 1, 'URLs inseguras ignoradas');
check(team.grid.querySelector('.portrait-placeholder').children.at(-1).textContent === 'Foto a inserir', 'Sem retratos fictícios');
console.log(`INTERAÇÕES: ${checks} verificações passaram (WhatsApp, recuperação, formulário, atribuição, equipe e consentimento).`);
