'use client';
import Link from 'next/link';
import { useState } from 'react';
export default function Header({ overlay=false }: { overlay?: boolean }) {
 const [open,setOpen]=useState(false);
 const links=[['El atlas','/#atlas'],['Rutas','/rutas/'],['Material','/material-para-bikepacking/'],['Historias','/blog/'],['Bikesunrise','/contacto/']];
 return <header className={'site-header '+(overlay?'site-header--overlay':'site-header--solid')}>
   <Link href="/" className="wordmark" aria-label="Bikesunrise, inicio"><img src="/images/logo.png" alt="" width="48" height="48"/><span>Bikesunrise</span></Link>
   <nav className={'main-nav '+(open?'main-nav--open':'')} aria-label="Navegación principal">
     {links.map(([label,href])=><Link onClick={()=>setOpen(false)} href={href} key={href}>{label}</Link>)}
   </nav>
   <div className="header-right">
     <a className="red" href="https://www.youtube.com/@Bikesunrise" target="_blank" rel="noopener noreferrer" aria-label="Bikesunrise en YouTube">
       <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.3v5.4l4.6-2.7z" className="lleno"/></svg>
     </a>
     <a className="red" href="https://www.instagram.com/bikesunrise/" target="_blank" rel="noopener noreferrer" aria-label="Bikesunrise en Instagram">
       <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.1" cy="6.9" r="1.1" className="lleno"/></svg>
     </a>
   </div>
   <button className="menu-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?'Cerrar menú':'Abrir menú'}><span/><span/></button>
  </header>
}
