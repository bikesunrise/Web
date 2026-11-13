import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArchiveBrowser from '@/components/ArchiveBrowser';
import ArticleRoadmap,{ArticleSummary} from '@/components/ArticleRoadmap';
import ArticleBody from '@/components/ArticleBody';
import ContactForm from '@/components/ContactForm';
import GearBrowser from '@/components/GearBrowser';
import {entries,byPath,archiveSources,archiveItems,imageFor,category} from '@/lib/content';
type Props={params:Promise<{slug:string[]}>};
export function generateStaticParams(){return entries.map(e=>({slug:e.path.split('/').filter(Boolean)}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params; const e=byPath.get('/'+slug.join('/')); return e?{title:e.title,description:e.excerpt?.slice(0,160)||`Explora ${e.title} en Bikesunrise.`,alternates:{canonical:e.path+'/'},openGraph:{images:e.image?[e.image]:[]},robots:e.blocks.length || e.kind==='archive'?undefined:{index:false,follow:false}}:{title:'Página no encontrada'}}
export default async function ContentPage({params}:Props){const {slug}=await params;const path='/'+slug.join('/');const entry=byPath.get(path);if(!entry)notFound();
 if(path==='/material-para-bikepacking')return <><Header/><main><GearBrowser/></main><Footer/></>;
 const isArchive=!!archiveSources[path] || entry.kind==='archive';
 if(path==='/contacto')return <><Header/><main className="inner-page contact-page"><section className="contact-head"><span className="section-kicker">BIKESUNRISE / CONTACTO</span><h1>Nos vemos en el camino.</h1><p>¿Tienes una pregunta sobre viajar en bicicleta, una propuesta o una historia que compartir? Escríbeme.</p></section><div className="contact-layout"><div><h2>Hablemos de aventuras.</h2><p>Una conversación puede ser el comienzo de un viaje. También puedes seguir el camino en <a href="https://www.instagram.com/bikesunrise/" target="_blank" rel="noopener noreferrer">Instagram ↗</a> y <a href="https://www.youtube.com/@Bikesunrise" target="_blank" rel="noopener noreferrer">YouTube ↗</a>.</p></div><ContactForm/></div></main><Footer/></>;
 const intro=path==='/viajar-en-bicicleta'?'Todo lo que necesitas para viajar en bicicleta: cómo preparar tu primera ruta, elegir el material y organizar la vida en el camino.':entry.excerpt;
 const related=entries.filter(x=>x.path!==path && x.kind==='article' && x.path.split('/')[1]===path.split('/')[1]).slice(0,3);
 if(isArchive)return <><Header/><main className="inner-page archive-page"><section className={"archive-hero editorial-hero "+(path==='/blog'?'topographic-hero':'')}><div><span className="section-kicker">BIKESUNRISE / EXPLORAR</span><h1>{entry.title}</h1><p>{entry.excerpt || 'Experiencias reales, rutas para descubrir y conocimiento acumulado en el camino.'}</p></div><div className="archive-hero-photo" style={{backgroundImage:`url('${path==='/blog'?'/images/blog-topography.png':path==='/portfolio/viajes'?'/images/hero-baixa.webp':imageFor(entry)}')`}}/></section><div className="archive-content"><ArchiveBrowser items={archiveItems(path).map(({blocks,...summary})=>({...summary,blocks:[]}))} showFilters={path==='/blog'}/></div></main><Footer/></>;
 return <><Header/><main className="inner-page article-page"><div className={"article-top editorial-hero "+(entry.coverage?"topographic-hero":"")}><div className="article-heading"><Link className="breadcrumb" href={entry.kind==='journey'?'/portfolio/viajes/':'/blog/'}>← VOLVER A {entry.kind==='journey'?'EXPEDICIONES':'HISTORIAS'}</Link><span className="article-category">{category(path)} {entry.date && `· ${entry.date}`}</span><h1>{entry.title}</h1>{intro&&<p>{intro}</p>}</div><div className="article-cover" style={{backgroundImage:`url('${entry.coverage?'/images/blog-topography.png':path==='/viajar-en-bicicleta'?'/images/journey.jpg':imageFor(entry)}')`}} role="img" aria-label={entry.title}/><ArticleRoadmap entry={entry}/></div><ArticleSummary entry={entry}/>
 <div className="article-layout"><article><ArticleBody blocks={entry.blocks} title={entry.title} guide={path==='/viajar-en-bicicleta'}/>{!entry.blocks.length&&<p className="article-empty">Contenido pendiente de revisión editorial antes de publicar esta página.</p>}</article></div>
 {related.length>0&&<section className="related-section"><h2>Seguir explorando</h2><div>{related.map(x=><Link href={x.path+'/' } key={x.path}><span>{category(x.path)}</span><strong>{x.title}</strong><b>↗</b></Link>)}</div></section>}
 </main><Footer/></>}
