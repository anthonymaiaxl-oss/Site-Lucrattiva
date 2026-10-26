(() => {
  'use strict';
  const cfg = window.LUCRATTIVA || {};
  const consentKey = 'lucrattiva_consent_v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const create = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const segments = { agro: 'agronegócio', industria: 'indústria', servicos: 'serviços', transportes: 'transportes', troca: 'troca de contador', geral: 'soluções contábeis' };
  let consent = null;
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || 'null');
    if (saved && typeof saved.analytics === 'boolean' && typeof saved.marketing === 'boolean') consent = saved;
  } catch { /* Storage may be unavailable: optional processing remains denied. */ }

  function whatsappLink(segment = 'geral', message) {
    const text = message || cfg.whatsappMessages?.[segment] || `Olá, LuCrattiva! Vim pelo site e gostaria de conversar sobre ${segments[segment] || 'minha empresa'}.`;
    return `https://wa.me/${String(cfg.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  }
  function track(event, data = {}) {
    if (!consent?.analytics) return;
    // Intention only. Never include names, free text, telephone or form answers.
    window.dataLayer = window.dataLayer || [];
    const attribution = {};
    const query = new URLSearchParams(location.search || '');
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
      const value = query.get(key);
      // Deliberately restrict the format; never copy full query strings into events.
      if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) attribution[key] = value;
    });
    window.dataLayer.push({ event, ...data, page_path: location.pathname, ...attribution });
  }

  // A native link performs navigation. This independent recovery UI does not claim delivery.
  function recoveryContent(url, message) {
    const box = create('div', 'whatsapp-fallback');
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Recuperar mensagem do WhatsApp');
    box.append(create('strong', '', 'Sua mensagem está pronta.'));
    box.append(create('p', '', 'Conclua o envio no WhatsApp. Se ele não abriu, use o link ou copie a mensagem abaixo.'));
    const link = create('a', '', url);
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    const label = create('label', '', 'Mensagem preparada');
    const text = create('textarea');
    text.readOnly = true; text.value = message; text.setAttribute('aria-label', 'Mensagem preparada para copiar');
    label.append(text);
    const button = create('button', '', 'Copiar mensagem');
    button.type = 'button';
    const status = create('span', 'copy-status');
    status.setAttribute('role', 'status');
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(message); status.textContent = 'Mensagem copiada.'; }
      catch { text.focus(); text.select(); status.textContent = 'Selecione e copie a mensagem acima.'; }
    });
    const copyLink = create('button', '', 'Copiar link');
    copyLink.type = 'button';
    copyLink.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); status.textContent = 'Link copiado.'; }
      catch { status.textContent = 'Toque e segure o link acima para copiá-lo.'; }
    });
    box.append(link, label, button, copyLink, status);
    return box;
  }
  let recoveryPanel;
  let recoveryTrigger;
  function offerRecovery(url) {
    if (!recoveryTrigger) {
      recoveryTrigger = create('button', 'whatsapp-recovery-trigger', 'WhatsApp não abriu?');
      recoveryTrigger.type = 'button';
      recoveryTrigger.setAttribute('aria-expanded', 'false');
      document.body.append(recoveryTrigger);
      recoveryPanel = create('div', 'whatsapp-recovery-panel');
      recoveryPanel.hidden = true;
      recoveryPanel.id = 'whatsapp-recovery';
      recoveryTrigger.setAttribute('aria-controls', recoveryPanel.id);
      recoveryTrigger.addEventListener('click', () => {
        recoveryPanel.hidden = !recoveryPanel.hidden;
        recoveryTrigger.setAttribute('aria-expanded', String(!recoveryPanel.hidden));
      });
      document.body.append(recoveryPanel);
    }
    recoveryPanel.replaceChildren(recoveryContent(url, new URL(url).searchParams.get('text')));
  }
  $$('[data-whatsapp]').forEach(el => {
    const segment = el.getAttribute('data-whatsapp') || 'geral';
    const url = whatsappLink(segment);
    el.setAttribute('href', url);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
    el.addEventListener('click', () => {
      track('whatsapp_click', { segment, cta_position: el.getAttribute('data-cta') || 'unclassified' });
      offerRecovery(url);
    });
  });
  $$('[data-sector]').forEach(el => el.addEventListener('click', () => track('sector_cta_click', {
    segment: el.getAttribute('data-sector'), cta_position: el.getAttribute('data-cta') || 'home-sector'
  })));
  $$('[data-public-phone]').forEach(el => { el.textContent = cfg.phoneDisplay || ''; });
  $$('[data-email]').forEach(el => {
    el.textContent = cfg.email || '';
    if (el.tagName === 'A') el.href = `mailto:${cfg.email || ''}`;
  });

  // One data source for both pages. All person-provided content is inserted as text.
  $$('[data-team-grid]').forEach(grid => {
    const cards = (cfg.team || []).map(person => {
      const card = create('article', 'person-card');
      const portrait = create('div', 'portrait');
      const placeholder = () => {
        const block = create('div', 'portrait-placeholder');
        const monogram = create('span', 'portrait-monogram', 'L');
        monogram.setAttribute('aria-hidden', 'true');
        block.append(monogram, create('span', '', 'Foto a inserir'));
        portrait.replaceChildren(block);
      };
      // Photos are local, authorised files. Arbitrary remote URLs are not loaded.
      if (typeof person.photo === 'string' && /^\/assets\/images\/equipe\/[\w./-]+\.(webp|avif|png|jpe?g)$/i.test(person.photo) && !person.photo.includes('..')) {
        const image = create('img');
        image.src = person.photo; image.alt = person.alt || `Retrato de ${person.name}`;
        image.width = 800; image.height = 1000; image.loading = 'lazy'; image.decoding = 'async';
        image.addEventListener('error', placeholder, { once: true });
        portrait.append(image);
      } else placeholder();
      const info = create('div', 'person-info');
      info.append(create('strong', '', person.name), create('small', '', person.role));
      if (person.bio) info.append(create('p', 'person-bio', person.bio));
      if (person.socials) {
        const socials = create('div', 'person-socials');
        Object.entries(person.socials).forEach(([label, href]) => {
          try {
            const url = new URL(href);
            if (url.protocol !== 'https:') return;
            const a = create('a', '', label);
            a.href = url.href; a.rel = 'noopener noreferrer'; a.target = '_blank';
            a.setAttribute('aria-label', `${label} de ${person.name}`);
            socials.append(a);
          } catch { /* Ignore invalid or unsafe profile links. */ }
        });
        info.append(socials);
      }
      card.append(portrait, info);
      return card;
    });
    grid.replaceChildren(...cards);
    if (!cards.length) grid.append(create('p', 'team-help', 'Nossa apresentação está em preparação. Converse com a equipe pelo WhatsApp.'));
  });

  const toggle = $('[data-menu-toggle]');
  const nav = $('[data-main-nav]');
  const drops = $$('.nav-drop-trigger');
  function closeDrops() {
    drops.forEach(button => {
      button.setAttribute('aria-expanded', 'false');
      button.nextElementSibling?.setAttribute('data-dismissed', '');
    });
  }
  function closeMenu(returnFocus = false) {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir navegação');
    closeDrops();
    if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
      if (!open) closeDrops();
    });
    $$('a', nav).forEach(a => {
      if (a.getAttribute('href') === location.pathname) a.setAttribute('aria-current', 'page');
      a.addEventListener('click', () => closeMenu());
    });
  }
  drops.forEach(button => {
    const menu = button.nextElementSibling;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      closeDrops();
      button.setAttribute('aria-expanded', String(open));
      if (open) menu?.removeAttribute('data-dismissed');
    });
    button.parentElement.addEventListener('pointerenter', () => {
      if (!window.matchMedia('(max-width: 940px)').matches) {
        button.setAttribute('aria-expanded', 'true'); menu?.removeAttribute('data-dismissed');
      }
    });
    button.parentElement.addEventListener('pointerleave', () => {
      if (!window.matchMedia('(max-width: 940px)').matches) closeDrops();
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (nav?.classList.contains('open')) closeMenu(true);
    else {
      const open = drops.find(button => button.getAttribute('aria-expanded') === 'true');
      closeDrops(); if (open) open.focus();
    }
    if (recoveryPanel) recoveryPanel.hidden = true;
    recoveryTrigger?.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', e => {
    if (nav && !nav.contains(e.target) && !toggle?.contains(e.target)) closeMenu();
  });
  nav?.addEventListener('focusout', e => {
    if (e.relatedTarget && !nav.contains(e.relatedTarget) && e.relatedTarget !== toggle) closeMenu();
  });

  $$('[data-service-topic]').forEach(link => link.addEventListener('click', () => {
    const issue = document.querySelector('[data-lead-form] [name=issue]');
    if (issue && !issue.value.trim()) {
      issue.value = `Gostaria de conversar sobre ${link.getAttribute('data-service-topic')}.`;
    }
  }));

  const segmentByPath = { '/agronegocio/': 'agro', '/industria/': 'industria', '/servicos/': 'servicos', '/transportes/': 'transportes', '/trocar-de-contador/': 'troca' };
  $$('[data-lead-form]').forEach(form => {
    const select = $('[name=segment]', form);
    if (select && segmentByPath[location.pathname]) select.value = segmentByPath[location.pathname];
    const nameInput = $('[name=name]', form);
    nameInput?.addEventListener('input', () => nameInput.setCustomValidity(''));
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (nameInput && !nameInput.value.trim()) nameInput.setCustomValidity('Por favor, informe como podemos chamar você.');
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      const segment = String(fd.get('segment') || 'geral');
      const issue = String(fd.get('issue') || '').trim();
      const message = `Olá, LuCrattiva! Meu nome é ${name}. Vim pelo site e tenho interesse em atendimento para ${segments[segment] || 'minha empresa'}. ${issue ? `Minha necessidade: ${issue}. ` : ''}Gostaria de conversar com a equipe.`;
      const url = whatsappLink(segment, message);
      track('whatsapp_form_intent', { segment, cta_position: 'qualification_form' });
      let recovery = $('[data-form-recovery]', form);
      if (!recovery) {
        recovery = create('div'); recovery.setAttribute('data-form-recovery', '');
        recovery.setAttribute('aria-live', 'polite'); form.append(recovery);
      }
      recovery.replaceChildren(recoveryContent(url, message));
      const link = create('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      document.body.append(link); link.click(); link.remove();
      // Answers intentionally remain in the form; no server request or lead storage.
    });
  });

  const banner = $('[data-consent-banner]');
  const prefs = $('[data-consent-preferences]');
  const save = $('[data-consent-save]');
  const reopen = $('[data-consent-reopen]');
  const analytics = $('[name=analytics-consent]');
  const marketing = $('[name=marketing-consent]');
  function syncPreferences() {
    if (analytics) analytics.checked = !!consent?.analytics;
    if (marketing) marketing.checked = !!consent?.marketing;
  }
  function consentCommand() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  function updateGoogleConsent() {
    consentCommand('consent', 'update', {
      analytics_storage: consent?.analytics ? 'granted' : 'denied',
      ad_storage: consent?.marketing ? 'granted' : 'denied',
      ad_user_data: consent?.marketing ? 'granted' : 'denied',
      ad_personalization: consent?.marketing ? 'granted' : 'denied'
    });
  }
  const tagsConfigured = cfg.trackingReviewed === true && /^GTM-[A-Z0-9]+$/.test(String(cfg.gtMId || ''));
  function loadTags() {
    if (!tagsConfigured || !(consent?.analytics || consent?.marketing)) return;
    if ($('[data-gtm-script]')) { updateGoogleConsent(); return; }
    // Before loading ANY optional tag: deny all Google Consent Mode v2 categories.
    consentCommand('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
    });
    updateGoogleConsent();
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = create('script');
    script.async = true; script.dataset.gtmScript = '';
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtMId)}`;
    document.head.append(script);
  }
  function store(next) {
    const previous = consent;
    consent = next;
    try { localStorage.setItem(consentKey, JSON.stringify(next)); } catch { /* Session-only choice. */ }
    if (banner) banner.hidden = true;
    if (prefs) prefs.hidden = true;
    if (save) save.hidden = true;
    syncPreferences();
    const loaded = !!$('[data-gtm-script]');
    const revoked = (previous?.analytics && !next.analytics) || (previous?.marketing && !next.marketing);
    if (loaded && revoked) {
      updateGoogleConsent();
      // A full page reload also removes already-running optional JavaScript.
      location.reload();
      return;
    }
    loadTags();
  }
  if (banner) banner.hidden = !!consent;
  syncPreferences();
  loadTags();
  $('[data-consent-all]')?.addEventListener('click', () => store({ analytics: true, marketing: true }));
  $('[data-consent-reject]')?.addEventListener('click', () => store({ analytics: false, marketing: false }));
  $('[data-consent-configure]')?.addEventListener('click', () => {
    if (prefs) prefs.hidden = !prefs.hidden;
    if (save) save.hidden = prefs?.hidden ?? true;
    syncPreferences();
    if (prefs && !prefs.hidden) analytics?.focus();
  });
  save?.addEventListener('click', () => store({ analytics: !!analytics?.checked, marketing: !!marketing?.checked }));
  function openConsent() {
    if (banner) banner.hidden = false;
    if (prefs) prefs.hidden = false;
    if (save) save.hidden = false;
    syncPreferences();
    analytics?.focus();
  }
  reopen?.addEventListener('click', openConsent);
  $$('[data-consent-open]').forEach(button => button.addEventListener('click', openConsent));
})();
