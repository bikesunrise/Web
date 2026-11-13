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
   <div className="header-right"><a href="https://www.youtube.com/@Bikesunrise" target="_blank" rel="noopener noreferrer" aria-label="Bikesunrise en YouTube">YT</a><a href="https://www.instagram.com/bikesunrise/" target="_blank" rel="noopener noreferrer" aria-label="Bikesunrise en Instagram">IG</a></div>
   <button className="menu-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?'Cerrar menú':'Abrir menú'}><span/><span/></button>
  </header>
}
