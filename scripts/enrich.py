import json,concurrent.futures,subprocess,re,html,pathlib
from lxml import html as LH
p=pathlib.Path(__file__).resolve().parents[1]/'data/content.json'; data=json.loads(p.read_text())
def grab(entry):
 url='https://bikesunrise.com'+entry['path']+'/'
 r=subprocess.run(['curl','-LsS','--max-time','30',url],capture_output=True)
 if not r.stdout:return entry
 try: doc=LH.fromstring(r.stdout)
 except:return entry
 ttl=doc.xpath('//h1//text()') or doc.xpath('//title/text()');imgs=doc.xpath('//meta[@property="og:image"]/@content');desc=doc.xpath('//meta[@name="description"]/@content')
 if ttl:entry['title']=re.sub(r'\s+',' ',' '.join(ttl)).strip().split(' | ')[0]
 if imgs:entry['image']=imgs[0]
 if desc:entry['excerpt']=desc[0]
 # Main portfolio narrative text. Text blocks are kept without theme and navigation markup.
 for bad in doc.xpath('//header|//footer|//nav|//script|//style|//form'):bad.drop_tree()
 roots=doc.xpath('//main|//article|//*[contains(@class,"lqd-pf-single")]')
 root=roots[0] if roots else doc
 blocks=[];seen=set()
 for el in root.xpath('.//h2|.//h3|.//p|.//figure'):
  if el.tag=='figure':
   img=el.xpath('.//img');val=(img[0].get('data-src') or img[0].get('src') or '') if img else ''; typ='figure'
  else: val=re.sub(r'\s+',' ',' '.join(el.itertext())).strip(); typ=el.tag
  if len(val)>5 and len(val)<3000 and val[:120] not in seen:
   seen.add(val[:120]);blocks.append({'type':typ,'value':val})
 entry['blocks']=blocks[:180];print('journey',entry['path'],len(blocks),flush=True)
 return entry
jobs=[x for x in data if x['kind']=='journey']
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
 done=list(ex.map(grab,jobs))
lookup={x['path']:x for x in done}
data=[lookup.get(x['path'],x) for x in data]
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('Saved',len(data))
