'use client';
// Filtro de categorías del catálogo de Material, compartido por /material-para-bikepacking/ (botones que
// filtran en la página) y /material/<tipo>/ (enlaces a cada página de tipo). Las categorías se agrupan
// por el momento del viaje. En el móvil se pliega en un desplegable; en escritorio está siempre abierto.
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Backpack, Tent, CookingPot, Shirt, Bike, Compass } from 'lucide-react';
import tipos from '@/data/material-tipos.json';

const GRUPOS = [
  { titulo: 'Llevar el equipaje', Icon: Backpack, cats: ['Bolsas de bikepacking', 'Alforjas', 'Portaequipajes', 'Bolsas de horquilla y cargo cages', 'Mochilas y riñoneras', 'Remolques'] },
  { titulo: 'Dormir fuera', Icon: Tent, cats: ['Tiendas de campaña', 'Sacos de dormir', 'Esterillas y almohadas', 'Organización y campamento'] },
  { titulo: 'Comer y beber', Icon: CookingPot, cats: ['Cocina', 'Agua'] },
  { titulo: 'Vestirse', Icon: Shirt, cats: ['Ropa de pedalear', 'Calzado y casco', 'Ropa, cuidado y botiquín'] },
  { titulo: 'La bici', Icon: Bike, cats: ['Sillines y pedales', 'Componentes', 'Neumáticos y cámaras', 'Reparación de pinchazos', 'Mecánica y mantenimiento', 'Accesorios para la bici'] },
  { titulo: 'Luz, energía y ruta', Icon: Compass, cats: ['Luces y frontales', 'Dinamo y carga', 'Energía y navegación', 'Seguridad y antirrobo', 'Grabación del viaje', 'Libros y guías de ruta'] },
];
const TIPO = new Map(tipos.map((t) => [t.categoria, t]));
export const ORDEN = GRUPOS.flatMap((g) => g.cats);

type Props = {
  actual: string; // categoría elegida o 'Todo'
  cuentas: Record<string, number>;
  total: number;
  onSelect?: (categoria: string) => void; // con onSelect son botones; sin él, enlaces a las páginas de tipo
};

export default function FiltroMaterial({ actual, cuentas, total, onSelect }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (ref.current && window.matchMedia('(min-width: 641px)').matches) ref.current.open = true;
  }, []);
  const etiqueta = actual === 'Todo' ? 'Todo el material' : TIPO.get(actual)?.h1 ?? actual;
  const elegir = (c: string, e: React.MouseEvent) => {
    if (window.matchMedia('(max-width: 640px)').matches) e.currentTarget.closest('details')?.removeAttribute('open');
    onSelect?.(c);
  };
  const Fila = ({ cat, texto, n }: { cat: string; texto: string; n: number }) => {
    const activo = cat === actual;
    const contenido = <><span>{texto}</span><span className="filtro-n">{n}</span></>;
    if (onSelect) return <button type="button" aria-pressed={activo} onClick={(e) => elegir(cat, e)}>{contenido}</button>;
    const href = cat === 'Todo' ? '/material-para-bikepacking/' : `/material/${TIPO.get(cat)?.slug}/`;
    return <Link href={href} aria-current={activo ? 'page' : undefined}>{contenido}</Link>;
  };
  return (
    <details ref={ref} className="filtro">
      <summary><span>Categoría</span><strong>{etiqueta}</strong></summary>
      <nav aria-label="Categorías de material">
        <Fila cat="Todo" texto="Todo el material" n={total} />
        {GRUPOS.map(({ titulo, Icon, cats }) => {
          const presentes = cats.filter((c) => cuentas[c]);
          if (!presentes.length) return null;
          return (
            <section key={titulo} className="filtro-grupo">
              <h3><Icon size={17} strokeWidth={1.6} aria-hidden="true" />{titulo}</h3>
              {presentes.map((c) => <Fila key={c} cat={c} texto={TIPO.get(c)?.h1 ?? c} n={cuentas[c]} />)}
            </section>
          );
        })}
      </nav>
    </details>
  );
}
