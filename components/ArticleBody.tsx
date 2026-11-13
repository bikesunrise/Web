import {entries,imageFor,type Block} from '@/lib/content';
import Link from 'next/link';
import {plain,heading,chaptersFor} from '@/lib/article';
export default function ArticleBody({blocks,title,guide=false}:{blocks:Block[];title:string;guide?:boolean}){
 const chapters=chaptersFor(blocks,guide);
 const destinations=entries.filter(e=>e.kind==='journey').slice(0,6);
 function render(b:Block,key:number){const v=b.value;
  if(b.type==='destinations')return <div className="guide-destinations" key={key}>{destinations.map(e=><Link href={e.path+'/'} key={e.path}><img src={imageFor(e)} alt="" loading="lazy"/><span>{e.title.replace('Viajar en bicicleta por ','')}<b aria-hidden="true">↗</b></span></Link>)}</div>;
  if(b.type==='html'&&typeof v==='string')return <div className={'rich-block '+(/<table[ >]/.test(v)?'table-scroll':'')} key={key} dangerouslySetInnerHTML={{__html:v}}/>;
  if(b.type==='h3')return <h3 key={key}>{v}</h3>;
  if(b.type==='h4')return <h4 key={key}>{v}</h4>;
  if(b.type==='p')return <p key={key}>{v}</p>;
  if(b.type==='blockquote')return <blockquote key={key}>{v}</blockquote>;
  if(b.type==='figure'&&typeof v==='string'&&v.startsWith('/images/'))return <figure key={key}><img src={v} alt={`Fotografía de ${title}`} loading="lazy"/></figure>;
  if((b.type==='ul'||b.type==='ol')&&Array.isArray(v)){const Tag=b.type;return <Tag key={key}>{v.map((x,j)=><li key={j}>{x}</li>)}</Tag>}
  return null;
 }
 function content(bs:Block[]){const out=[];for(let i=0;i<bs.length;i++){
  if(heading(bs[i],3)){let end=i;const cards:Block[][]=[];while(end<bs.length&&heading(bs[end],3)){const card=[bs[end++]];if(end<bs.length&&(bs[end].type==='p'||(bs[end].type==='html'&&/^\s*<p[ >]/.test(String(bs[end].value))))&&plain(String(bs[end].value)).length<180)card.push(bs[end++]);cards.push(card);}
  if(cards.length>=3){out.push(<div className="chapter-cards" key={i}>{cards.map((card,j)=><div key={j}><span className="step-number">{String(j+1).padStart(2,'0')}</span>{card.map(render)}</div>)}</div>);i=end-1;continue;}}
  out.push(render(bs[i],i));}return out;}
 const images=[{src:'/images/journey.jpg',caption:'La vida en ruta · Archivo Bikesunrise'},{src:'/images/india.jpg',caption:'India · Archivo Bikesunrise'},{src:'/images/routes.jpg',caption:'Preparar el camino · Archivo Bikesunrise'}];
 return <div className="article-body editorial-body">
 {chapters.map((c,i)=><section className={'editorial-chapter '+(!c.title?'chapter-intro':'')} id={c.title?`capitulo-${i}`:undefined} key={i}>{c.title&&<header><span className="chapter-number">{String(i).padStart(2,'0')}</span>{c.html?<h2 dangerouslySetInnerHTML={{__html:c.html}}/>:<h2>{c.title}</h2>}</header>}{guide&&i>0&&i<=3&&<figure className="chapter-landscape"><img src={images[i-1].src} alt={images[i-1].caption} loading="lazy"/><figcaption>{images[i-1].caption}</figcaption></figure>}<div className="chapter-content">{content(c.blocks)}</div></section>)}
 </div>
}
