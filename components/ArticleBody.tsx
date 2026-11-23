import {entries,imageFor,type Block} from '@/lib/content';
import Link from 'next/link';
import {BookOpen, ListChecks, ArrowUpRight} from 'lucide-react';
import {plain,heading,chaptersFor,hasContent} from '@/lib/article';
import {conIconos} from '@/lib/iconos';
import MapaRuta from '@/components/MapaRuta';
import {MAPAS} from '@/lib/mapas';
export default function ArticleBody({blocks,title,guide=false,cover}:{blocks:Block[];title:string;guide?:boolean;cover?:string}){
 const chapters=chaptersFor(blocks,guide);
 const destinations=entries.filter(e=>e.kind==='journey').slice(0,6);
 function render(b:Block,key:number){const v=b.value;const mr0=typeof v==='string'&&v.match(/class="bs-mapa-ruta" data-mapa="([a-z-]+)"/);if(mr0&&MAPAS[mr0[1]])return <MapaRuta datos={MAPAS[mr0[1]]} key={key}/>;if(!hasContent(b))return null;
  if(b.type==='destinations')return <div className="guide-destinations" key={key}>{destinations.map(e=><Link href={e.path+'/'} key={e.path}><img src={imageFor(e)} alt="" loading="lazy"/><span>{e.title.replace('Viajar en bicicleta por ','')}<b aria-hidden="true">↗</b></span></Link>)}</div>;
  if(b.type==='html'&&typeof v==='string'){
   const mr=v.match(/class="bs-mapa-ruta" data-mapa="([a-z-]+)"/);if(mr&&MAPAS[mr[1]])return <MapaRuta datos={MAPAS[mr[1]]} key={key}/>;
   if(/^\s*<(ul|ol)[ >]/.test(v))return <div className="editorial-interest" key={key}><span className="interest-label"><ListChecks size={17} aria-hidden="true"/> En detalle</span><div dangerouslySetInnerHTML={{__html:v}}/></div>;
   return <div className={'rich-block '+(/<table[ >]/.test(v)?'table-scroll':'')+(/class="bs-/.test(v)?' bs-bloque':'')} key={key} dangerouslySetInnerHTML={{__html:conIconos(v)}}/>;
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
  if(cards.length>=3&&cards.every(card=>card.length>1)){out.push(<div className="chapter-cards" key={i}>{cards.map((card,j)=><div key={j}><span className="step-number">{String(j+1).padStart(2,'0')}</span>{card.map(render)}</div>)}</div>);i=end-1;continue;}}
  out.push(render(bs[i],i));}return out;}
 const isPhoto=(b:Block)=>b.type==='figure'||(b.type==='html'&&/^\s*<figure[ >]/.test(String(b.value))&&/<img[ >]/.test(String(b.value)));
 const isParagraph=(b:Block)=>b.type==='p'||(b.type==='html'&&/^\s*<p[ >]/.test(String(b.value)));
 const wordCount=blocks.reduce((n,b)=>n+plain(Array.isArray(b.value)?b.value.join(' '):b.value).split(/\s+/).filter(Boolean).length,0);
 const readMinutes=Math.max(1,Math.ceil(wordCount/220));
 let pairIndex=0;
 function chapterBody(bs:Block[],i:number){
  const result=[];
  const paragraphs=bs.filter(isParagraph);
  // A chapter without a photograph can still have an editorial rhythm. Its
  // closing paragraph becomes a margin note, without inventing a quotation.
  if(bs.length===paragraphs.length&&bs.length>1){return <div className="story-text-spread"><div className="story-text-main">{content(bs.slice(0,-1))}</div><aside className="story-margin-note"><span className="interest-label">Para tener en cuenta</span>{content(bs.slice(-1))}</aside></div>;}
  for(let k=0;k<bs.length;k++){
   if(isPhoto(bs[k])){
    let end=k+1;while(end<bs.length&&isPhoto(bs[end]))end++;
    if(end-k>1){result.push(<div className="story-gallery" key={k}>{bs.slice(k,end).map((b,j)=><div className="gallery-item" key={j}>{render(b,j)}</div>)}</div>);k=end-1;continue;}
   }
   let photo:Block|undefined, prose:Block[]=[],end=k;
   if(isPhoto(bs[k])&&isParagraph(bs[k+1]||{type:'',value:''})){
    photo=bs[k];end=k+1;while(end<Math.min(bs.length,k+3)&&isParagraph(bs[end]))prose.push(bs[end++]);
   }else if(isParagraph(bs[k])){
    while(end<Math.min(bs.length,k+2)&&isParagraph(bs[end]))prose.push(bs[end++]);
    if(end<bs.length&&isPhoto(bs[end]))photo=bs[end++];
   }
   if(photo){const reverse=pairIndex++%2===1;
    result.push(<div className={'editorial-pair story-spread '+(reverse?'pair-reverse':'')} key={k}><div className="editorial-photo">{render(photo,k)}</div><div className="editorial-prose">{content(prose)}</div></div>);k=end-1;
   }else if(prose.length){result.push(<div className="reading-column" key={k}>{content(prose)}</div>);k=end-1;
   }else if(bs[k].type==='html'&&String(bs[k].value).includes('class="episode-card"')){
    end=k+1;while(end<bs.length&&String(bs[end].value).includes('class="episode-card"'))end++;
    result.push(<div className="story-episodes" key={k}>{content(bs.slice(k,end))}</div>);k=end-1;
   }else{
    end=k+1;while(end<bs.length&&!isParagraph(bs[end])&&!isPhoto(bs[end])&&!String(bs[end].value).includes('class="episode-card"'))end++;
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
 if(!bs.length)return null;
 return <section className={'editorial-chapter '+(!c.title?'chapter-intro':'')} id={c.title?`capitulo-${i}`:undefined} key={i}>
 {c.title&&<header><span className="chapter-number">{String(i).padStart(2,'0')}</span>{c.html?<h2 dangerouslySetInnerHTML={{__html:c.html}}/>:<h2>{c.title}</h2>}</header>}
 {!c.title&&cover&&bs.length>0&&!bs.some(isPhoto)?<div className="editorial-opening"><div className="opening-copy">{content(bs.slice(0,2))}</div><figure><img src={cover} alt={title} loading="lazy"/></figure>{bs.length>2&&<div className="opening-rest">{content(bs.slice(2))}</div>}</div>:chapterBody(bs,i)}
 </section>})}
 </div>
 {chapters.some(c=>c.title)&&<aside className="reading-rail"><nav aria-label="Índice de lectura"><span className="rail-label">EN ESTE ARTÍCULO</span>{chapters.map((c,i)=>c.title&&<a href={'#capitulo-'+i} key={i}><small>{String(i).padStart(2,'0')}</small><span>{c.title}</span></a>)}<Link className="rail-explore" href="/blog/">Más historias y guías <ArrowUpRight size={16} aria-hidden="true"/></Link></nav></aside>}
 </div></div>
}
