(() => {
  'use strict';
  const cfg = window.LUCRATTIVA || {};
  const consentKey = 'lucrattiva_consent_v1';
  let consent = null;
  try { consent = JSON.parse(localStorage.getItem(consentKey) || 'null'); } catch {}
  const segments = {
    agro: 'agronegócio', industria: 'indústria', servicos: 'serviços', transportes: 'transportes',
    troca: 'troca de contador', geral: 'soluções contábeis'
  };
  function whatsappLink(segment='geral', message) {
    const fallback = `Olá, LuCrattiva! Vim pelo site e gostaria de conversar sobre ${segments[segment] || 'seus serviços'}.`;
    return `https://wa.me/${String(cfg.whatsapp || '').replace(/\D/g,'')}?text=${encodeURIComponent(message || fallback)}`;
  }
  function track(name, data = {}) {
    if (!(consent && consent.analytics)) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...data, page_path: location.pathname });
  }
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    const segment = el.getAttribute('data-whatsapp') || 'geral';
    el.setAttribute('href', whatsappLink(segment));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
    el.addEventListener('click', () => track('whatsapp_click', {segment, cta_position:el.getAttribute('data-cta')||'unclassified'}));
  });
  document.querySelectorAll('[data-public-phone]').forEach(el => { el.textContent = cfg.phoneDisplay || ''; });
  document.querySelectorAll('[data-email]').forEach(el => { el.textContent=cfg.email || ''; if(el.tagName==='A') el.href='mailto:'+(cfg.email||''); });
  document.querySelectorAll('[data-team-index]').forEach((card) => {
    const i=Number(card.getAttribute('data-team-index'));
    const person=cfg.team && cfg.team[i];
    if(!person) { card.hidden=true; return; }
    const im=card.querySelector('img'); if(im){im.src=person.photo;im.alt=person.alt||`Foto de ${person.name}`;}
    const n=card.querySelector('[data-person-name]'); if(n) n.textContent=person.name;
    const r=card.querySelector('[data-person-role]'); if(r) r.textContent=person.role;
  });
  const toggle=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('[data-main-nav]');
  if(toggle && nav){toggle.addEventListener('click',()=>{const active=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(active));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}
  const form=document.querySelector('[data-lead-form]');
  if(form){
    // Entrada por página de campanha: reduz atrito sem impedir o usuário de trocar o segmento.
    const segmentByPath = {
      '/agronegocio/': 'agro', '/industria/': 'industria',
      '/servicos/': 'servicos', '/transportes/': 'transportes',
      '/trocar-de-contador/': 'troca'
    };
    const segmentSelect = form.querySelector('[name=segment]');
    if(segmentSelect && segmentByPath[location.pathname]) segmentSelect.value = segmentByPath[location.pathname];
    form.addEventListener('submit',(e)=>{
    e.preventDefault(); if(!form.reportValidity()) return;
    const fd=new FormData(form); const name=String(fd.get('name')||'').trim(); const category=String(fd.get('segment')||'geral'); const issue=String(fd.get('issue')||'').trim();
    const message=`Olá, LuCrattiva! Meu nome é ${name}. Vim pelo site e tenho interesse em atendimento para ${segments[category] || 'minha empresa'}. ${issue ? `Minha necessidade: ${issue}. `:''}Gostaria de conversar com alguém da equipe.`;
    track('whatsapp_form_intent',{segment:category, cta_position:'qualification_form'});
    // O usuário faz o envio efetivo dentro do WhatsApp.
    const a=document.createElement('a'); a.href=whatsappLink(category,message);a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();a.remove();
  });}
  const banner=document.querySelector('[data-consent-banner]');
  const prefs=document.querySelector('[data-consent-preferences]');
  const reopen=document.querySelector('[data-consent-reopen]');
  function loadTags(){if(!(consent && (consent.analytics || consent.marketing)))return;const id=String(cfg.gtMId||'');if(!/^GTM-[A-Z0-9]+$/.test(id) || document.querySelector('[data-gtm-script]'))return;
    // O container GTM DEVE aplicar Consent Mode e respeitar consent.analytics/marketing.
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'consent_update',analytics_consent:consent.analytics,marketing_consent:consent.marketing});
    const s=document.createElement('script');s.async=true;s.dataset.gtmScript='';s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(id);document.head.appendChild(s);
  }
  function store(next){consent=next;try{localStorage.setItem(consentKey,JSON.stringify(next));}catch{}
    if(banner)banner.hidden=true;
    if(consent.analytics || consent.marketing)loadTags();
    if(!consent.analytics && !consent.marketing && document.querySelector('[data-gtm-script]'))location.reload();
  }
  if(banner){banner.hidden=!!consent;}
  if(consent) loadTags();
  document.querySelector('[data-consent-all]')?.addEventListener('click',()=>store({analytics:true,marketing:true}));
  document.querySelector('[data-consent-reject]')?.addEventListener('click',()=>store({analytics:false,marketing:false}));
  document.querySelector('[data-consent-configure]')?.addEventListener('click',()=>{if(prefs)prefs.hidden=!prefs.hidden;});
  document.querySelector('[data-consent-save]')?.addEventListener('click',()=>store({analytics:!!document.querySelector('[name=analytics-consent]')?.checked,marketing:!!document.querySelector('[name=marketing-consent]')?.checked}));
  if(reopen)reopen.addEventListener('click',()=>{if(banner)banner.hidden=false; if(prefs)prefs.hidden=false;});
})();
