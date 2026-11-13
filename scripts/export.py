import json, re, urllib.request, urllib.parse, xml.etree.ElementTree as ET, html, concurrent.futures, pathlib, time
from lxml import html as LH
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE='https://bikesunrise.com'
HEAD={'User-Agent':'Bikesunrise redesign prototype/1.0'}
def get(url):
    import subprocess
    for attempt in range(2):
        r=subprocess.run(['curl','-L','-sS','--max-time','50',url],capture_output=True)
        if r.returncode==0 and r.stdout: return r.stdout
    print('ERROR',url,r.stderr.decode()[:100]); return b''
def clean_title(s):
    s=html.unescape(re.sub('<[^>]+>','',s or ''))
    return re.sub(r'\s+',' ',s).strip()
def urlpath(url):
    p=urllib.parse.urlparse(url).path
    return p.rstrip('/') or '/'
def content_blocks(raw):
    try: doc=LH.fromstring(raw or '<div/>')
    except: return []
    for bad in doc.xpath('//script|//style|//nav|//form|//noscript|//*[contains(@class,"elementor-widget-share-buttons")]|//*[contains(@class,"elementor-widget-post-info")]'): bad.drop_tree()
    blocks=[]; seen=set()
    for el in doc.xpath('//h2|//h3|//h4|//p|//ul|//ol|//blockquote|//figure'):
        if any(a.tag in ('p','ul','ol','figure','blockquote') for a in el.iterancestors()): continue
        tag=el.tag
        if tag in ('ul','ol'):
            items=[re.sub(r'\s+',' ',t).strip() for t in el.xpath('./li//text()')]
            items=[x for x in items if len(x)>2]
            if not items: continue
            value=items[:30]
        elif tag=='figure':
            img=el.xpath('.//img')
            if not img: continue
            value=img[0].get('data-src') or img[0].get('src') or ''
            if not value.startswith('http'): continue
        else:
            value=re.sub(r'\s+',' ',' '.join(el.itertext())).strip()
            if len(value)<5 or len(value)>3000: continue
        key=tag+str(value)[:180]
        if key in seen: continue
        seen.add(key)
        blocks.append({'type':tag,'value':value})
    return blocks[:220]
def get_api(endpoint):
    raw=get(BASE+'/wp-json/wp/v2/'+endpoint)
    try: return json.loads(raw)
    except: return []
def fetch_batch(item):
    kind,page=item
    return get_api(f'{kind}?per_page=10&page={page}&_fields=id,slug,link,title,content,excerpt,featured_media,date,type')
batches=[('posts',p) for p in range(1,7)]+[('pages',p) for p in range(1,5)]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    outputs=list(pool.map(fetch_batch,batches))
posts=[v for i,part in enumerate(outputs[:6]) for v in part]
pages=[v for part in outputs[6:] for v in part]
print('API',len(posts),len(pages))
all_items=[]
for item in posts+pages:
    path=urlpath(item['link'])
    if path=='/': continue
    img='' 
    if not img:
        m=re.search(r'<img[^>]+(?:data-src|src)="(https?[^\"]+)',item.get('content',{}).get('rendered',''))
        img=html.unescape(m.group(1)) if m else ''
    all_items.append({'path':path,'title':clean_title(item['title']['rendered']),'excerpt':clean_title(item.get('excerpt',{}).get('rendered',''))[:280], 'image':img, 'date':item.get('date','')[:10], 'kind':'article' if item['type']=='post' else 'page','blocks':content_blocks(item.get('content',{}).get('rendered',''))})
# Portfolio often is a non-REST custom post type; discover via its RankMath sitemap.
sm=get(BASE+'/liquid-portfolio-sitemap.xml')
try: urls=[el.text for el in ET.fromstring(sm).iter() if el.tag=='{http://www.sitemaps.org/schemas/sitemap/0.9}loc' and el.text]
except: urls=[]
urls=[u for u in urls if urlpath(u) not in {x['path'] for x in all_items}]
def fetch_portfolio(url):
    path=urlpath(url); slug=path.split('/')[-1]; title=slug.replace('-',' ').capitalize()
    return {'path':path,'title':title,'excerpt':'', 'image':'', 'date':'','kind':'journey','blocks':[]}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for item in pool.map(fetch_portfolio,urls):
        if item: all_items.append(item)
# Non-REST archive routes; derive from real titles/content.
archive_paths=['/blog','/rutas','/resenas','/eurovelo','/viajar','/herramientas','/portfolio/viajes','/videos-bikesunrise','/portfolios']
for p in archive_paths:
    if p not in {x['path'] for x in all_items}:
        all_items.append({'path':p,'title':{'/portfolio/viajes':'Viajes en bicicleta','/resenas':'Reseñas de material','/rutas':'Rutas en bicicleta','/eurovelo':'EuroVelo','/blog':'Historias, rutas y consejos','/viajar':'Viajar en bicicleta','/herramientas':'Herramientas','/videos-bikesunrise':'Vídeos Bikesunrise','/portfolios':'Viajes en bicicleta'}.get(p,p.strip('/').title()),'excerpt':'','image':'','date':'','kind':'archive','blocks':[]})
all_items.sort(key=lambda x:x['path'])
(ROOT/'data/content.json').write_text(json.dumps(all_items,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('EXPORTED',len(all_items),'records',sum(len(x['blocks']) for x in all_items),'blocks', (ROOT/'data/content.json').stat().st_size,'bytes')
print('Portfolio',len(urls))
