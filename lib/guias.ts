// Guías de ruta con mapa, perfil y pestañas (components/GuiaRuta.tsx). Una entrada por ruta.
import carrilet from '@/data/guias/ruta-del-carrilet.json';
import type { Guia } from '@/components/GuiaRuta';

export const GUIAS: Record<string, Guia> = {
  '/rutas/ruta-del-carrilet': carrilet as unknown as Guia,
};
