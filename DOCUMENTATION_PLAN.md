# Plan de Documentación - Sealmetrics v2

## Resumen Ejecutivo

Este plan cubre la documentación de 5 áreas críticas sin documentar:
1. **LENS AI** - Sistema de detección de anomalías e IA
2. **Billing** - Sistema de facturación y planes
3. **Settings** - Configuración de la plataforma
4. **Security** - Funcionalidades de seguridad
5. **Properties** - Propiedades de eventos personalizadas

---

## 1. LENS AI

### Ubicación: `docs/lens/`

### Estructura de Archivos

```
docs/lens/
├── index.mdx                    # Introducción a LENS AI
├── getting-started.mdx          # Primeros pasos con LENS
├── anomaly-detection/
│   ├── index.mdx               # Cómo funciona la detección
│   ├── rule-types.mdx          # Tipos de reglas (60+)
│   ├── custom-rules.mdx        # Crear reglas personalizadas
│   └── thresholds.mdx          # Configuración de umbrales
├── ai-assistant/
│   ├── index.mdx               # Chat con LENS
│   ├── question-limits.mdx     # Límites por plan
│   └── best-practices.mdx      # Cómo hacer buenas preguntas
├── reports/
│   ├── lens-reports.mdx        # Informes generados por LENS
│   ├── email-alerts.mdx        # Alertas automáticas
│   └── executive-summary.mdx   # Resumen ejecutivo semanal
└── api/
    └── lens-endpoints.mdx      # API de LENS
```

### Contenido Detallado

#### `index.mdx` - Introducción a LENS AI
- Qué es LENS y por qué lo necesitas
- Beneficios clave (detección proactiva, ahorro de tiempo)
- Componentes principales:
  - Detección de anomalías (60+ reglas)
  - Asistente IA (chat)
  - Informes automatizados
- Proveedores LLM soportados: DeepSeek, Claude, OpenAI, Gemini
- Disponibilidad por plan

#### `anomaly-detection/rule-types.mdx` - Catálogo de Reglas
Documentar las 60+ reglas organizadas por categoría:

| Categoría | Reglas | Descripción |
|-----------|--------|-------------|
| Traffic | traffic_drop_significant, traffic_spike_unusual | Cambios en tráfico |
| Conversions | conversion_rate_drop, revenue_anomaly | Cambios en conversiones |
| Sources | source_performance_change, new_source_detected | Fuentes de tráfico |
| Technical | pixel_errors, data_delay | Problemas técnicos |
| Campaigns | campaign_budget_anomaly, roas_decline | Rendimiento de campañas |

#### `ai-assistant/question-limits.mdx` - Límites por Plan
| Plan | Preguntas/mes | Overage |
|------|---------------|---------|
| Research | 50 | €0.50/pregunta |
| Guard | 200 | €0.40/pregunta |
| Growth | 500 | €0.30/pregunta |

#### `api/lens-endpoints.mdx` - Endpoints API
```
POST /api/lens/chat           # Enviar pregunta al asistente
GET  /api/lens/rules          # Listar reglas activas
POST /api/lens/rules/custom   # Crear regla personalizada
GET  /api/lens/anomalies      # Obtener anomalías detectadas
GET  /api/lens/reports        # Obtener informes generados
```

---

## 2. Billing

### Ubicación: `docs/billing/`

### Estructura de Archivos

```
docs/billing/
├── index.mdx                   # Resumen de planes y precios
├── plans/
│   ├── research.mdx           # Plan Research (€199/mes)
│   ├── guard.mdx              # Plan Guard (€399/mes)
│   └── growth.mdx             # Plan Growth (€599/mes)
├── features-comparison.mdx     # Tabla comparativa de features
├── usage-limits.mdx            # Límites y cuotas
├── add-ons.mdx                 # Complementos adicionales
├── invoices.mdx                # Gestión de facturas
└── faq.mdx                     # Preguntas frecuentes
```

### Contenido Detallado

#### `index.mdx` - Planes y Precios

