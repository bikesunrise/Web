import {entries,imageFor,type Block} from '@/lib/content';
import Link from 'next/link';
import {BookOpen, ListChecks, ArrowUpRight} from 'lucide-react';
import {plain,heading,chaptersFor} from '@/lib/article';
export default function ArticleBody({blocks,title,guide=false,cover}:{blocks:Block[];title:string;guide?:boolean;cover?:string}){
 const chapters=chaptersFor(blocks,guide);
 const destinations=entries.filter(e=>e.kind==='journey').slice(0,6);
 function render(b:Block,key:number){const v=b.value;
  if(b.type==='destinations')return <div className="guide-destinations" key={key}>{destinations.map(e=><Link href={e.path+'/'} key={e.path}><img src={imageFor(e)} alt="" loading="lazy"/><span>{e.title.replace('Viajar en bicicleta por ','')}<b aria-hidden="true">↗</b></span></Link>)}</div>;
  if(b.type==='html'&&typeof v==='string'){
   if(/^\s*<(ul|ol)[ >]/.test(v))return <div className="editorial-interest" key={key}><span className="interest-label"><ListChecks size={17} aria-hidden="true"/> En detalle</span><div dangerouslySetInnerHTML={{__html:v}}/></div>;
   return <div className={'rich-block '+(/<table[ >]/.test(v)?'table-scroll':'')} key={key} dangerouslySetInnerHTML={{__html:v}}/>;
  }
  if(b.type==='h3')return <h3 key={key}>{v}</h3>;
  if(b.type==='h4')return <h4 key={key}>{v}</h4>;
  if(b.type==='p')return <p key={key}>{v}</p>;
  if(b.type==='blockquote')return <blockquote key={key}>{v}</blockquote>;
  if(b.type==='figure'&&typeof v==='string'&&v.startsWith('/images/'))return <figure key={key}><img src={v} alt={`Fotografía de ${title}`} loading="lazy"/></figure>;
  if((b.type==='ul'||b.type==='ol')&&Array.isArray(v)){const Tag=b.type;return <div className="editorial-interest" key={key}><span className="interest-label"><ListChecks size={17} aria-hidden="true"/> En detalle</span><Tag>{v.map((x,j)=><li key={j}>{x}</li>)}</Tag></div>}
  return null;
 }
 function content(bs:Block[]){const out=[];for(let i=0;i<bs.length;i++){
  if(heading(bs[i],3)){let end=i;const cards:Block[][]=[];while(end<bs.length&&heading(bs[end],3)){const card=[bs[end++]];if(end<bs.length&&(bs[end].type==='p'||(bs[end].type==='html'&&/^\s*<p[ >]/.test(String(bs[end].value))))&&plain(String(bs[end].value)).length<180)card.push(bs[end++]);cards.push(card);}
  if(cards.length>=3){out.push(<div className="chapter-cards" key={i}>{cards.map((card,j)=><div key={j}><span className="step-number">{String(j+1).padStart(2,'0')}</span>{card.map(render)}</div>)}</div>);i=end-1;continue;}}
  out.push(render(bs[i],i));}return out;}
 const isPhoto=(b:Block)=>b.type==='figure'||(b.type==='html'&&/^\s*<figure[ >]/.test(String(b.value))&&/<img[ >]/.test(String(b.value)));
 const isParagraph=(b:Block)=>b.type==='p'||(b.type==='html'&&/^\s*<p[ >]/.test(String(b.value)));
 const wordCount=blocks.reduce((n,b)=>n+plain(Array.isArray(b.value)?b.value.join(' '):b.value).split(/\s+/).filter(Boolean).length,0);
 const readMinutes=Math.max(1,Math.ceil(wordCount/220));
 function chapterBody(bs:Block[],i:number){
  // Keep every source block and its order; pair only an adjacent photo and prose.
  const result=[];
  for(let k=0;k<bs.length;k++){
   if(isPhoto(bs[k])&&isParagraph(bs[k+1]||{type:'',value:''})){
    let end=k+1;while(end<Math.min(bs.length,k+3)&&isParagraph(bs[end]))end++;
    result.push(<div className={'editorial-pair '+(i%2?'pair-reverse':'')} key={k}><div className="editorial-photo">{render(bs[k],k)}</div><div className="editorial-prose">{content(bs.slice(k+1,end))}</div></div>);k=end-1;
   }else if(isParagraph(bs[k])){
    let end=k;while(end<Math.min(bs.length,k+2)&&isParagraph(bs[end]))end++;
    if(end<bs.length&&isPhoto(bs[end])){
     result.push(<div className={'editorial-pair '+(i%2?'pair-reverse':'')} key={k}><div className="editorial-prose">{content(bs.slice(k,end))}</div><div className="editorial-photo">{render(bs[end],end)}</div></div>);k=end;
    }else{result.push(<div className="reading-column" key={k}>{content(bs.slice(k,end))}</div>);k=end-1;}
   }else{
    let end=k+1;while(end<bs.length&&!isParagraph(bs[end])&&!isPhoto(bs[end]))end++;
    result.push(<div className={isPhoto(bs[k])?'editorial-wide-photo':'reading-column'} key={k}>{content(bs.slice(k,end))}</div>);k=end-1;
   }
  }
  return result;
 }
 return <div className="article-body editorial-body magazine-body">
 <div className="reading-meta"><span><BookOpen size={16} aria-hidden="true"/> CUADERNO BIKESUNRISE</span><span>{readMinutes} min de lectura aprox.</span></div>
 <div className="magazine-layout"><div className="magazine-main">
 {chapters.map((c,i)=>{
 const bs=!c.title?c.blocks.filter(b=>!isParagraph(b)||plain(String(b.value)).toLocaleLowerCase()!==title.toLocaleLowerCase()):c.blocks;
 return <section className={'editorial-chapter '+(!c.title?'chapter-intro':'')} id={c.title?`capitulo-${i}`:undefined} key={i}>
 {c.title&&<header><span className="chapter-number">{String(i).padStart(2,'0')}</span>{c.html?<h2 dangerouslySetInnerHTML={{__html:c.html}}/>:<h2>{c.title}</h2>}</header>}
 {!c.title&&cover&&bs.length>0&&!bs.some(isPhoto)?<div className="editorial-opening"><div className="opening-copy">{content(bs.slice(0,2))}</div><figure><img src={cover} alt={title} loading="lazy"/></figure>{bs.length>2&&<div className="opening-rest">{content(bs.slice(2))}</div>}</div>:chapterBody(bs,i)}
 </section>})}
 </div>
 {chapters.some(c=>c.title)&&<aside className="reading-rail"><nav aria-label="Índice de lectura"><span className="rail-label">EN ESTE ARTÍCULO</span>{chapters.map((c,i)=>c.title&&<a href={'#capitulo-'+i} key={i}><small>{String(i).padStart(2,'0')}</small><span>{c.title}</span></a>)}<Link className="rail-explore" href="/blog/">Más historias y guías <ArrowUpRight size={16} aria-hidden="true"/></Link></nav></aside>}
 </div></div>
}
