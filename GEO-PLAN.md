# Plan GEO: que los LLMs mencionen y citen a Sealmetrics

Fecha del diagnóstico: 2026-09-04. Fases 1 y 2 (julio 2026, PRs #33/#34) ya cubrieron descripciones, redirects, `llms.txt`, jerarquía de headings, párrafos answer-first y enlaces internos. Este plan es la **Fase 3** y arranca de lo que se ha comprobado hoy en el repo y en producción, no de una lista genérica.

Cada tarea lleva un agente responsable (`seo-technical`, `seo-schema`, `seo-content`, `seo-sitemap`, o el skill `seo-geo` / `seo-competitor-pages`), evidencia, acciones concretas y un criterio de aceptación verificable. Las reglas de `CLAUDE.md` mandan sobre cualquier tarea de aquí: nada de certificaciones, Dublín como único centro de datos, subprocesadores solo los del Anexo 3 del DPA, LENS gratis con BYOK, y la cifra canónica de pérdida de datos de GA es **15-60 %** según sector/marca/tráfico.

---

## 0. Lo que ya está bien (no tocar, no "mejorar")

| Área | Estado verificado |
|------|-------------------|
| Acceso de crawlers IA | `static/robots.txt` permite GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, etc. Googlebot/Bingbot tienen `Disallow` en `/docs-raw/` y `/llms-full.txt` a propósito (evita duplicado en el índice). |
| Capa LLM | `llms.txt` (81 KB), `llms-full.txt` (2,5 MB), `static/docs-raw/`, espejo `.md` por ruta (`/ruta.md` con `text/markdown`), `knowledge-manifest.json`. Regeneración diaria + check de staleness en CI. |
| JSON-LD | Organization + WebSite (global), SoftwareApplication (home), TechArticle (8 prefijos), BreadcrumbList, BlogPosting, FAQPage en `docs/faq/*`. |
| Frontmatter | 290/290 docs con `description`, `tags` y `keywords`. |
| Entrada para agentes | OpenAPI 3.1, MCP alojado, `docs/api/for-agents.mdx`, 16 páginas de prompts en `docs/web-analytics-prompts/`. |
| Linters | `check:api-contract`, `check:ui-claims`, `check:product-claims`, `audit-markdown` (espejos). |

Nota para `seo-schema`: su regla "FAQPage solo para gobierno/salud" aplica a los rich results de Google. Para citación por LLMs el FAQPage sigue siendo útil. **No eliminarlo.**

---

## P0. Bugs que hoy penalizan la citación (1-2 días)

### P0.1 La fecha de modificación es la misma en todas las páginas
**Agente:** `seo-technical`.
**Evidencia:** en producción, `getting-started/how-it-works`, `api/webhooks` y `compliance/subprocessors` emiten el mismo `dateModified` (`2026-09-02T14:58:52Z`, la hora del último deploy). Causa: `.github/workflows/deploy.yml` hace `actions/checkout@v4` sin `fetch-depth: 0`, así que Docusaurus solo ve un commit y `lastUpdatedAt` es la fecha del HEAD para todos los ficheros. El `<lastmod>` del sitemap sufre lo mismo. Cada deploy "refresca" 290 páginas a la vez: señal de frescura nula y sospechosa.
**Acciones:**
1. Añadir `with: fetch-depth: 0` al checkout de `deploy.yml`.
2. Comprobar tras el deploy que dos páginas cualesquiera tienen `dateModified` distinto y que `sitemap.xml` tiene más de una fecha en `<lastmod>`.
**Aceptación:**
```bash
for u in getting-started/how-it-works api/webhooks; do curl -sL https://docs.sealmetrics.com/$u | grep -o '"dateModified":"[^"]*"'; done
curl -s https://docs.sealmetrics.com/sitemap.xml | grep -o '<lastmod>[^<]*' | sort -u | wc -l
```
Las dos fechas deben diferir y el conteo debe ser mayor que 1.

### P0.2 La cabecera de `llms.txt` contradice la cifra canónica
**Agente:** `seo-content`.
**Evidencia:** `scripts/llms-templates/instructions.md` dice "cookie-based tools lose **60-87%** of EU visitors" y `differentiators.md` da a GA4 una completitud de "13-40%". El resto del sitio (más de 100 menciones en docs y blog) usa **15-60 %**. Es lo primero que lee un LLM del dominio y lo primero que puede refutar.
**Acciones:**
1. Cambiar la línea a "consent-based tools lose 15-60% of EU visitors depending on sector, brand and traffic mix".
2. Alinear la fila "Data Completeness (EU)" de la tabla con esa cifra (100 % frente a 40-85 %) o quitar el número y dejar "depends on consent rate".
3. Ejecutar `npm run generate:llms` y commitear los espejos.
**Aceptación:** `grep -rn "60-87\|13-40" scripts/llms-templates static/llms.txt` no devuelve nada.

### P0.3 Extender el linter de claims a las cifras y afirmaciones prohibidas
**Agente:** `seo-technical`.
**Evidencia:** `check-product-claims.mjs` vigila capacidades, pero nada vigila las cifras y los términos que `CLAUDE.md` prohíbe. La cabecera de P0.2 se coló por eso.
**Acciones:** añadir a `scripts/capability-ledger.json` (o a un `scripts/geo-ledger.json` nuevo leído por el mismo script) patrones para: `60-87%`, `13-40%`, `ISO 27001`, `SOC 2`, `Frankfurt`, `1,000 questions`, `€99`, `gemma-4`, `mistral-small`, `Art\. 6\(1\)\(f\)` aplicado a analítica. Ampliar `SCOPES` para incluir `scripts/llms-templates`.
**Aceptación:** `npm run check:product-claims` falla si se reintroduce cualquiera de esos patrones y pasa en `main` limpio.

---

## P1. Señales de autoridad y citabilidad (2-3 semanas)

### P1.1 TechArticle solo cubre 8 prefijos y deja fuera lo más citable
**Agente:** `seo-schema`.
**Evidencia:** `src/theme/DocItem/Layout/index.js` emite TechArticle para `/api/`, `/implementation/`, `/getting-started/`, `/reports/`, `/integrations/`, `/platform/`, `/security-privacy/`, `/lens/`. Sin schema quedan `/compliance/`, `/guides/`, `/use-cases/`, `/ga4-migration/`, `/troubleshooting/`, `/billing/`, `/web-analytics-prompts/`. Compliance y guides son justo las páginas que responden a "GDPR analytics without consent", la consulta donde más nos interesa aparecer.
**Acciones:**
1. Añadir esos prefijos. Para `/compliance/` y `/guides/` usar `Article` en vez de `TechArticle`; para `/faq/` convivir con el FAQPage existente (dos bloques JSON-LD son válidos).
2. Añadir `datePublished` (leer `frontmatter.date` o `last_update.date`; si falta, omitir, nunca inventar), `isPartOf: {"@id": "https://docs.sealmetrics.com/#website"}` y `about` con la entidad Sealmetrics (`https://sealmetrics.com/#software`).
3. Validar 3 páginas con el validador de Schema.org.
**Aceptación:** `curl -sL https://docs.sealmetrics.com/compliance/cnil-self-assessment | grep -c 'application/ld+json'` devuelve al menos 2 (breadcrumbs + Article).

### P1.2 Entidad Person para el autor y `founder` en Organization
**Agente:** `seo-schema`.
**Evidencia:** `blog/authors.yml` tiene a Rafael Jimenez con LinkedIn, pero el Organization global de `docusaurus.config.ts` no declara `founder` y ninguna página de docs tiene autor. E-E-A-T pesa 20 % en la rúbrica del skill `seo-geo`.
**Acciones:**
1. En el `@graph` global añadir un nodo `Person` (`@id: https://sealmetrics.com/#rafael-jimenez`, `jobTitle`, `sameAs` LinkedIn, `worksFor`) y `founder: {"@id": ...}` en Organization.
2. En `BlogPostPage/StructuredData` asegurarse de que `author` lleva ese mismo `@id`.
3. Valorar `author` Person en `/guides/*` y `/compliance/*` (contenido de opinión experta) manteniendo Organization en el resto.
**Aceptación:** el JSON-LD global valida y el nodo Person aparece una sola vez por página.

### P1.3 Citas a fuentes primarias en compliance y security-privacy
**Agente:** `seo-content`.
**Evidencia:** solo 6 páginas de `docs/` enlazan a eur-lex, CNIL, ICO, EDPB o gdpr-info. Los LLMs prefieren pasajes con afirmaciones atribuidas, y un DPO que lee la página también.
**Acciones:** en cada self-assessment y en `security-privacy/why-no-consent.mdx`, `how-consentless-works.mdx`, `consentless-analytics.mdx`:
- ePrivacy Art. 5(3) y Considerando 26 del RGPD (eur-lex), Guidelines 2/2023 del EDPB sobre el alcance técnico del Art. 5(3), la exención de medición de audiencia de la CNIL, la guía PECR del ICO, §25 TTDSG, Art. 45c FADP.
- Formato: frase corta con el dato, enlace a la fuente oficial en la misma frase, fecha de la fuente.
- **Restricciones:** mantener el disclaimer de self-assessment; no citar Art. 6(1)(f) como base de la analítica (la posición de Rafa es Considerando 26: datos no personales, fuera de ámbito); no afirmar que ninguna autoridad ha aprobado nada.
**Aceptación:** `grep -rl 'eur-lex\|cnil.fr\|ico.org.uk\|edpb.europa' docs/compliance docs/security-privacy | wc -l` pasa de 6 a al menos 15, y `npm run check:product-claims` sigue en verde.

### P1.4 Bloques de respuesta autocontenidos y headings en forma de pregunta
**Agente:** `seo-content` (skill `seo-geo` para puntuar).
**Evidencia:** 38 docs tienen algún H2 en forma de pregunta y 30 tienen un bloque "Key takeaways / In short". El skill `seo-geo` pide definición "X is..." en las primeras 60 palabras y pasajes de 134-167 palabras extraíbles sin contexto.
**Acciones:**
1. Pasar el skill `seo-geo` sobre las 40 páginas de mayor intención (compliance/*, security-privacy/*, use-cases/*, guides/*, faq/*, ga4-migration, intro, how-it-works) y guardar la puntuación por página en `scripts/geo-scores.json` como línea base.
2. Para cada página por debajo de 70: definición en el primer párrafo, un H2 en forma de pregunta por sección principal, un bloque `:::note In short` de 3 viñetas al final con cifras y fechas (las canónicas de `CLAUDE.md`).
3. No generalizar `inject-blog-tldr.mjs` a docs: las descripciones ya son answer-first y un TL;DR automático duplicaría el primer párrafo. Sí añadir a `audit-markdown.mjs` un aviso cuando el primer párrafo de cuerpo tenga menos de 120 caracteres.
**Aceptación:** repetir el skill: media de las 40 páginas por encima de 75 y ninguna por debajo de 60.

### P1.5 Canibalización en security-privacy
**Agente:** `seo-content` decide, `seo-technical` aplica redirects.
**Evidencia:** ocho páginas explican lo mismo con distinto ángulo: `security-privacy/index`, `overview`, `consentless-analytics` (2.334 palabras), `how-consentless-works`, `why-no-consent`, `consentless-benefits`, `how-we-protect-privacy`, `privacy-by-design`, más `getting-started/how-it-works`. Un LLM que busque "cómo funciona la analítica sin consentimiento en Sealmetrics" recibe nueve candidatos parecidos y ninguno gana.
**Acciones:**
1. Elegir `security-privacy/consentless-analytics.mdx` como página canónica de "qué es y cómo funciona".
2. Recortar `how-consentless-works`, `why-no-consent` y `overview` a su ángulo propio (mecánica, base legal en 400 palabras, índice) enlazando a la canónica en el primer párrafo, o fusionarlos y añadir el redirect en `docusaurus.config.ts` (ya hay 20 redirects, el patrón está).
3. `index.mdx` y `overview.mdx` no pueden ser ambos índices: dejar uno.
**Aceptación:** `npm run build` pasa con `onBrokenLinks: 'throw'`; cada página del cluster tiene una `description` que no comparte las primeras 8 palabras con otra.

### P1.6 Títulos duplicados
**Agente:** `seo-technical`.
**Evidencia:** 9 títulos repetidos entre `docs/api/*` y `docs/platform/*` (Webhooks, Two-Factor Authentication, Referrer Mappings, Passthrough Referrers, Organizations, IP Allowlist, Content Grouping, BigQuery Integration, Audit Logs). Un LLM que cite "Webhooks - Sealmetrics Docs" no sabe cuál enlazar. Ya estaba abierto desde la Fase 2.
**Acciones:** en `docs/api/*` usar `title: "Webhooks API"` (o `sidebar_label` corto y `title` largo). Regenerar espejos.
**Aceptación:** el comando de duplicados devuelve cero líneas:
```bash
for f in $(find docs -name '*.mdx' -o -name '*.md'); do grep -m1 '^title:' "$f"; done | sort | uniq -d
```

---

## P2. Contenido que los LLMs buscan y no encuentran (1-2 meses)

### P2.1 Cluster de comparativas en docs
**Agente:** skill `seo-competitor-pages` para la estructura, `seo-content` para redactar, Rafa valida cada claim.
**Evidencia:** las únicas comparativas son dos posts del blog (vs GA4, vs Plausible) y `faq/ga4-vs-sealmetrics`. Las consultas donde ChatGPT y Perplexity recomiendan herramientas son "GDPR compliant Google Analytics alternative", "Plausible vs Matomo vs X", "cookieless analytics tools". Sin página propia por competidor no hay pasaje que citar.
**Acciones:**
1. Crear `docs/compare/` con `index`, `google-analytics-4`, `matomo`, `plausible`, `fathom`, `piwik-pro`, `simple-analytics`. Reutilizar la tabla de `guides/tracker-performance-report.mdx` (ya cubre Matomo y Piwik PRO).
2. Cada página: definición en 60 palabras, tabla de 8-10 filas con fuente enlazada por cada fila del competidor (su documentación pública, con fecha), sección "When X is the better choice" honesta, FAQ de 4 preguntas.
3. Añadir la sección `Compare` a `SIDEBAR_ORDER` en `scripts/generate-llms.mjs` y a `sidebars.ts`.
4. `check-product-claims` ya ignora las columnas de competidores en tablas; las afirmaciones sobre Sealmetrics siguen sujetas al ledger.
**Aceptación:** 7 páginas construidas, cada fila de competidor con enlace, `npm run check:product-claims` en verde, y un bloque `## Key differentiators` con las mismas cifras que `llms-templates/differentiators.md`.

### P2.2 Ficha de hechos en `llms.txt`
**Agente:** `seo-content`.
**Evidencia:** la cabecera de `llms.txt` describe el producto pero no da los hechos que un LLM necesita para citarnos con precisión: fundación, sede, hosting, modelo de Seal AI, planes, subprocesadores. Esos datos hoy están dispersos y algunos aparecen distintos según la página.
**Acciones:** nuevo `scripts/llms-templates/key-facts.md` con 12-15 líneas "Fact: value (source URL, date)": datos alojados en Dublín (Noraina), Seal AI Private con `gpt-oss-120b` en Scaleway París sin retención, LENS gratis con BYOK, Seal AI Private 5M tokens/mes, precios de `sealmetrics.com/pricing`, subprocesadores del Anexo 3, sin certificaciones de terceros dicho tal cual. Insertarlo en `generateLlmsTxt` justo tras `instructions.md`.
**Aceptación:** cada línea del bloque tiene URL fuente; `grep -c "Fact:" static/llms.txt` es mayor o igual a 12.

### P2.3 Imágenes y diagramas propios
**Agente:** `seo-visual` para el inventario, `seo-content` para los diagramas.
**Evidencia:** 8 imágenes en todo `docs/`, 0 posts con `image`, 0 docs con `image` en frontmatter: todas las tarjetas OG y todos los TechArticle enseñan la misma social card. El skill `seo-geo` pondera multimodal un 15 %.
**Acciones:**
1. Instalar `@docusaurus/theme-mermaid` y dibujar 5 diagramas: flujo de un hit (cuatro variables), arquitectura de recogida en la UE, atribución last-click sin user ID, flujo BYOK frente a Seal AI Private, checklist de migración GA4. Mermaid se renderiza en SSR, así que los crawlers lo ven.
2. Generar una OG image por sección (12 imágenes) con título y sección, y asignarla vía `image:` en el `index.mdx` de cada carpeta.
3. Texto alternativo descriptivo en todas (hoy las 8 lo tienen; mantener).
**Aceptación:** `grep -rl '```mermaid' docs | wc -l` es al menos 5; `grep -l '^image:' docs/*/index.mdx | wc -l` es al menos 10.

### P2.4 Frescura visible por página
**Agente:** `seo-content`.
**Evidencia:** solo 8 docs tienen `last_update` o `date` en frontmatter. Tras P0.1 la fecha de git será real, pero para páginas de compliance conviene una fecha de revisión declarada, independiente de correcciones tipográficas.
**Acciones:** en los 8 self-assessments y en `subprocessors.mdx` añadir `last_update: {date: YYYY-MM-DD}` con la fecha de la última revisión de contenido, y una línea "Reviewed: <fecha>" bajo el H1. Añadir a `audit-markdown.mjs` un aviso si un self-assessment lleva más de 180 días sin revisar.
**Aceptación:** las 9 páginas muestran "Reviewed" y su `dateModified` coincide con esa fecha.

### P2.5 Sitemap y descubrimiento
**Agente:** `seo-sitemap`.
**Evidencia:** la configuración es correcta (`lastmod: 'date'`, patrones ignorados razonables). Tras P0.1 hay que revalidar. No hay ping a Bing/IndexNow (GitHub Pages no lo permite desde el servidor, pero sí desde el workflow).
**Acciones:**
1. Validar `sitemap.xml` tras el deploy de P0.1.
2. Añadir al final de `deploy.yml` un paso que envíe las URLs cambiadas a IndexNow (clave en `static/`). Bing alimenta a Copilot y a ChatGPT search.
3. Comprobar que ninguna URL de `docs-raw` ni `.md` entra en el sitemap (no deberían: son estáticos).
**Aceptación:** validador de sitemap sin errores; el paso IndexNow devuelve 200 o 202 en el log del workflow.

---

## P3. Higiene y automatización (continuo)

### P3.1 `scripts/check-geo.mjs`
**Agente:** `seo-technical`.
Un solo script, ejecutado en `prebuild` y en CI, que falle o avise en:
- Code fences sin cerrar (conteo impar de ``` por fichero): hoy trunca páginas en silencio y no está automatizado.
- Ficheros en `static/docs-raw/` sin fuente en `docs/` (purga de páginas borradas, tampoco automatizado).
- `description` fuera de 110-165 caracteres.
- Títulos duplicados (P1.6).
- Primer párrafo de cuerpo de menos de 120 caracteres (P1.4).
- Páginas sin ningún enlace interno saliente.
**Aceptación:** el script pasa en `main` y falla en un fixture con cada defecto.

### P3.2 Página de licencia para IA
**Agente:** `seo-technical`.
Declarar de forma explícita que el contenido puede usarse para responder e indexar: una línea `License` en la cabecera de `llms.txt` y una página `docs/ai-usage.mdx` corta. RSL 1.0 es opcional; solo si Rafa quiere términos formales.

### P3.3 Medición
**Agente:** `seo-content`, mensual.
Sin esto no sabremos si el plan funciona:
1. 20 prompts fijos ("best GDPR compliant analytics without cookie banner", "Plausible vs Matomo vs Sealmetrics", "how to track conversions without consent in France", etc.) lanzados a ChatGPT, Claude, Perplexity y Google AI Mode el día 1 de cada mes. Registrar en `scripts/geo-mentions.csv`: fecha, plataforma, prompt, ¿mención?, ¿cita con URL?, URL citada.
2. Tráfico de referidos por `chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com` en Sealmetrics (el propio panel de docs: el sitio ya lleva el pixel).
3. Peticiones de `llms.txt` y `llms-full.txt` no se pueden medir en GitHub Pages; anotar como limitación.

---

## Fuera del repo, pero pesa más que todo lo anterior

El skill `seo-geo` cita el estudio de Ahrefs de diciembre de 2025: las menciones de marca correlacionan 3 veces más con la visibilidad en IA que los backlinks, y ChatGPT cita Wikipedia en el 48 % de los casos y Reddit en el 11 %; Perplexity, Reddit en el 47 %. Nada de eso se arregla en `docs/`. Para Rafa o marketing:

- Wikidata: entidad "Sealmetrics" con sede, fundación, sitio web y fundador. Sin artículo de Wikipedia, Wikidata ya ancla la entidad.
- Reddit: respuestas útiles (no promocionales) en r/GDPR, r/analytics, r/webdev, r/privacy enlazando a las páginas de compliance y comparativas cuando existan.
- Listados de terceros: G2, Capterra, AlternativeTo, Product Hunt con la misma descripción y las mismas cifras que `llms.txt`.
- `sealmetrics.com/llms.txt` ya existe; debe enlazar a `docs.sealmetrics.com/llms.txt` como fuente de referencia técnica.

---

## Orden de ejecución sugerido

| Semana | Tareas | Agente |
|--------|--------|--------|
| 1 | P0.1, P0.2, P0.3 | seo-technical, seo-content |
| 2-3 | P1.1, P1.2, P1.6 | seo-schema, seo-technical |
| 3-5 | P1.3, P1.4, P1.5 | seo-content |
| 5-9 | P2.1, P2.2, P2.4 | seo-content, seo-competitor-pages |
| 9-12 | P2.3, P2.5, P3.1, P3.2 | seo-visual, seo-sitemap, seo-technical |
| Mensual | P3.3 | seo-content |

Cada PR de este plan debe terminar con:
```bash
npm run check:api-contract && npm run check:ui-claims && npm run check:product-claims && npm run generate:llms && npm run build
```
y commitear los espejos regenerados junto al cambio de fuente.

---

## Estado de ejecución (2026-09-04, rama `geo/phase-3`)

| Tarea | Estado | Dónde |
|-------|--------|-------|
| P0.1 fecha de modificación real | Hecho | `deploy.yml` con `fetch-depth: 0` |
| P0.2 cifra canónica en `llms.txt` | Hecho | `scripts/llms-templates/instructions.md`, `differentiators.md` |
| P0.3 linter de cifras y términos prohibidos | Hecho | 6 entradas nuevas en `scripts/capability-ledger.json`; el checker también lee `scripts/llms-templates` y entiende "neither/nor" |
| P1.1 schema en todas las secciones | Hecho | `src/theme/DocItem/Layout/index.js`: TechArticle o Article según prefijo, `datePublished`, `isPartOf`, `about` |
| P1.2 Person del fundador | Hecho | `docusaurus.config.ts` (`founder` + nodo Person), byline del blog enlazada al mismo `@id` |
| P1.3 fuentes primarias | Hecho | 55 enlaces en 9 páginas; eur-lex responde 202 a curl (interstitial), comprobar en navegador |
| P1.4 bloques answer-first | Hecho | 35 páginas: media 45 → 94 en `scripts/geo-score.mjs`; línea base en `scripts/geo-scores-baseline.json` |
| P1.5 canibalización security-privacy | Hecho (parcial) | `overview.mdx` fusionada en `index.mdx` con redirect; el resto del cluster ya tenía ángulos propios y enlaza a la canónica |
| P1.6 títulos duplicados | Hecho | sufijo "API" en `docs/api/*`, "Settings" en platform |
| P2.1 comparativas | Borradores, sin publicar | `docs/compare/*.mdx` con `draft: true`; cada fila de competidor enlaza a la fuente comprobada el 2026-09-04. **Rafa valida y quita `draft: true`** |
| P2.2 ficha de hechos | Hecho | `scripts/llms-templates/key-facts.md`, 15 hechos con URL |
| P2.3 diagramas | Hecho (5 Mermaid) | how-it-works, data-location, attribution-without-userid, lens/getting-started, ga4-migration. Mermaid se renderiza en cliente: el SVG no está en el HTML, pero la fuente del diagrama sí viaja en los espejos `.md` y en `llms-full.txt`. **OG por sección no hecho**: no hay rasterizador en el repo |
| P2.4 fecha de revisión | Hecho | `last_update` + línea "Reviewed" en 5 self-assessments, subprocessors y analytics-cookies-exemption |
| P2.5 IndexNow | Hecho | paso al final de `deploy.yml`, clave en `static/<key>.txt`; validar el 200/202 en el log del primer deploy |
| P3.1 `check-geo.mjs` | Hecho | en `prebuild`, en CI (`api-contract.yml`) y con `--fix` en los workflows de espejos |
| P3.2 licencia para IA | Hecho | `docs/ai-usage.mdx` + bloque en `header.md` |
| P3.3 medición | Preparado, sin línea base | `scripts/geo-prompts.md` (20 prompts) y `scripts/geo-mentions.csv`; la primera pasada la hace Rafa el 1 de octubre |
| Extra: Art. 6(1)(f) | Hecho | 10 páginas auditadas; la guía GDPR reescrita a la posición del Considerando 26 |
| Extra: contradicción GA4 | Hecho | `ga4-migration/index.mdx`: 1–2 semanas de setup + 2–4 de validación; eliminado el "5–8×" |
