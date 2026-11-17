'use client';
// Portada v2: el contenido y el atlas se generan con bocetos/portada-v2/exportar_next.py.
import { useEffect, useRef } from 'react';
import { contenido } from './portada-v2/contenido';
import { iniciaAtlas } from './portada-v2/atlas';

export default function PortadaV2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let vivo = true;
    let fin: undefined | (() => void);
    Promise.all([
      fetch('/portada/atlas-mundo.svg').then((r) => r.text()),
      fetch('/portada/atlas-mundo.json').then((r) => r.json()),
    ]).then(([svg, datos]) => {
      const hueco = ref.current?.querySelector('#pv2-atlas');
      if (!vivo || !ref.current || !hueco) return;
      hueco.innerHTML = svg;
      fin = iniciaAtlas(ref.current, datos);
    });
    return () => {
      vivo = false;
      fin?.();
    };
  }, []);
  return <div className="pv2" ref={ref} dangerouslySetInnerHTML={{ __html: contenido }} />;
}
