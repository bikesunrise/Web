import Link from 'next/link';
export default function Footer(){return <footer className="site-footer">
 <div className="footer-signoff"><span className="eyebrow">SIGUE EL CAMINO</span><p>Todo sobre viajar<br/><em>por el mundo en bicicleta.</em></p><a href="/#atlas" className="footer-atlas-link">Volver al atlas <span>↗</span></a></div><div className="footer-content">
  <div className="footer-column"><h2>EXPLORAR</h2><Link href="/portfolio/viajes/">Expediciones</Link><Link href="/rutas/">Rutas</Link><Link href="/blog/">Historias</Link><Link href="/eurovelo/">EuroVelo</Link></div>
  <div className="footer-column"><h2>PREPARAR EL VIAJE</h2><Link href="/viajar-en-bicicleta/">Viajar en bicicleta</Link><Link href="/material-para-bikepacking/">Material</Link><Link href="/resenas/">Reseñas</Link><Link href="/herramientas/">Herramientas</Link></div>
  <div className="footer-column"><h2>BIKESUNRISE</h2><Link href="/contacto/">Contacto</Link><a href="https://www.youtube.com/@Bikesunrise" target="_blank" rel="noopener noreferrer">YouTube ↗</a><a href="https://www.instagram.com/bikesunrise/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
  <Link href="/" className="footer-brand">BIKESUNRISE<span>EL MUNDO EN BICICLETA</span></Link>
 </div>
 <div className="footer-bottom"><span>V06 · © {new Date().getFullYear()} BIKESUNRISE · ÀLEX FERNANDEZ GINES</span><div><Link href="/aviso-legal/">Aviso legal</Link><Link href="/politica-privacidad/">Privacidad</Link><Link href="/politica-de-cookies-ue/">Cookies</Link></div></div>
 </footer>}
