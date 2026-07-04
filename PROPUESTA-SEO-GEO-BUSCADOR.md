# Propuesta de mejora: indexabilidad, SEO/GEO y buscador

**Fecha:** 2026-07-04 · **Ámbito:** docs.sealmetrics.com (Docusaurus, 267 páginas fuente, 266 URLs en sitemap)

---

## Resumen ejecutivo

La base técnica es sólida: HTML server-rendered, canonicals correctos, sitemap limpio, robots.txt que permite 16 crawlers de IA, llms.txt/llms-full.txt automatizados, TechArticle + BreadcrumbList en ~180 páginas y FAQPage en 8. Los problemas están en tres capas:

1. **Buscador**: el índice de Algolia está sano (16.662 registros, 272 páginas indexadas de 266 del sitemap, frescura ~días). Lo que falla es la **relevancia** (metadata pobre en `/api`, jerarquía de headings rota), las **consultas en español** (devuelven ruido) y el **lag de reindexado** tras cada deploy.
2. **SEO on-page**: 39 páginas sin meta description (todas en `/api`), 34 descriptions demasiado cortas, 22 páginas con múltiples H1, 18 con saltos H1→H3, 12 pares de títulos duplicados, 13 páginas sin ningún enlace interno, y el plugin de redirects instalado pero **sin configurar** (cada renombrado de URL = 404).
3. **GEO**: la infraestructura existe pero no está **señalizada**: llms.txt no se anuncia en robots.txt ni en `<head>`, llms-full.txt no es descubrible, el mirror `/docs-raw/` no está enlazado desde las páginas, y faltan schemas HowTo en las páginas "how to".

Impacto estimado si se ejecuta la Fase 1+2: mejora perceptible del buscador en 1 día de trabajo, y un uplift orgánico razonable (~10–15%) por CTR de snippets y crawl efficiency.

---

## 1. Buscador (Algolia DocSearch) — diagnóstico y fixes

### Diagnóstico (verificado contra el índice real)

| Comprobación | Resultado |
|---|---|
| Registros en índice | 16.662 (content: 7.716, lvl2-5: ~8.650, lvl1: 293) ✅ |
| Cobertura | 272 páginas indexadas vs 266 en sitemap ✅ (solo faltan `/blog` index y página de autor, normal) |
| contextualSearch/facets | `language:en` + `docusaurus_tag` presentes y funcionando ✅ |
| Frescura | Páginas del 29-jun indexadas; página del 2-jul (`/api/migration-from-v1`) **aún no** ⚠️ (lag ≥2 días) |
| Query "install", "wordpress", "utm", typos ("woocomerce") | Resultados correctos ✅ |
| Query "api key" | Devuelve anclas de `/api/stats` en vez de `/api/api-tokens` o `/api/authentication` ❌ |
| Query "precio" (español) | Devuelve el changelog ❌ |

**Causa raíz de la mala relevancia:** DocSearch construye sus registros a partir de la jerarquía H1→H6 y la meta description. En `/api` hay 39 páginas sin description, 22 páginas con múltiples H1 (`sdk-python.mdx` tiene **33 H1**) y 18 con saltos H1→H3. Eso genera registros con jerarquía plana o rota, y el ranking se degrada exactamente en la sección más consultada (API).

### Acciones

| # | Acción | Cómo | Esfuerzo |
|---|---|---|---|
| B1 | **Sinónimos ES→EN** en el índice | Dashboard Algolia → Synonyms: instalar↔install, precio↔pricing↔plans, seguimiento↔tracking, informe↔report, conversión↔conversion, píxel↔pixel, correo↔email, facturación↔billing… (~25 pares) | 20 min |
| B2 | **Reducir el lag de reindexado** | El índice es DocSearch gratuito (Algolia recrawlea en su calendario, ~semanal → de ahí el lag). No hay Crawler API propia para disparar reindex desde CI. Opciones: (a) pedir a Algolia un crawl más frecuente / acceso al crawler, o (b) migrar a Algolia self-managed | — |
| B3 | **Arreglar headings y descriptions de `/api`** (comparte fix con SEO §2) | Un solo H1 por página, jerarquía H1→H2→H3, description en las 39 páginas | 2–3 h |
| B4 | **Bajar peso del changelog y anclas de blog** en el crawler | En la config del crawler: `pageRank` mayor para `getting-started/`, `implementation/`, `integrations/`, `api/`; menor para `/changelog` (es lo que contamina "precio") | 30 min |
| B5 | (Opcional) Migrar a **DocSearch v4 con AskAI** | Búsqueda conversacional sobre el propio índice; encaja con el posicionamiento AI-first de Sealmetrics | 2–4 h |

---

## 2. SEO on-page

### Hallazgos

- **Descriptions**: 39 páginas sin description (las 39 en `/api/`: `authentication.mdx`, `audit.mdx`, `exports.mdx`, `organizations.mdx`…), 34 con <70 caracteres, 15 con >170. Hubs con descriptions inservibles (`/blog` = "Blog").
- **Títulos**: 12 pares duplicados (p. ej. varios "FAQ", "Overview") → canibalizan y confunden en SERP y en el buscador.
- **Headings**: 22 páginas multi-H1 (peor: `api/sdk-python.mdx` con 33), 18 con saltos de nivel H1→H3.
- **Enlazado interno**: media de ~2,8 enlaces/página; **13 páginas con cero enlaces internos** (`api/quick-start.mdx`, `compliance/cnil-self-assessment.mdx`, `integrations/ecommerce/woocommerce.mdx`, `blog/cookieless-analytics-guide.mdx`…). No hay secciones "Related docs".
- **Redirects**: `@docusaurus/plugin-client-redirects` está en package.json pero **no configurado** en `docusaurus.config.ts`. Cualquier renombrado pierde el 100% del link equity.
- **Imágenes**: solo 4 imágenes en 267 páginas (todas con alt ✅). Cero diagramas = cero presencia en Google Images y menos citabilidad.
- **Pendiente de la auditoría de abril** (FULL-AUDIT-REPORT.md): BreadcrumbList en posts del blog, descriptions de hubs.