**Tabla de Planes:**
| Feature | Research €199/mes | Guard €399/mes | Growth €599/mes |
|---------|-------------------|----------------|-----------------|
| Cuentas incluidas | 1 | 3 | 10 |
| Pageviews/mes | 500K | 2M | 10M |
| Retención datos | 12 meses | 24 meses | 36 meses |
| LENS AI preguntas | 50 | 200 | 500 |
| Usuarios | 2 | 5 | Ilimitados |
| Soporte | Email | Email + Chat | Dedicado |
| SLA | - | 99.5% | 99.9% |
| API access | Básico | Completo | Completo + Prioridad |

#### `add-ons.mdx` - Complementos
| Add-on | Precio | Descripción |
|--------|--------|-------------|
| Cuentas adicionales | €300/10 cuentas | Pack de 10 cuentas extra |
| Preguntas LENS | €99/100 preguntas | Pack de preguntas adicionales |
| Retención extendida | €50/año adicional | Más tiempo de retención |
| Pageviews extra | €20/100K | Pageviews adicionales |

#### `usage-limits.mdx` - Límites
- Cómo se calculan los pageviews
- Qué pasa al exceder límites
- Alertas de uso (80%, 90%, 100%)
- Política de overage

---

## 3. Settings

### Ubicación: `docs/platform/settings/`

### Estructura de Archivos

```
docs/platform/settings/
├── index.mdx                   # Resumen de configuración
├── account/
│   ├── general.mdx            # Configuración general
│   ├── users.mdx              # Gestión de usuarios
│   └── api-keys.mdx           # Claves API
├── tracking/
│   ├── pixel-builder.mdx      # Constructor de pixel
│   ├── content-grouping.mdx   # Agrupación de contenido
│   └── custom-dimensions.mdx  # Dimensiones personalizadas
├── integrations/
│   ├── bigquery.mdx           # Integración BigQuery
│   ├── migrations.mdx         # Migraciones de datos
│   └── webhooks.mdx           # Configuración webhooks
├── notifications/
│   ├── email-alerts.mdx       # Alertas por email
│   └── slack.mdx              # Integración Slack
└── advanced/
    ├── audit-log.mdx          # Log de auditoría
    └── data-export.mdx        # Exportación de datos
```

### Contenido Detallado

#### `tracking/pixel-builder.mdx` - Constructor de Pixel
- Interfaz visual para generar código del pixel
- Opciones de configuración:
  - Dominio de tracking
  - Modo SuperPrivacy
  - Tracking de scroll
  - Tracking de tiempo en página
- Código generado para diferentes plataformas
- Verificación de instalación

#### `tracking/content-grouping.mdx` - Agrupación de Contenido
- Qué es content grouping
- Crear reglas de agrupación:
  - Por URL pattern (regex)
  - Por parámetro
  - Por página
- Ejemplos comunes:
  - Agrupar categorías de producto
  - Agrupar secciones del blog
  - Agrupar landing pages

#### `integrations/bigquery.mdx` - BigQuery
- Requisitos previos (proyecto GCP, permisos)
- Configuración paso a paso
- Esquema de datos exportado
- Frecuencia de sincronización
- Consultas de ejemplo

#### `advanced/audit-log.mdx` - Log de Auditoría
- Qué eventos se registran
- Cómo acceder al log
- Filtrado y búsqueda
- Retención de logs
- Exportación para compliance

---

## 4. Security

### Ubicación: `docs/security-privacy/` (carpeta existente)

### Archivos a Añadir

```
docs/security-privacy/
├── ... (archivos existentes)
├── account-security/
│   ├── two-factor-auth.mdx    # Autenticación 2FA
│   ├── backup-codes.mdx       # Códigos de respaldo
│   ├── ip-allowlist.mdx       # Lista blanca de IPs
│   └── session-management.mdx # Gestión de sesiones
├── api-security/
│   ├── api-tokens.mdx         # Tokens de API
│   ├── token-scopes.mdx       # Permisos de tokens
│   └── rate-limiting.mdx      # Límites de rate
└── compliance/
    └── audit-logging.mdx      # Logging para compliance
```

### Contenido Detallado

