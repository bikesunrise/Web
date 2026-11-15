"""Audit exported editorial HTML: chapter targets, empty panels and local images."""
from html.parser import HTMLParser
from pathlib import Path
import json,re
class Node:
 def __init__(self,tag,attrs):self.tag=tag;self.attrs=dict(attrs);self.children=[];self.text=''
 def all(self):
  yield self
  for c in self.children:yield from c.all()
 def meaningful(self):return bool(self.text.strip()) or self.tag in ('img','iframe','video') or any(c.meaningful() for c in self.children)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.root=Node('root',[]);self.stack=[self.root]
 def handle_starttag(self,t,a):
  n=Node(t,a);self.stack[-1].children.append(n)
  if t not in ('img','br','hr','meta','link','input','source','wbr','area','base','embed','param','track'):self.stack.append(n)
 def handle_startendtag(self,t,a):self.handle_starttag(t,a);self.handle_endtag(t)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,d):self.stack[-1].text+=d
issues=[];pages=0;chapters=0;images=0
for path in Path('out').rglob('*.html'):
 p=Parser();p.feed(path.read_text());nodes=list(p.root.all());body=next((n for n in nodes if 'magazine-body' in n.attrs.get('class','').split()),None)
 if not body:continue
 pages+=1;ids={n.attrs.get('id') for n in nodes}
 for n in nodes:
  href=n.attrs.get('href','')
  if href.startswith('#capitulo-') and href[1:] not in ids:issues.append([str(path),'missing anchor',href])
 for n in body.all():
  cs=n.attrs.get('class','').split()
  if 'editorial-chapter' in cs:
   chapters+=1
   if not any(c.tag!='header' and c.meaningful() for c in n.children):issues.append([str(path),'empty chapter',n.attrs])
  if set(cs)&{'editorial-interest','chapter-cards','editorial-photo','story-margin-note','gallery-item','reading-column'} and not n.meaningful():issues.append([str(path),'empty panel',cs])
  if n.tag=='img':
   images+=1;src=n.attrs.get('src','')
   if src.startswith('/') and not (Path('public')/src.lstrip('/')).is_file():issues.append([str(path),'missing image',src])
  if n.tag not in ('script','style') and re.search('lorem ipsum',n.text,re.I):issues.append([str(path),'placeholder'])
result={'pages':pages,'chapters':chapters,'image_references':images,'issues':issues}
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(issues))
