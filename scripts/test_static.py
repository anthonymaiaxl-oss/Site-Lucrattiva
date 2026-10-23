#!/usr/bin/env python3
"""Testes sem rede ou dependências para o protótipo estático da LuCrattiva."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted(ROOT.glob('**/*.html'))
ERRORS = []
CHECKS = 0

class HTMLAudit(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
        self.ids = set()
        self.markers = []
        self.headings = []
        self.lang = False
        self.meta_description = False
    def handle_starttag(self, name, attrs):
        a = dict(attrs)
        if name == 'html': self.lang = a.get('lang') == 'pt-BR'
        if 'id' in a: self.ids.add(a['id'])
        if name in ('a','link','img','script','source'):
            for k in ('href','src','srcset'):
                if a.get(k): self.references.append((name,k,a[k]))
        if name == 'meta' and a.get('name') == 'description' and a.get('content'): self.meta_description = True
        if name in ('h1','h2','h3'): self.headings.append(name)
        if 'data-whatsapp' in a: self.markers.append('whatsapp')
        if 'data-lead-form' in a: self.markers.append('form')
        if 'data-consent-banner' in a: self.markers.append('consent')

def assert_check(ok, label):
    global CHECKS
    CHECKS += 1
    if not ok: ERRORS.append(label)

print('AUDITORIA — PROTÓTIPO LUCRATTIVA')
assert_check(len(PAGES) >= 10, 'Esperadas ao menos 10 páginas HTML')
assert_check((ROOT/'vercel.json').is_file(), 'Config Vercel não encontrada')
for page in PAGES:
    rel = page.relative_to(ROOT).as_posix()
    h = HTMLAudit()
    h.feed(page.read_text(encoding='utf-8'))
    if rel != '404.html':
        assert_check(h.lang, f'{rel}: atributo lang pt-BR')
        assert_check('h1' in h.headings, f'{rel}: precisa de H1')
        assert_check(h.meta_description, f'{rel}: meta description')
        assert_check('whatsapp' in h.markers, f'{rel}: CTA WhatsApp')
        assert_check('consent' in h.markers, f'{rel}: banner de consentimento')
        if rel != 'privacidade/index.html': assert_check('form' in h.markers, f'{rel}: formulário de pré-atendimento')
    for tag, attr, ref in h.references:
        if ref.startswith(('http:','https:','mailto:','tel:','data:','javascript:','#')): continue
        parsed = urlparse(ref)
        if parsed.scheme or parsed.netloc: continue
        path = unquote(parsed.path)
        if not path: continue
        dest = (ROOT / path.lstrip('/')) if path.startswith('/') else (page.parent / path)
        if dest.is_dir(): dest = dest / 'index.html'
        assert_check(dest.is_file(), f'{rel}: {tag}.{attr} -> {ref} não encontrado')
    assert_check(len(h.ids)==len(set(h.ids)), f'{rel}: IDs únicos')
    print(f'  ✓ {rel} | H1={h.headings.count("h1")}, CTAs={h.markers.count("whatsapp")}')

for file in ROOT.glob('assets/**/*.svg'):
    try: ET.parse(file)
    except Exception as e: ERRORS.append(f'SVG inválido: {file.name}: {e}')
    CHECKS += 1
try: ET.parse(ROOT/'sitemap.xml')
except Exception as e: ERRORS.append('Sitemap XML inválido: '+str(e))
CHECKS += 1
try:
    conf=json.loads((ROOT/'vercel.json').read_text(encoding='utf-8'))
    assert_check(conf.get('version')==2, 'Vercel versão config deve ser 2')
except Exception as e: ERRORS.append('vercel.json inválido: '+str(e))
for js in ROOT.glob('assets/js/*.js'):
    r=subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
    assert_check(r.returncode == 0, 'JS inválido: '+js.name+' '+r.stderr)

# Validação superficial de política: tags externas de ads não aparecem hardcoded.
for page in PAGES:
    content=page.read_text(encoding='utf-8')
    assert_check('googletagmanager.com/gtm.js' not in content, f'{page.name}: GTM não pode carregar via HTML')
    assert_check('connect.facebook.net' not in content, f'{page.name}: Pixel não deve carregar sem consentimento')

print(f'\nVerificações: {CHECKS}; páginas: {len(PAGES)}; falhas: {len(ERRORS)}')
if ERRORS:
    print('\n'.join('FALHA: '+e for e in ERRORS))
    sys.exit(1)
print('RESULTADO: APROVADO em verificações estáticas. Navegador e deploy precisam de validação separada.')