### Acciones

| # | Acción | Detalle | Esfuerzo |
|---|---|---|---|
| S1 | Completar las **39 descriptions** de `/api` + reescribir las 34 cortas y los hubs | Plantilla: "[Qué es] — [beneficio]. [Para quién]" (90–160 chars) | 2 h |
| S2 | **Normalizar headings** | 1 H1 por página (el del frontmatter), H2 como nivel de sección. Prioridad: `sdk-python.mdx`, `migration-from-v1.mdx` y las 18 con saltos | 2–3 h |
| S3 | **Des-duplicar títulos** | "FAQ" → "Billing FAQ", "API FAQ"…; "Overview" → "Reports Overview"… | 1 h |
| S4 | **Configurar plugin-client-redirects** con las URLs renombradas desde feb-2026 (revisar git log) y política de "todo renombrado lleva redirect" | Crítico antes de cualquier reorganización futura | 1 h |
| S5 | **Enlazado interno**: 3–5 enlaces contextuales en las 13 páginas aisladas + sección "Related docs" al final de las páginas largas y hubs | El post GA4-vs-Sealmetrics (3.600 palabras) apenas enlaza a docs | 2–3 h |
| S6 | **BreadcrumbList en blog** (Home > Blog > Post) | Pendiente desde abril | 30 min |
| S7 | Diagramas con alt keyword-rich en top pages (`quick-start`, `how-it-works`, `funnel`) | Ganancia en Google Images + citabilidad AI | 4–6 h |

---

## 3. GEO (posicionamiento en motores de IA)

### Lo que ya está bien
llms.txt (76 KB) y llms-full.txt (232 KB) generados en prebuild + cron diario; mirror plaintext completo en `/docs-raw/` (241 archivos); TL;DR automático en posts de blog; FAQPage JSON-LD en 8 páginas de FAQ; robots.txt permite todos los bots de IA relevantes; todo el contenido es HTML estático (sin JS requerido).

### Lo que falta: señalización y descubrimiento

| # | Acción | Detalle | Esfuerzo |
|---|---|---|---|
| G1 | Anunciar **llms.txt en robots.txt** (comentario + convención) y añadir `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly docs">` en `headTags` | Hoy un crawler solo lo encuentra por convención | 10 min |
| G2 | **Referenciar llms-full.txt desde llms.txt** (sección "## Full Documentation") | Hoy es invisible | 5 min |
| G3 | Botón/enlace **"View as Markdown"** por página apuntando a su `/docs-raw/*.txt` (y valorar servirlos como `.md`) | Patrón Mintlify/Stripe; los agentes lo usan de verdad | 1–2 h |
| G4 | **HowTo schema** en las páginas "How to…" (~15: `how-to-change-utm-parameters`, `how-to-measure-conversions`…). Extender `generate-faq-schema.mjs` | FAQPage ya cubre FAQs; HowTo cubre el resto de consultas "cómo" | 1–2 h |
| G5 | **Cablear `generate-faq-schema.mjs` e `inject-blog-tldr.mjs` al prebuild** (hoy son manuales → se quedarán obsoletos) | Añadir a script `prebuild` en package.json | 10 min |
| G6 | Añadir **"Quick answer"** (2–3 frases que respondan la pregunta del título) al inicio de las páginas doc más buscadas, como ya hace el blog | Es lo que citan Perplexity/ChatGPT a nivel de pasaje | 2–3 h |

---

## 4. Estructura y mantenimiento

- **/guides** tiene 1 sola guía y ocupa un slot del navbar (el hub está noindex). O se añaden 2–3 guías más o se enlaza directo a la guía.
- **Frescura desigual**: ~50 páginas sin tocar desde feb-2026 o antes (`implementation/content-site-structure` desde dic-2025). Pase de revisión trimestral.
- **Limpieza**: `empty.txt`, `force.txt`, `scripts/postman-*` sin commitear — decidir si van al repo o a .gitignore.
- **Idioma**: los docs son English-only pero parte de la audiencia busca en español (visto en el buscador). Corto plazo: sinónimos (B1). Medio plazo: valorar i18n de Docusaurus para las 20–30 páginas top en ES.

---

## Plan por fases

**Fase 1 — Quick wins (1 día):**
B1 sinónimos + B2 reindex-on-deploy + G1/G2/G5 señalización llms + S1 descriptions API + S4 redirects. → El buscador mejora de forma visible y la capa GEO queda descubrible.

**Fase 2 — Estructura (2–3 días):**
S2 headings + S3 títulos + S5 enlazado interno + S6 breadcrumbs blog + B4 pageRank + G4 HowTo + G6 quick answers.

**Fase 3 — Continuo:**
S7 diagramas, refresh de páginas antiguas, más guías largas (la de cookieless analytics es el modelo), decisión sobre ES, B5 AskAI.

**Medición:** Search Console (CTR e impresiones por directorio), Algolia Analytics (queries sin resultados y sin clic — activar el informe "No results"), y menciones/citas en AI (tráfico referral de chatgpt.com/perplexity.ai en Sealmetrics).
