import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import QuickAnswer from '@site/src/components/QuickAnswer';

/**
 * Componentes disponibles en cualquier .mdx sin importarlos.
 *
 * QuickAnswer va aquí a propósito: los bloques los inserta docs-agent vía
 * Draft PR a partir de los findings del seo-agent, y exigir una línea de
 * import por fichero es una fuente de fallos que no aporta nada.
 */
export default {
  ...MDXComponents,
  QuickAnswer,
};
