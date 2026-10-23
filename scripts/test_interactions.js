// Testes de lógica do script, sem navegador nem dependências de terceiros.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../assets/js/site.js'),'utf8');
class El {
  constructor(attrs={}) {this.attrs={...attrs};this.listeners={};this.hidden=false;this.textContent='';}
  getAttribute(k){return this.attrs[k] ?? null;}
  setAttribute(k,v){this.attrs[k]=String(v);}
  addEventListener(k,fn){this.listeners[k]=fn;}
  click(){this.listeners.click?.();}
}
const waGeneral=new El({'data-whatsapp':'geral','data-cta':'header'});
const waAgro=new El({'data-whatsapp':'agro','data-cta':'agro-hero'});
const banner=new El();
const prefs=new El();
const consentAll=new El();
const consentReject=new El();
const consentConfigure=new El();
const consentSave=new El();
const consentReopen=new El();
const elements={
 '[data-menu-toggle]':null,'[data-main-nav]':null,'[data-lead-form]':null,
 '[data-consent-banner]':banner,'[data-consent-preferences]':prefs,
 '[data-consent-all]':consentAll,'[data-consent-reject]':consentReject,
 '[data-consent-configure]':consentConfigure,'[data-consent-save]':consentSave,
 '[data-consent-reopen]':consentReopen,
};
const pushedScripts=[];
const storage=new Map();
const context={
 window:{LUCRATTIVA:{whatsapp:'5565999513928',gtMId:'GTM-TEST123'},dataLayer:[]},
 location:{pathname:'/agronegocio/',reload:()=>{context.reloaded=true;}},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 document:{
  querySelectorAll:(q)=>q==='[data-whatsapp]'?[waGeneral,waAgro]:[],
  querySelector:(q)=>q==='[data-gtm-script]'?(pushedScripts[0]||null):(elements[q]||null),
  createElement:(name)=>{assert.equal(name,'script'); return {dataset:{},src:'',async:false};},
  head:{appendChild:(s)=>pushedScripts.push(s)}
 },
 console, URL, encodeURIComponent,
};
vm.runInNewContext(source,context,{filename:'site.js'});
assert.ok(waGeneral.attrs.href.startsWith('https://wa.me/5565999513928?text='));
assert.ok(decodeURIComponent(waAgro.attrs.href).includes('agronegócio'));
assert.equal(banner.hidden,false,'consentimento inicial deve estar aberto');
assert.equal(pushedScripts.length,0,'GTM não deve carregar antes do consentimento');
waAgro.click();
assert.equal(context.window.dataLayer.length,0,'tracking não deve disparar antes do consentimento');
consentAll.click();
assert.equal(pushedScripts.length,1,'GTM deve carregar após aceite e somente uma vez');
waAgro.click();
assert.equal(context.window.dataLayer.at(-1).event,'whatsapp_click');
assert.equal(context.window.dataLayer.at(-1).segment,'agro');
consentReject.click();
assert.equal(context.reloaded,true,'revogação deve recarregar e retirar tags opcionais');
console.log('INTERAÇÕES: 10 asserções passaram (links WA, contexto, consentimento, GTM, tracking e revogação).');
