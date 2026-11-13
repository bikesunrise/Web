import Link from 'next/link';import Header from '@/components/Header';import Footer from '@/components/Footer';
export default function NotFound(){return <><Header/><main className="not-found"><p>CAMINO NO ENCONTRADO</p><h1>Esta ruta no aparece en el mapa.</h1><Link href="/">VOLVER A BIKESUNRISE ↗</Link></main><Footer/></>}
