# V08 — composición y bloques vacíos

- Se conservan los textos y las imágenes asociados a cada entrada, sin añadir escenas, citas ni datos nuevos.
- Las parejas de fotografía y texto alternan izquierda/derecha; las series de fotos forman galerías de alturas naturales. Los capítulos de texto distribuyen su último párrafo en un recuadro, sin duplicarlo ni convertirlo en cita.
- Se filtran bloques sin contenido y el texto de prueba «Lorem ipsum». Se omiten capítulos sin cuerpo tanto en el artículo como en el índice. Los datos originales permanecen disponibles para recuperación editorial.
- Inventario de origen: 34 encabezados h2 consecutivos o finales sin cuerpo inmediato, una lista vacía y un párrafo de prueba. No se inventa contenido para completar estos restos de importación.
- Compilación Next.js y TypeScript correctas: 129 páginas. Auditoría del HTML exportado: 112 páginas editoriales, 748 capítulos, 647 referencias a imágenes; sin capítulos o paneles vacíos detectados, imágenes locales ausentes ni destinos de capítulos inexistentes.
- Verificación reproducible: `npm run build && python scripts/audit-editorial.py`.
- El filtro de material y las cabeceras quedan fuera de esta modificación.
- Esta auditoría comprueba estructura, recursos locales y presentación. No constituye una nueva comprobación factual de todos los relatos. La documentación V06 registra 41 transcripciones para América; las transcripciones automáticas pueden contener errores. No se ha revisualizado cada vídeo ni verificado externamente cada afirmación histórica.
