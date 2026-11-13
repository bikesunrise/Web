# Roadmap de Bikesunrise

## 1. Dirección visual y primera implementación — realizada
Home, atlas, navegación, hexágonos, plantillas editoriales y catálogo filtrable. Fotografías reales y diseño responsive.

## 2. Revisión del diseño — siguiente iteración
Validar contigo portada, tipografías, densidad del mapa y presentación de historias. Afinar pins con una familia de símbolos propia y ampliar el lenguaje de atlas ilustrado sin sustituir fotografías reales.

## 3. Itinerarios reales — requiere datos de ruta
Incorporar GPX/GeoJSON o etapas confirmadas. Dibujar la vuelta a España, Europa, Asia y América con trazados fieles. Distinguir bicicleta, vuelos y ferris. Confirmar todos los países y cruces; el primer atlas no pretende ser un inventario completo de cada etapa.

## 4. Migración de contenido y SEO — pendiente de validación completa
Comparar inventario WordPress/sitemaps con las 113 rutas importadas; verificar páginas ausentes y módulos especiales. Conservar títulos SEO, descripciones, canonical, schema, alt y enlaces. Revisar tablas, vídeos, mapas y afiliación. Completar las dos páginas marcadas pendientes. Corregir textos residuales de widgets que aparezcan durante la revisión.

## 5. Cloudflare — preparado, sin publicar
Crear un proyecto de revisión, subir el paquete compilado o conectar un repositorio. Probar URLs, 404, redirecciones y cabeceras en el alojamiento real. El prototipo lleva noindex por cabecera. El dominio principal solo se migra después de revisar contenido y SEO; la renovación del dominio sigue siendo un coste separado del alojamiento.

## 6. Lanzamiento y publicaciones
Configurar las integraciones necesarias (contacto, analítica y consentimiento). Cambiar dominio, retirar noindex, enviar sitemap y vigilar errores e indexación. Para cada artículo nuevo: recibir contenido y fotos, integrarlo en la plantilla, revisar y desplegar. Las historias de América quedan para esta etapa editorial.

## Comprobaciones realizadas

- Compilación Next.js y TypeScript sin errores; exportación estática completa.
- Navegación desde pin de Francia hasta su relato.
- Selector regional y selección de Nepal en la vista móvil.
- Menú móvil desplegable.
- Búsqueda «Naturehike»: 4 productos; categoría «Tiendas de campaña»: 4 productos.
- Revisión visual de home, atlas, catálogo e historia en escritorio y marcos de 390 y 768 px; no se detectó desbordamiento horizontal en los marcos comprobados.
- Imágenes reales de tiendas y alforjas visibles en catálogo; corregida la superposición del icono de respaldo.
- Referencias de imágenes locales del HTML exportado verificadas: ninguna ausente.
- Los dos destinos internos sin página exportada corresponden a las redirecciones propuestas en `_redirects`; no han sido validadas en Cloudflare.

Esto no sustituye pruebas en dispositivos físicos ni una auditoría completa de accesibilidad, rendimiento y SEO de producción.
