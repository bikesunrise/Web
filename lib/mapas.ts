// Mapas interactivos que se insertan en artículos con <div class="bs-mapa-ruta" data-mapa="clave"></div>.
import sendaDelOso from '@/data/mapas/senda-del-oso.json';
import viaVerdeSierra from '@/data/mapas/via-verde-de-la-sierra.json';
import type { DatosMapa } from '@/components/MapaRuta';

export const MAPAS: Record<string, DatosMapa> = {
  'senda-del-oso': sendaDelOso as unknown as DatosMapa,
  'via-verde-de-la-sierra': viaVerdeSierra as unknown as DatosMapa,
};
