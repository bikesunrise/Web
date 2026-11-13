import json,pathlib,hashlib,urllib.parse,subprocess,concurrent.futures,re
root=pathlib.Path(__file__).resolve().parents[1];p=root/'data/content.json'; data=json.loads(p.read_text())
urls={a['image'] for a in data if a['image'].startswith('https://bikesunrise.com/wp-content/uploads/')}
urls|={b['value'] for a in data for b in a['blocks'] if b['type']=='figure' and isinstance(b['value'],str) and b['value'].startswith('https://bikesunrise.com/wp-content/uploads/')}
urls=sorted(urls);out=root/'public/images/content';out.mkdir(parents=True,exist_ok=True)
def fetch(u):
 ext=pathlib.Path(urllib.parse.urlparse(u).path).suffix.lower();ext=ext if ext in ('.jpg','.jpeg','.png','.webp','.avif','.gif') else '.jpg'
 name=hashlib.sha1(u.encode()).hexdigest()[:16]+ext;target=out/name
 if not target.exists():
  r=subprocess.run(['curl','-LsS','--max-time','20',u,'-o',str(target)],capture_output=True)
  if r.returncode or target.stat().st_size<500:target.unlink(missing_ok=True);return u,None
 return u,'/images/content/'+name
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:results=dict(pool.map(fetch,urls))
for a in data:
 a['image']=results.get(a['image']) or a['image']
 for b in a['blocks']:
  if b['type']=='figure':b['value']=results.get(b['value']) or b['value']
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('localized',sum(bool(v) for v in results.values()),'of',len(urls),'bytes',sum(f.stat().st_size for f in out.iterdir()))
print('failed',[u for u,v in results.items() if not v][:10])
