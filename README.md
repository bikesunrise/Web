# Bikesunrise · Atlas — primera versión de diseño

Web en código con Next.js y exportación estática para Cloudflare Pages. No necesita WordPress para mostrar su contenido. Fecha de revisión: 4 noviembre 2026.

## Ver esta versión

El paquete `Bikesunrise-Cloudflare-web.zip` contiene la web ya compilada, con index.html en la raíz. Se puede subir a un proyecto de prueba de Cloudflare Pages mediante Direct Upload sin ejecutar npm. No conectar todavía el dominio principal: esta es una versión de revisión.

Este paquete de código permite continuar el desarrollo. Node.js 22 LTS recomendado. Instalar con `npm ci`, desarrollar con `npm run dev`, compilar con `npm run build`. El resultado está en `out/`. Para una integración Git de Cloudflare Pages: comando `npm run build`, directorio de salida `out`.

## Implementado

- Portada con la fotografía original de Cotopaxi, paleta arena / bosque / terracota y accesos hexagonales.
- Atlas SVG con geografía Natural Earth, 25 destinos, cuatro vistas y pins de bicicleta. Se puede usar con teclado y dispone de lista alternativa.
- Enlaces a 13 relatos de Europa y Asia. España enlaza al archivo de rutas. América tiene destinos y estado editorial pendiente, sin inventar crónicas.
- Catálogo original: 120 productos, 19 categorías, búsqueda y enlaces de afiliación y reseñas conservados.
- 113 rutas de contenido importado, además de la home. Fotografías editoriales y tipografías guardadas localmente.
- Plantillas de artículos, galerías, archivos, navegación móvil y metadatos básicos.
- Exportación estática compilada y comprobada. Sin servicio de formularios activo; contacto mediante Instagram.

## Límites de esta versión

La línea blanca conecta posiciones aproximadas de países: NO representa un itinerario GPS ni la vuelta completa a España. Se necesitan tracks GPX/GeoJSON o una lista de etapas confirmada para dibujar el recorrido real, separar transportes y añadir lugares faltantes. La cartografía es geográfica; el patrón interior es decorativo.

Las imágenes de material mantienen las URLs externas del catálogo original de Amazon; pueden cambiar o dejar de funcionar. Hay una ilustración alternativa cuando no cargan. No se muestran precios ni disponibilidad.

La importación pública no equivale a una migración completa de WordPress: todavía hay que contrastar metadatos de RankMath, schema, vídeos, mapas, widgets y páginas con el original. `/comunidad-bikesunrise/` y `/politica-de-cookies-ue/` siguen pendientes de contenido. No se ha publicado ni cambiado el dominio.

## Datos y edición

- `app/page.tsx`: portada.
- `components/WorldAtlas.tsx`: destinos, enlaces y mapa.
- `components/GearBrowser.tsx` y `data/gear.json`: catálogo.
- `data/content.json`: artículos, páginas y crónicas importadas.
- `app/globals.css`: diseño y responsive.
- `public/images`: fotografía propia y recursos locales.
- `public/_headers`: cabeceras Cloudflare. Incluye `X-Robots-Tag: noindex` para que esta copia de revisión no compita con la web actual. Retirarlo SOLO al preparar la migración del dominio principal.
- `public/_redirects`: dos redirecciones propuestas; revisar su equivalencia editorial antes del lanzamiento.

## Fuentes técnicas

- Cloudflare, exportación estática de Next.js: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- Cloudflare, límites del plan: https://developers.cloudflare.com/pages/platform/limits/
- Natural Earth, cartografía de dominio público: https://www.naturalearthdata.com/about/terms-of-use/
- Contenido y catálogo: https://bikesunrise.com/ y https://bikesunrise.com/material-para-bikepacking/

Consultar `ROADMAP.md` para la secuencia de trabajo y las comprobaciones realizadas.

## Refinamiento visual — 5 noviembre 2026
Mapa con curvas cúbicas esquemáticas, pins SVG translúcidos, transición de región de 650 ms y preferencia de movimiento reducido. Logo oficial en navegación. Home con grid editorial asimétrico, contornos decorativos propios y botones de vidrio discretos.
Fuentes locales: Fraunces variable para hero (aproximación visual a referencia, no identificación exacta), Delius Unicase Bold para títulos (alternativa provisional a Woodland). Licencias OFL junto a las fuentes.
Validación: exportación estática de 118 páginas; pins y selector regional comprobados; layouts en marcos de 390 y 768 px sin desbordamiento horizontal.

## Revisión de tarjetas y footer
H2 unificados con Fraunces, pesos 400–650. Accesos de portada convertidos a tarjetas rectangulares; historias de portada en cuatro columnas y archivo con tarjetas fotográficas superpuestas. Botones translúcidos y footer verde con contornos al 22 %. Exportación validada; home sin desbordamiento horizontal a 390 y 768 px.


## Revisión visual V03 — 5 noviembre 2026
Grid editorial asimétrico, tarjetas fotográficas redondeadas y botones translúcidos. H2 con la misma familia Fraunces del H1 y distintos pesos. Footer verde con curvas topográficas decorativas de baja opacidad. Atlas con recorridos curvos esquemáticos: no son tracks GPS; las curvas de nivel son ilustrativas, no datos de elevación.
Validación: build estático de 118 páginas; inspección visual escritorio, móvil y tablet y comprobación de ausencia de desbordamiento horizontal en los dos últimos.
La copia Mac V03 utiliza http://localhost:4183 y muestra V03 en el footer. Los cambios posteriores no se sincronizan automáticamente con el Mac.


## V04 — páginas interiores
Cabeceras panorámicas; índice por capítulos; bloques de pasos, fotografías de archivo y tarjetas de destinos en la guía. Archivo de rutas con composición alternada. Marca y menú en Fraunces. Exportación estática validada; mantener servidor local abierto y cerrar V03 antes de iniciar V04 en el mismo puerto 4183.
