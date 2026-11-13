import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'Bikesunrise — El mundo en bicicleta',template:'%s | Bikesunrise'},description:'Historias reales, rutas, guías y material para viajar en bicicleta. Las expediciones de Àlex Fernandez Gines por Europa, Asia y América.',metadataBase:new URL('https://bikesunrise.com')};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