#### `account-security/two-factor-auth.mdx` - 2FA/TOTP
- Por qué activar 2FA
- Apps compatibles (Google Authenticator, Authy, 1Password)
- Proceso de activación:
  1. Ir a Settings > Security
  2. Click "Enable 2FA"
  3. Escanear código QR
  4. Introducir código de verificación
  5. Guardar códigos de respaldo
- Qué hacer si pierdes acceso
- Desactivar 2FA

#### `account-security/backup-codes.mdx` - Códigos de Respaldo
- Cuántos códigos se generan (10)
- Cuándo usarlos
- Regenerar códigos
- Almacenamiento seguro recomendado

#### `account-security/ip-allowlist.mdx` - Lista Blanca de IPs
- Cuándo usar IP allowlist
- Añadir IPs permitidas
- Formatos soportados (IP individual, CIDR)
- Comportamiento cuando se activa
- Recuperación si te bloqueas

#### `account-security/session-management.mdx` - Sesiones
- Ver sesiones activas
- Información mostrada (IP, navegador, ubicación, última actividad)
- Cerrar sesiones remotamente
- Cerrar todas las sesiones

#### `api-security/api-tokens.mdx` - Tokens API
- Diferencia token vs API key
- Crear nuevo token:
  - Nombre descriptivo
  - Fecha de expiración
  - Scopes/permisos
- Revocar tokens
- Best practices:
  - Rotar tokens regularmente
  - Usar mínimos permisos necesarios
  - No compartir tokens

