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
import GuiaRuta from '@/components/GuiaRuta';
import {GUIAS} from '@/lib/guias';
import HistoriaV2, { heroIlustrado } from '@/components/HistoriaV2';
import '../portada-v2.css';
import '../historia-v2.css';
import {entries,byPath,archiveSources,archiveItems,imageFor,category} from '@/lib/content';
type Props={params:Promise<{slug:string[]}>};
export function generateStaticParams(){return entries.map(e=>({slug:e.path.split('/').filter(Boolean)}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params; const e=byPath.get('/'+slug.join('/')); return e?{title:e.title,description:e.excerpt?.slice(0,160)||`Explora ${e.title} en Bikesunrise.`,alternates:{canonical:e.path+'/'},openGraph:{images:e.image?[e.image]:[]},robots:e.blocks.length || e.kind==='archive'?undefined:{index:false,follow:false}}:{title:'Página no encontrada'}}
// cabeceras con patrón de líneas (bocetos/cabeceras/patrones.py): cada página con su dibujo
const PATRON: Record<string,string> = {'/rutas':'rutas','/eurovelo':'eurovelo','/resenas':'resenas','/viajar':'viajar','/herramientas':'herramientas','/seguros':'seguros','/aviso-legal':'legal','/privacidad':'legal','/cookies':'legal','/politica-privacidad':'legal','/politica-de-cookies-ue':'legal'};
export default async function ContentPage({params}:Props){const {slug}=await params;const path='/'+slug.join('/');const entry=byPath.get(path);if(!entry)notFound();
 if(path==='/material-para-bikepacking')return <><Header/><main><GearBrowser/></main><Footer/></>;
 const isArchive=!!archiveSources[path] || entry.kind==='archive';
 if(path==='/contacto')return <><Header/><main className="inner-page contact-page"><section className="archive-hero editorial-hero topographic-hero patron-hero contact-hero"><div><span className="section-kicker">BIKESUNRISE / CONTACTO</span><h1>Nos vemos en el camino</h1><p>¿Tienes una pregunta sobre viajar en bicicleta, una propuesta o una historia que compartir? Escríbeme.</p></div><div className="archive-hero-photo" style={{backgroundImage:"url('/images/patrones/contacto.svg')"}}/></section><div className="contact-layout"><div><h2>Hablemos de aventuras.</h2><p>Una conversación puede ser el comienzo de un viaje. También puedes seguir el camino en <a href="https://www.instagram.com/bikesunrise/" target="_blank" rel="noopener noreferrer">Instagram ↗</a> y <a href="https://www.youtube.com/@Bikesunrise" target="_blank" rel="noopener noreferrer">YouTube ↗</a>.</p></div><ContactForm/></div></main><Footer/></>;
 if(String(entry.kind)==='journey')return <><Header overlay={!heroIlustrado(path.split('-por-').pop()||'')}/><main><HistoriaV2 entry={entry}/></main></>;
 const illustratedStory=entry.kind==='journey'||path.startsWith('/rutas/')||path.startsWith('/eurovelo/');
 const intro=path==='/viajar-en-bicicleta'?'Todo lo que necesitas para viajar en bicicleta: cómo preparar tu primera ruta, elegir el material y organizar la vida en el camino.':entry.excerpt;
 const related=entries.filter(x=>x.path!==path && x.kind==='article' && x.path.split('/')[1]===path.split('/')[1]).slice(0,3);
 if(isArchive)return <><Header/><main className="inner-page archive-page"><section className={"archive-hero editorial-hero "+(path==='/blog'?'topographic-hero':PATRON[path]?'topographic-hero patron-hero':'')}><div><span className="section-kicker">BIKESUNRISE / EXPLORAR</span><h1>{entry.title}</h1><p>{entry.excerpt || 'Experiencias reales, rutas para descubrir y conocimiento acumulado en el camino.'}</p></div><div className="archive-hero-photo" style={{backgroundImage:`url('${path==='/blog'?'/images/blog-topography.png':PATRON[path]?`/images/patrones/${PATRON[path]}.svg`:path==='/portfolio/viajes'?'/images/hero-baixa.webp':imageFor(entry)}')`}}/></section><div className="archive-content"><ArchiveBrowser items={archiveItems(path).map(({blocks,...summary})=>({...summary,blocks:[]}))} showFilters={path==='/blog'}/></div></main><Footer/></>;
 return <><Header/><main className={"inner-page article-page"+(illustratedStory?" illustrated-story":"")}><div className={"article-top editorial-hero "+(entry.coverage?"topographic-hero":PATRON[path]?"topographic-hero patron-hero":"")}><div className="article-heading"><Link className="breadcrumb" href={entry.kind==='journey'?'/portfolio/viajes/':'/blog/'}>← VOLVER A {entry.kind==='journey'?'EXPEDICIONES':'HISTORIAS'}</Link><span className="article-category">{category(path)} {entry.date && `· ${entry.date}`}</span><h1>{entry.title}</h1>{intro&&<p>{intro}</p>}</div><div className="article-cover" style={{backgroundImage:`url('${entry.coverage?'/images/blog-topography.png':PATRON[path]?`/images/patrones/${PATRON[path]}.svg`:path==='/viajar-en-bicicleta'?'/images/journey.jpg':imageFor(entry)}')`}} role="img" aria-label={entry.title}/>{!GUIAS[path]&&<ArticleRoadmap entry={entry}/>}</div>{!GUIAS[path]&&<ArticleSummary entry={entry}/>}
 <div className="article-layout"><article>{GUIAS[path]?(()=>{const vals=entry.blocks.map(b=>typeof b.value==='string'?b.value:'');const intro=vals.filter(v=>/^\s*<p[ >]/.test(v)).slice(1,3).join('');return <><div className="gr-intro" dangerouslySetInnerHTML={{__html:intro}}/><GuiaRuta guia={GUIAS[path]} faqHtml={vals.find(v=>v.includes('bs-faq'))} conclusionHtml={vals.find(v=>v.includes('Mi conclusión'))}/></>})():<ArticleBody blocks={entry.blocks} title={entry.title} cover={entry.image || undefined} guide={path==='/viajar-en-bicicleta'}/>}{!entry.blocks.length&&<p className="article-empty">Contenido pendiente de revisión editorial antes de publicar esta página.</p>}</article></div>
 {related.length>0&&<section className="related-section"><h2>Seguir explorando</h2><div>{related.map(x=><Link href={x.path+'/' } key={x.path}><span>{category(x.path)}</span><strong>{x.title}</strong><b>↗</b></Link>)}</div></section>}
 </main><Footer/></>}
