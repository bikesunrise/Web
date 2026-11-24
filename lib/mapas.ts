// Mapas interactivos que se insertan en artículos con <div class="bs-mapa-ruta" data-mapa="clave"></div>.
// Lo reescribe contenido/eurovelo/mapas.py: no editar a mano.
import m_eurovelo_1 from '@/data/mapas/eurovelo-1.json';
import m_eurovelo_11 from '@/data/mapas/eurovelo-11.json';
import m_eurovelo_12 from '@/data/mapas/eurovelo-12.json';
import m_eurovelo_13 from '@/data/mapas/eurovelo-13.json';
import m_eurovelo_2 from '@/data/mapas/eurovelo-2.json';
import m_eurovelo_3 from '@/data/mapas/eurovelo-3.json';
import m_eurovelo_4 from '@/data/mapas/eurovelo-4.json';
import m_eurovelo_5 from '@/data/mapas/eurovelo-5.json';
import m_eurovelo_6 from '@/data/mapas/eurovelo-6.json';
import m_eurovelo_7 from '@/data/mapas/eurovelo-7.json';
import m_eurovelo_8 from '@/data/mapas/eurovelo-8.json';
import m_eurovelo_todas from '@/data/mapas/eurovelo-todas.json';
import m_senda_del_oso from '@/data/mapas/senda-del-oso.json';
import m_via_verde_de_la_sierra from '@/data/mapas/via-verde-de-la-sierra.json';
import type { DatosMapa } from '@/components/MapaRuta';

export const MAPAS: Record<string, DatosMapa> = {
  'eurovelo-1': m_eurovelo_1 as unknown as DatosMapa,
  'eurovelo-11': m_eurovelo_11 as unknown as DatosMapa,
  'eurovelo-12': m_eurovelo_12 as unknown as DatosMapa,
  'eurovelo-13': m_eurovelo_13 as unknown as DatosMapa,
  'eurovelo-2': m_eurovelo_2 as unknown as DatosMapa,
  'eurovelo-3': m_eurovelo_3 as unknown as DatosMapa,
  'eurovelo-4': m_eurovelo_4 as unknown as DatosMapa,
  'eurovelo-5': m_eurovelo_5 as unknown as DatosMapa,
  'eurovelo-6': m_eurovelo_6 as unknown as DatosMapa,
  'eurovelo-7': m_eurovelo_7 as unknown as DatosMapa,
  'eurovelo-8': m_eurovelo_8 as unknown as DatosMapa,
  'eurovelo-todas': m_eurovelo_todas as unknown as DatosMapa,
  'senda-del-oso': m_senda_del_oso as unknown as DatosMapa,
  'via-verde-de-la-sierra': m_via_verde_de_la_sierra as unknown as DatosMapa,
};
