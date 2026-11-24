// Guías de ruta con mapa, perfil y pestañas (components/GuiaRuta.tsx). Una entrada por ruta.
// Lo reescribe contenido/guias/generar.py: no editar a mano.
import rutaDelCarrilet from '@/data/guias/ruta-del-carrilet.json';
import viaVerdeOjosNegros from '@/data/guias/via-verde-ojos-negros.json';
import etapasPirinexus from '@/data/guias/etapas-pirinexus.json';
import caminoDelCidEnBicicleta from '@/data/guias/camino-del-cid-en-bicicleta.json';
import transpirenaicaEnBicicleta from '@/data/guias/transpirenaica-en-bicicleta.json';
import sendaDelOsoEnBicicleta from '@/data/guias/senda-del-oso-en-bicicleta.json';
import viaVerdeDeLaSierra from '@/data/guias/via-verde-de-la-sierra.json';
import viaDeLaPlataEnBicicleta from '@/data/guias/via-de-la-plata-en-bicicleta.json';
import viaVerdeSantanderMediterraneo from '@/data/guias/via-verde-santander-mediterraneo.json';
import rutaMontanasVacias from '@/data/guias/ruta-montanas-vacias.json';
import type { Guia } from '@/components/GuiaRuta';

export const GUIAS: Record<string, Guia> = {
  '/rutas/ruta-del-carrilet': rutaDelCarrilet as unknown as Guia,
  '/rutas/via-verde-ojos-negros': viaVerdeOjosNegros as unknown as Guia,
  '/rutas/etapas-pirinexus': etapasPirinexus as unknown as Guia,
  '/rutas/camino-del-cid-en-bicicleta': caminoDelCidEnBicicleta as unknown as Guia,
  '/rutas/transpirenaica-en-bicicleta': transpirenaicaEnBicicleta as unknown as Guia,
  '/rutas/senda-del-oso-en-bicicleta': sendaDelOsoEnBicicleta as unknown as Guia,
  '/rutas/via-verde-de-la-sierra': viaVerdeDeLaSierra as unknown as Guia,
  '/rutas/via-de-la-plata-en-bicicleta': viaDeLaPlataEnBicicleta as unknown as Guia,
  '/rutas/via-verde-santander-mediterraneo': viaVerdeSantanderMediterraneo as unknown as Guia,
  '/rutas/ruta-montanas-vacias': rutaMontanasVacias as unknown as Guia,
};
