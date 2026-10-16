from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
from PIL import Image

root=Path(__file__).parent/'dist'
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.links=[];self.assets=[];self.ids=[];self.h1=0;self.title=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='title':self.title=True
        if tag=='a':self.links.append(a.get('href',''))
        if tag in ['img','script','link']:
            value=a.get('src') or a.get('href')
            if value:self.assets.append(value)
        if tag=='img':assert 'alt' in a

errors=[]
pages={}
for f in root.rglob('*.html'):
    p=Page();p.feed(f.read_text());pages[f]=p
    if p.h1!=1:errors.append(f'{f}: h1 count {p.h1}')
    if not p.title:errors.append(f'{f}: no title')
    if len(p.ids)!=len(set(p.ids)):errors.append(f'{f}: duplicate ids')
for f,p in pages.items():
    for link in p.links+p.assets:
        if not link:
            # Populated by the verified gallery / inquiry UI.
            continue
        parsed=urlsplit(link)
        if parsed.scheme or parsed.netloc:continue
        dest=root/unquote(parsed.path).lstrip('/') if parsed.path else f
        if dest.is_dir():dest=dest/'index.html'
        if not dest.exists():errors.append(f'{f}: missing {link}')
        elif parsed.fragment and dest.suffix=='.html':
            if unquote(parsed.fragment) not in pages[dest].ids:errors.append(f'{f}: missing anchor {link}')
for f in (root/'assets').glob('*.webp'):
    with Image.open(f) as im:im.verify()
manifest=json.loads((root.parent/'.openai/hosting.json').read_text())
assert manifest['project_id']=='appgprj_6acf5e3e7190819199bfc27bbc4b3609'
assert manifest['static']['directory']=='dist'
if errors:raise SystemExit('\n'.join(errors))
print(f'Passed: {len(pages)} HTML pages, internal links and anchors, image files, page headings, and hosting manifest.')
