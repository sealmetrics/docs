# Sealmetrics

> Privacy-first analytics platform that tracks 100% of website traffic without cookies or consent banners.

Sealmetrics is a GDPR-compliant, cookieless web analytics solution. It uses a Four-Variable System (timestamp, user agent, current URL, referral URL) to measure traffic without collecting personal data or requiring user consent.

## API & Agent Integration

Machine-readable entry points for AI agents and code generators:

- **OpenAPI 3.1 specification**: https://docs.sealmetrics.com/openapi.json (also as YAML: https://docs.sealmetrics.com/openapi.yaml). Generate a typed client from it instead of hand-rolling HTTP calls.
- **Interactive API reference**: https://docs.sealmetrics.com/api-reference/
- **Agent integration guide** (start here): https://docs.sealmetrics.com/api/for-agents
- **Hosted MCP server**: https://mcp.sealmetrics.com/mcp — Streamable HTTP. Read-only analytics tools for Claude, ChatGPT, Cursor, Codex and any MCP client. Setup: https://docs.sealmetrics.com/integrations/mcp-server
- **REST base URL**: https://my.sealmetrics.com/api/v1
- **Authentication**: API key (`X-API-Key`), JWT bearer, or OAuth 2.1 with PKCE and dynamic client registration (https://docs.sealmetrics.com/api/oauth). Discovery: https://my.sealmetrics.com/.well-known/oauth-authorization-server
- **Headless account creation**: `POST /api/v1/provision` (https://docs.sealmetrics.com/api/provision)
- **Batch queries**: up to 50 analytics queries per request with dependency ordering (https://docs.sealmetrics.com/api/batch)
- **Async jobs**: bulk exports with `export.completed` webhooks (https://docs.sealmetrics.com/api/exports)
- **Error codes**: stable `error.code` catalogue with retry guidance (https://docs.sealmetrics.com/api/errors)
- **Rate limits**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` on every response; `Retry-After` on 429 (https://docs.sealmetrics.com/api/rate-limits)
