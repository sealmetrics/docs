import React from 'react';
import styles from './styles.module.css';

/**
 * Bloque de respuesta optimizado para citación por IA.
 *
 * Apunta al rango de 134-167 palabras que los motores generativos (AI
 * Overviews, ChatGPT, Perplexity) extraen literalmente como respuesta
 * directa. Portado de web-sealmetrics, donde ya se usa en las páginas /vs/.
 *
 * Reglas para el contenido (responsabilidad de quien escribe):
 *   - Abrir con un patrón definitorio: "X is a [categoría] that [hace qué]".
 *   - Incluir 1-2 datos numéricos concretos.
 *   - Nada de CTAs dentro: ensucian el pasaje citable.
 *
 * IMPORTANTE — el marcado no es decorativo. `seo-agent` localiza el bloque
 * por `<aside aria-label="Quick answer">` y cuenta palabras dentro de
 * `[data-speakable]` (ver tools/geo/quick_answer.py). Cambiar el
 * aria-label o quitar data-speakable deja el bloque invisible al agente y
 * la página vuelve a contar como "sin quick answer".
 */
export default function QuickAnswer({label = 'Quick answer', children}) {
  return (
    <aside className={styles.quickAnswer} role="note" aria-label={label}>
      <p className={styles.label}>{label}</p>
      <div data-speakable className={`faq-answer ${styles.body}`}>
        {children}
      </div>
    </aside>
  );
}