#### `api-security/token-scopes.mdx` - Permisos
| Scope | Descripción | Endpoints permitidos |
|-------|-------------|---------------------|
| `read:reports` | Leer informes | GET /api/report/* |
| `read:accounts` | Leer cuentas | GET /api/auth/accounts |
| `write:conversions` | Enviar conversiones | POST /api/conversions |
| `admin` | Acceso completo | Todos |

---

## 5. Properties

### Ubicación: `docs/implementation/`

### Archivos a Crear/Modificar

```
docs/implementation/
├── ... (archivos existentes)
├── custom-properties/
│   ├── index.mdx              # Introducción a properties
│   ├── event-properties.mdx   # Propiedades de eventos
│   ├── user-properties.mdx    # Propiedades de usuario
│   └── content-grouping.mdx   # Content groups como properties
└── data-model/
    └── property-types.mdx     # Tipos de datos soportados
```

### Contenido Detallado

#### `custom-properties/index.mdx` - Introducción
- Qué son las propiedades personalizadas
- Casos de uso:
  - Segmentar por tipo de cliente
  - Analizar por categoría de producto
  - Filtrar por versión de app
- Límites:
  - Máximo 50 propiedades por evento
  - Nombre máx 64 caracteres
  - Valor máx 256 caracteres

#### `custom-properties/event-properties.mdx` - Propiedades de Eventos
```javascript
// Enviar evento con propiedades
_sm('event', 'purchase', {
  properties: {
    product_category: 'electronics',
    product_brand: 'Apple',
    payment_method: 'credit_card',
    is_first_purchase: 'true',
    customer_tier: 'gold'
  }
});
```

**Propiedades reservadas:**
| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `_amount` | Valor monetario | `149.99` |
| `_currency` | Moneda | `EUR` |
| `_label` | Etiqueta del evento | `purchase` |
| `_order_id` | ID de pedido | `ORD-12345` |

#### `custom-properties/content-grouping.mdx` - Content Groups
- Crear grupos de contenido
- Reglas de asignación:
  ```
  URL contains /blog/     → content_group: "Blog"
  URL contains /products/ → content_group: "Products"
  URL matches /es/*       → content_group: "Spanish Site"
  ```
- Ver datos agrupados en informes
- API para content groups

#### `data-model/property-types.mdx` - Tipos de Datos
Almacenamiento en ClickHouse usando `Map(String, String)`:

| Tipo Input | Almacenamiento | Notas |
|------------|----------------|-------|
| String | String | Directo |
| Number | String | Se convierte "123.45" |
| Boolean | String | "true" / "false" |
| Array | String | JSON stringified |
| Object | - | No soportado, aplanar |

---

## Prioridades de Implementación

### Fase 1 - Crítico (Semana 1-2)
1. **LENS AI** - index.mdx + getting-started.mdx
2. **Security** - two-factor-auth.mdx + api-tokens.mdx
3. **Billing** - index.mdx + plans/*.mdx

### Fase 2 - Importante (Semana 3-4)
4. **Properties** - event-properties.mdx + content-grouping.mdx
5. **Settings** - pixel-builder.mdx + api-keys.mdx
6. **LENS AI** - anomaly-detection/*.mdx

### Fase 3 - Complementario (Semana 5-6)
7. **Settings** - bigquery.mdx + audit-log.mdx
8. **Security** - ip-allowlist.mdx + session-management.mdx
9. **Billing** - add-ons.mdx + faq.mdx
10. **LENS AI** - ai-assistant/*.mdx + reports/*.mdx

---

## _category_.json a Crear

```json
// docs/lens/_category_.json
{
  "label": "LENS AI",
  "position": 3,
  "collapsible": true,
  "collapsed": false,
  "description": "AI-powered anomaly detection and insights"
}

// docs/billing/_category_.json
{
  "label": "Plans & Billing",
  "position": 11,
  "collapsible": true,
  "collapsed": true
}

// docs/platform/settings/_category_.json
{
  "label": "Settings",
  "position": 2
}
```

---

## Actualización de sidebars.ts

```typescript
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },
    { type: 'category', label: 'Getting Started', items: [{ type: 'autogenerated', dirName: 'getting-started' }] },
    { type: 'category', label: 'LENS AI', items: [{ type: 'autogenerated', dirName: 'lens' }] },  // NUEVO
    { type: 'category', label: 'Reports & Insights', items: [{ type: 'autogenerated', dirName: 'reports' }] },
    { type: 'category', label: 'Implementation', items: [{ type: 'autogenerated', dirName: 'implementation' }] },
    { type: 'category', label: 'Integrations', items: [{ type: 'autogenerated', dirName: 'integrations' }] },
    { type: 'category', label: 'API Reference', items: [{ type: 'autogenerated', dirName: 'api' }] },
    { type: 'category', label: 'Security & Privacy', items: [{ type: 'autogenerated', dirName: 'security-privacy' }] },
    { type: 'category', label: 'Compliance', items: [{ type: 'autogenerated', dirName: 'compliance' }] },
    { type: 'category', label: 'Platform Settings', items: [{ type: 'autogenerated', dirName: 'platform' }] },
    { type: 'category', label: 'Plans & Billing', items: [{ type: 'autogenerated', dirName: 'billing' }] },  // NUEVO
    { type: 'category', label: 'Use Cases', items: [{ type: 'autogenerated', dirName: 'use-cases' }] },
    { type: 'category', label: 'GA4 Migration', items: [{ type: 'autogenerated', dirName: 'ga4-migration' }] },
    { type: 'category', label: 'FAQ', items: [{ type: 'autogenerated', dirName: 'faq' }] },
  ],
};
```

---

## Métricas de Éxito

| Área | Archivos | Palabras estimadas | Estado |
|------|----------|-------------------|--------|
| LENS AI | 12 | ~8,000 | Pendiente |
| Billing | 8 | ~3,500 | Pendiente |
| Settings | 12 | ~5,000 | Pendiente |
| Security | 8 | ~4,000 | Pendiente |
| Properties | 5 | ~2,500 | Pendiente |
| **TOTAL** | **45** | **~23,000** | - |

---

## Notas Adicionales

### Capturas de Pantalla Necesarias
- LENS dashboard con anomalías detectadas
- Chat de LENS AI en acción
- Configuración de reglas personalizadas
- Página de billing con comparativa de planes
- Configuración 2FA paso a paso
- Pixel Builder interface
- Content Grouping rules editor

### Código de Ejemplo Necesario
- Integración LENS API con Python/JS
- Envío de propiedades personalizadas
- Configuración BigQuery export
- Uso de tokens API con scopes

### Diagramas a Crear
- Flujo de detección de anomalías LENS
- Arquitectura de seguridad (2FA + tokens)
- Modelo de datos de properties
