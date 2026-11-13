'use client';
import { useMemo,useState } from 'react';
import Link from 'next/link';
import type { Entry } from '@/lib/content';
import { category,imageFor } from '@/lib/content';
export default function ArchiveBrowser({items,showFilters=false}:{items:Entry[];showFilters?:boolean}){
 const [query,setQuery]=useState(''); const [filter,setFilter]=useState('Todo'); const [visibleCount,setVisibleCount]=useState(18);
 const options=['Todo','América','Expedición','Ruta','Guía','Reseña','EuroVelo','Herramientas','Seguros'];
 const filtered=useMemo(() => items.filter(x => {
   const matchesCategory = filter === 'Todo' || (filter==='América' ? !!x.coverage : category(x.path) === filter);
   const matchesQuery = `${x.title} ${x.excerpt}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'));
   return matchesCategory && matchesQuery;
 }), [items,filter,query]);
 return <div className="archive-browser">
  <div className="archive-controls"><div className="archive-tabs" aria-label="Filtrar contenidos">{showFilters&&options.map(o=><button key={o} aria-pressed={filter===o} className={filter===o?'active':''} onClick={()=>{setFilter(o);setVisibleCount(18)}}>{o}</button>)}</div><label className="archive-search"><span className="sr-only">Buscar contenidos</span><input value={query} onChange={e=>{setQuery(e.target.value);setVisibleCount(18)}} placeholder="Buscar historias y guías" type="search"/></label></div>
  {filtered.length?<div className="story-grid editorial-trail">{filtered.slice(0,visibleCount).map((item,i)=><Link className={'story-card '+(i%7===0?'story-card--large':'')} href={item.path+'/' } key={item.path}>
   <div className="story-image" style={{backgroundImage:`url("${imageFor(item)}")`}} role="img" aria-label={item.title}/><div className="story-copy"><span>{String(i+1).padStart(2,'0')} / {category(item.path)}</span><h2>{item.title}</h2><p>{item.excerpt || 'Una historia de Bikesunrise para seguir explorando sobre dos ruedas.'}</p><span className="glass-link">Explorar la historia <b aria-hidden="true">↗</b></span></div>
  </Link>)}</div>:<p className="empty-state">No hay resultados para esta búsqueda.</p>}
  {filtered.length>visibleCount&&<button className="load-more" onClick={()=>setVisibleCount(n=>n+18)}>CARGAR MÁS HISTORIAS ↓</button>}
 </div>
}
