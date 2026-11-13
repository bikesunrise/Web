import json,pathlib,subprocess,concurrent.futures,re,urllib.parse,hashlib
from lxml import html as LH
root=pathlib.Path(__file__).resolve().parents[1];p=root/'data/content.json';data=json.loads(p.read_text());lookup={x['path']:x for x in data}
allowed={'h2','h3','h4','p','ul','ol','li','blockquote','figure','figcaption','img','a','strong','b','em','i','br','table','thead','tbody','tr','th','td','sup','sub'}
container={'p','ul','ol','figure','blockquote','table'}
def local(u):
 if not u or not u.startswith('https://bikesunrise.com/wp-content/uploads/'):return u
 ext=pathlib.Path(urllib.parse.urlparse(u).path).suffix.lower()
 if ext not in ('.jpg','.jpeg','.png','.webp','.avif','.gif'):return u
 path=root/'public/images/content'/(hashlib.sha1(u.encode()).hexdigest()[:16]+ext)
 return '/images/content/'+path.name if path.exists() else u
def clean(el):
 for node in list(el.iterdescendants())[::-1]:
  if not isinstance(node.tag,str):continue
  if node.tag.lower() not in allowed:
   if node.tag in ('script','style','iframe','form','button'):node.drop_tree()
   else:node.drop_tag()
 for node in el.iter():
  if not isinstance(node.tag,str):continue
  attrs=dict(node.attrib);node.attrib.clear()
  if node.tag=='a':
   href=attrs.get('href','')
   if href.startswith('https://bikesunrise.com/'):
    href=urllib.parse.urlparse(href).path or '/'
   if href.startswith(('https://','http://','mailto:','/','#')):node.set('href',href)
   if href.startswith(('https://','http://')):node.set('rel','noopener noreferrer')
  elif node.tag=='img':
   src=attrs.get('data-src') or attrs.get('src') or ''
   if src.startswith('https://bikesunrise.com/wp-content/uploads/'):
    node.set('src',local(src));node.set('loading','lazy');node.set('alt',attrs.get('alt',''))
   else:node.drop_tree()
  elif node.tag in ('th','td') and attrs.get('colspan','').isdigit():node.set('colspan',attrs['colspan'])
 return LH.tostring(el,encoding='unicode',method='html',with_tail=False)
def blocks(raw):
 try:doc=LH.fromstring(raw or '<div/>')
 except:return []
 for bad in doc.xpath('//script|//style|//nav|//form|//noscript'):bad.drop_tree()
 out=[];seen=set()
 for el in doc.xpath('//h2|//h3|//h4|//p|//ul|//ol|//blockquote|//figure|//table'):
  if any(a.tag in container for a in el.iterancestors()):continue
  text=re.sub(r'\s+',' ',' '.join(el.itertext())).strip()
  if el.tag!='figure' and (len(text)<4 or len(text)>10000):continue
  markup=clean(el)
  if len(markup)<10:continue
  key=el.tag+text[:140]
  if key in seen:continue
  seen.add(key);out.append({'type':'html','value':markup})
 return out[:220]
def fetch(kind,page):
 url=f'https://bikesunrise.com/wp-json/wp/v2/{kind}?per_page=10&page={page}&_fields=link,content'
 r=subprocess.run(['curl','-LsS','--max-time','45',url],capture_output=True)
 try:return json.loads(r.stdout)
 except:return []
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as ex:
 batches=list(ex.map(lambda x: fetch(*x),[('posts',i) for i in range(1,7)]+[('pages',i) for i in range(1,5)]))
count=0
for batch in batches:
 for item in batch:
  path=urllib.parse.urlparse(item['link']).path.rstrip('/') or '/'
  if path in lookup and lookup[path]['kind']!='archive':
   b=blocks(item.get('content',{}).get('rendered',''))
   if b:lookup[path]['blocks']=b;count+=1
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('Rich content',count,'pages; preserved links',sum(x['value'].count('href=') for e in data for x in e['blocks'] if x['type']=='html'))
