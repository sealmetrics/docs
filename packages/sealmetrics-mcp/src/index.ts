#!/usr/bin/env node
/**
 * Sealmetrics MCP Server
 *
 * A Model Context Protocol server that provides access to Sealmetrics analytics data.
 * Allows AI assistants to query traffic, conversions, sales, and generate tracking pixels.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Sealmetrics API Configuration
const API_BASE_URL = "https://app.sealmetrics.com/api";

interface TokenCache {
  token: string | null;
  expiresAt: Date | null;
}

const tokenCache: TokenCache = { token: null, expiresAt: null };

// Get credentials from environment
const API_TOKEN = process.env.SEALMETRICS_API_TOKEN;
const EMAIL = process.env.SEALMETRICS_EMAIL;
const PASSWORD = process.env.SEALMETRICS_PASSWORD;
const DEFAULT_ACCOUNT_ID = process.env.SEALMETRICS_ACCOUNT_ID;

/**
 * Get authentication token
 */
async function getToken(): Promise<string> {
  // If we have a direct API token, use it
  if (API_TOKEN) {
    return API_TOKEN;
  }

  // Check cached token
  if (tokenCache.token && tokenCache.expiresAt && new Date() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  // Login with email/password
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      "Missing credentials. Set SEALMETRICS_API_TOKEN or SEALMETRICS_EMAIL/PASSWORD"
    );
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`);
  }

  const data = await response.json();
  tokenCache.token = data.access_token;
  tokenCache.expiresAt = new Date(data.expires_at);

  return tokenCache.token!;
}

/**
 * Make authenticated API request
 */
async function makeRequest(
  endpoint: string,
  params: Record<string, any>
): Promise<any> {
  const token = await getToken();

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed: ${response.status} - ${text}`);
  }

  return response.json();
}

/**
 * Validate date range format
 */
function validateDateRange(dateRange: string): boolean {
  const validRanges = new Set([
    "today",
    "yesterday",
    "last_7_days",
    "last_14_days",
    "last_30_days",
    "last_week",
    "last_month",
    "this_month",
    "this_year",
    "last_year",
  ]);

  if (validRanges.has(dateRange)) return true;

  if (dateRange.includes(",")) {
    const parts = dateRange.split(",");
    if (parts.length !== 2) return false;
    return parts.every((p) => /^\d{8}$/.test(p));
  }

  return false;
}

/**
 * Get account ID from arguments or environment
 */
function getAccountId(args: Record<string, any>): string | null {
  const provided = args.account_id;
  if (provided && provided.length >= 20) return provided;
  return DEFAULT_ACCOUNT_ID || null;
}

/**
 * Generate conversion pixel HTML
 */
function generatePixel(
  accountId: string,
  eventType: string,
  label?: string,
  value?: number,
  ignorePageview?: boolean
): string {
  const configLines = [
    `  oSm.account = "${accountId}";`,
    `  oSm.event = "${eventType}";`,
  ];

  if (label) configLines.push(`  oSm.label = "${label}";`);
  if (value !== undefined) configLines.push(`  oSm.value = ${value};`);
  if (ignorePageview) configLines.push(`  oSm.ignore_pageview = 1;`);

  return `<script>
  /* Sealmetrics Tracker Code */
  var oSm = window.oSm || {};
${configLines.join("\n")}

  !(function (e) {
    var t = "//app.sealmetrics.com/tag/tracker";
    window.oSm = oSm;
    if (window.smTrackerLoaded) sm.tracker.track(e.event);
    else
      Promise.all([
        new Promise(function (e) {
          var n = document.createElement("script");
          n.src = t;
          n.async = !0;
          n.onload = function () {
            e(t);
          };
          document.getElementsByTagName("head")[0].appendChild(n);
        }),
      ]).then(function () {
        sm.tracker.track(e.event);
      });
  })(oSm);
</script>`;
}

/**
 * Format acquisition data summary
 */
function formatAcquisitionSummary(data: any[]): string {
  if (!data.length) {
    return "## Traffic Summary\n\nNo acquisition data found for this period.";
  }

  const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const totalConversions = data.reduce(
    (sum, item) => sum + (item.conversions || 0),
    0
  );
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  let summary = `## Traffic Summary\n\n`;
  summary += `| Metric | Value |\n|--------|-------|\n`;
  summary += `| Total Clicks | ${totalClicks.toLocaleString()} |\n`;
  summary += `| Total Conversions | ${totalConversions.toLocaleString()} |\n`;
  summary += `| Total Revenue | $${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} |\n`;

  if (totalClicks > 0) {
    const convRate = ((totalConversions / totalClicks) * 100).toFixed(2);
    summary += `| Conversion Rate | ${convRate}% |\n`;
  }

  summary += `\n### Top Sources\n\n`;
  const sorted = [...data].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const top10 = sorted.slice(0, 10);

  summary += `| Source | Clicks | Conversions | Revenue |\n`;
  summary += `|--------|--------|-------------|----------|\n`;

  for (const item of top10) {
    const source = item.name || item.utm_source || "Unknown";
    summary += `| ${source} | ${(item.clicks || 0).toLocaleString()} | ${(item.conversions || 0).toLocaleString()} | $${(item.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} |\n`;
  }

  return summary;
}

/**
 * Format conversions summary
 */
function formatConversionsSummary(data: any[]): string {
  if (!data.length) {
    return "## Conversions Summary\n\nNo conversions found for this period.";
  }

  const totalConversions = data.length;
  const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0);

  let summary = `## Conversions Summary\n\n`;
  summary += `| Metric | Value |\n|--------|-------|\n`;
  summary += `| Total Conversions | ${totalConversions.toLocaleString()} |\n`;
  summary += `| Total Revenue | $${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} |\n`;

  if (totalConversions > 0) {
    const avgOrderValue = totalRevenue / totalConversions;
    summary += `| Average Order Value | $${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} |\n`;
  }

  // Group by source
  const bySource: Record<string, { count: number; revenue: number }> = {};
  for (const item of data) {
    const source = item.utm_source || "Direct";
    if (!bySource[source]) bySource[source] = { count: 0, revenue: 0 };
    bySource[source].count++;
    bySource[source].revenue += item.amount || 0;
  }

  summary += `\n### By Source\n\n`;
  summary += `| Source | Conversions | Revenue |\n`;
  summary += `|--------|-------------|----------|\n`;

  const sortedSources = Object.entries(bySource).sort(
    (a, b) => b[1].revenue - a[1].revenue
  );

  for (const [source, stats] of sortedSources.slice(0, 10)) {
    summary += `| ${source} | ${stats.count.toLocaleString()} | $${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} |\n`;
  }

  return summary;
}

/**
 * Format microconversions summary
 */
function formatMicroconversionsSummary(data: any[]): string {
  if (!data.length) {
    return "## Microconversions Summary\n\nNo microconversions found for this period.";
  }

  // Group by label
  const byLabel: Record<string, number> = {};
  for (const item of data) {
    const label = item.label || "unknown";
    byLabel[label] = (byLabel[label] || 0) + 1;
  }

  let summary = `## Microconversions Summary\n\n`;
  summary += `| Metric | Value |\n|--------|-------|\n`;
  summary += `| Total Events | ${data.length.toLocaleString()} |\n`;
  summary += `| Unique Event Types | ${Object.keys(byLabel).length} |\n`;

  summary += `\n### By Event Type\n\n`;
  summary += `| Event | Count | Percentage |\n`;
  summary += `|-------|-------|------------|\n`;

  const sortedLabels = Object.entries(byLabel).sort((a, b) => b[1] - a[1]);
  for (const [label, count] of sortedLabels) {
    const pct = ((count / data.length) * 100).toFixed(1);
    summary += `| ${label} | ${count.toLocaleString()} | ${pct}% |\n`;
  }

  return summary;
}

// Define tools
const tools: Tool[] = [
  {
    name: "list_accounts",
    description: "Get list of Sealmetrics accounts available to the authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_traffic",
    description:
      "Get traffic/acquisition data from Sealmetrics. Answers questions like 'How much traffic from SEO yesterday?' or 'Show me Google Ads performance this month'",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Sealmetrics account ID (optional if SEALMETRICS_ACCOUNT_ID is set)",
        },
        date_range: {
          type: "string",
          description:
            "Date range: 'yesterday', 'today', 'last_7_days', 'last_30_days', 'this_month', 'last_month', or 'YYYYMMDD,YYYYMMDD'",
        },
        report_type: {
          type: "string",
          description: "Report grouping: 'Source', 'Medium', 'Campaign', 'Term'",
          default: "Source",
        },
        utm_source: {
          type: "string",
          description: "Filter by specific source (e.g., 'google', 'facebook', 'seo')",
        },
        utm_medium: {
          type: "string",
          description: "Filter by medium (e.g., 'organic', 'cpc', 'email')",
        },
        utm_campaign: {
          type: "string",
          description: "Filter by campaign name",
        },
        country: {
          type: "string",
          description: "Filter by country code (e.g., 'us', 'es')",
        },
        limit: {
          type: "integer",
          description: "Maximum number of results to return (default: 100, max: 1000)",
          default: 100,
        },
        skip: {
          type: "integer",
          description: "Number of results to skip for pagination",
          default: 0,
        },
      },
      required: ["date_range"],
    },
  },
  {
    name: "get_conversions",
    description:
      "Get conversion/sales data from Sealmetrics. Answers questions like 'How many sales this month?' or 'Show conversions from Google Ads yesterday'",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Sealmetrics account ID (optional if SEALMETRICS_ACCOUNT_ID is set)",
        },
        date_range: {
          type: "string",
          description: "Date range",
        },
        utm_source: {
          type: "string",
          description: "Filter by specific source",
        },
        utm_medium: {
          type: "string",
          description: "Filter by medium",
        },
        utm_campaign: {
          type: "string",
          description: "Filter by campaign name",
        },
        country: {
          type: "string",
          description: "Filter by country code",
        },
        limit: {
          type: "integer",
          description: "Maximum number of results",
          default: 100,
        },
        skip: {
          type: "integer",
          description: "Number of results to skip",
          default: 0,
        },
      },
      required: ["date_range"],
    },
  },
  {
    name: "get_microconversions",
    description:
      "Get microconversion data (add-to-cart, signups, etc.) from Sealmetrics",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Sealmetrics account ID",
        },
        date_range: {
          type: "string",
          description: "Date range",
        },
        label: {
          type: "string",
          description: "Filter by microconversion label",
        },
        utm_source: {
          type: "string",
          description: "Filter by source",
        },
        utm_medium: {
          type: "string",
          description: "Filter by medium",
        },
        country: {
          type: "string",
          description: "Filter by country code",
        },
        limit: {
          type: "integer",
          description: "Maximum number of results",
          default: 100,
        },
        skip: {
          type: "integer",
          description: "Number of results to skip",
          default: 0,
        },
      },
      required: ["date_range"],
    },
  },
  {
    name: "get_funnel",
    description: "Get funnel analysis showing progression through conversion stages",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Sealmetrics account ID",
        },
        date_range: {
          type: "string",
          description: "Date range",
        },
        report_type: {
          type: "string",
          description: "Report grouping: 'Source', 'Medium', 'Campaign'",
          default: "Source",
        },
      },
      required: ["date_range"],
    },
  },
  {
    name: "get_roas_evolution",
    description: "Get ROAS (Return on Ad Spend) evolution over time",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Sealmetrics account ID",
        },
        date_range: {
          type: "string",
          description: "Date range",
        },
        time_unit: {
          type: "string",
          description: "Time grouping: 'daily', 'weekly', 'monthly'",
          default: "daily",
        },
        utm_source: {
          type: "string",
          description: "Filter by source",
        },
        utm_medium: {
          type: "string",
          description: "Filter by medium",
        },
      },
      required: ["date_range"],
    },
  },
  {
    name: "get_pages",
    description: "Get page performance metrics including views and entry pages",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Sealmetrics account ID",
        },
        date_range: {
          type: "string",
          description: "Date range",
        },
        content_grouping: {
          type: "string",
          description: "Filter by content group name",
        },
        utm_source: {
          type: "string",
          description: "Filter by traffic source",
        },
        utm_medium: {
          type: "string",
          description: "Filter by medium",
        },
        country: {
          type: "string",
          description: "Filter by country code",
        },
        show_utms: {
          type: "boolean",
          description: "Include UTM breakdown in results",
          default: false,
        },
        limit: {
          type: "integer",
          description: "Maximum number of results",
          default: 100,
        },
        skip: {
          type: "integer",
          description: "Number of results to skip",
          default: 0,
        },
      },
      required: ["date_range"],
    },
  },
  {
    name: "generate_pixel",
    description:
      "Generate a Sealmetrics tracking pixel for conversions or microconversions, ready for Google Tag Manager",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Your Sealmetrics account ID",
        },
        event_type: {
          type: "string",
          description: "Event type: 'conversion' or 'microconversion'",
          enum: ["conversion", "microconversion"],
          default: "conversion",
        },
        label: {
          type: "string",
          description: "Event label (e.g., 'sales', 'add-to-cart', 'newsletter-signup')",
        },
        value: {
          type: "number",
          description: "Monetary value for the event",
        },
        ignore_pageview: {
          type: "boolean",
          description: "Set to true to avoid counting an additional pageview",
          default: false,
        },
      },
      required: [],
    },
  },
];

// Initialize server
const server = new Server(
  {
    name: "sealmetrics",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_accounts": {
        const result = await makeRequest("/auth/accounts", {});
        const accounts = result.data || {};

        let text = "## Available Sealmetrics Accounts\n\n";

        if (!Object.keys(accounts).length && DEFAULT_ACCOUNT_ID) {
          text += `**Default Account**\n- ID: \`${DEFAULT_ACCOUNT_ID}\`\n`;
        } else {
          for (const [id, accountName] of Object.entries(accounts)) {
            text += `**${accountName}**\n- ID: \`${id}\`\n\n`;
          }
        }

        return { content: [{ type: "text", text }] };
      }

      case "get_traffic": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const dateRange = (args as any).date_range;
        if (!validateDateRange(dateRange)) {
          return {
            content: [{ type: "text", text: `Error: Invalid date range: ${dateRange}` }],
          };
        }

        const result = await makeRequest("/report/acquisition", {
          account_id: accountId,
          date_range: dateRange,
          report_type: (args as any).report_type || "Source",
          utm_source: (args as any).utm_source,
          utm_medium: (args as any).utm_medium,
          utm_campaign: (args as any).utm_campaign,
          country: (args as any).country,
          limit: (args as any).limit || 100,
          skip: (args as any).skip || 0,
        });

        const text = formatAcquisitionSummary(result.data || []);
        return { content: [{ type: "text", text }] };
      }

      case "get_conversions": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const dateRange = (args as any).date_range;
        if (!validateDateRange(dateRange)) {
          return {
            content: [{ type: "text", text: `Error: Invalid date range: ${dateRange}` }],
          };
        }

        const result = await makeRequest("/report/conversions", {
          account_id: accountId,
          date_range: dateRange,
          utm_source: (args as any).utm_source,
          utm_medium: (args as any).utm_medium,
          utm_campaign: (args as any).utm_campaign,
          country: (args as any).country,
          limit: (args as any).limit || 100,
          skip: (args as any).skip || 0,
        });

        const text = formatConversionsSummary(result.data || []);
        return { content: [{ type: "text", text }] };
      }

      case "get_microconversions": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const dateRange = (args as any).date_range;
        if (!validateDateRange(dateRange)) {
          return {
            content: [{ type: "text", text: `Error: Invalid date range: ${dateRange}` }],
          };
        }

        const result = await makeRequest("/report/microconversions", {
          account_id: accountId,
          date_range: dateRange,
          utm_source: (args as any).utm_source,
          utm_medium: (args as any).utm_medium,
          country: (args as any).country,
          limit: (args as any).limit || 100,
          skip: (args as any).skip || 0,
        });

        let data = result.data || [];

        // Filter by label if specified
        const labelFilter = (args as any).label;
        if (labelFilter) {
          data = data.filter((item: any) => item.label === labelFilter);
        }

        const text = formatMicroconversionsSummary(data);
        return { content: [{ type: "text", text }] };
      }

      case "get_funnel": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const dateRange = (args as any).date_range;
        if (!validateDateRange(dateRange)) {
          return {
            content: [{ type: "text", text: `Error: Invalid date range: ${dateRange}` }],
          };
        }

        const result = await makeRequest("/report/funnel", {
          account_id: accountId,
          date_range: dateRange,
          report_type: (args as any).report_type || "Source",
        });

        let text = "## Funnel Analysis\n\n";
        for (const item of result.data || []) {
          const source = item.name || item.utm_source || "Unknown";
          text += `### ${source}\n\n`;
          for (const [key, value] of Object.entries(item)) {
            if (!["name", "utm_source", "_id"].includes(key)) {
              text += `- **${key}:** ${(value as number).toLocaleString()}\n`;
            }
          }
          text += "\n";
        }

        return { content: [{ type: "text", text }] };
      }

      case "get_roas_evolution": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const dateRange = (args as any).date_range;
        if (!validateDateRange(dateRange)) {
          return {
            content: [{ type: "text", text: `Error: Invalid date range: ${dateRange}` }],
          };
        }

        const result = await makeRequest("/report/roas-evolution", {
          account_id: accountId,
          date_range: dateRange,
          time_unit: (args as any).time_unit || "daily",
          utm_source: (args as any).utm_source,
          utm_medium: (args as any).utm_medium,
        });

        let text = "## ROAS Evolution\n\n";
        text += `| Date | Clicks | Page Views | Conversions | Revenue |\n`;
        text += `|------|--------|------------|-------------|----------|\n`;

        for (const item of result.data || []) {
          const date = item._id;
          text += `| ${date} | ${(item.clicks || 0).toLocaleString()} | ${(item.page_views || 0).toLocaleString()} | ${(item.conversions || 0).toLocaleString()} | $${(item.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} |\n`;
        }

        return { content: [{ type: "text", text }] };
      }

      case "get_pages": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const dateRange = (args as any).date_range;
        if (!validateDateRange(dateRange)) {
          return {
            content: [{ type: "text", text: `Error: Invalid date range: ${dateRange}` }],
          };
        }

        const result = await makeRequest("/report/pages", {
          account_id: accountId,
          date_range: dateRange,
          content_grouping: (args as any).content_grouping,
          utm_source: (args as any).utm_source,
          utm_medium: (args as any).utm_medium,
          country: (args as any).country,
          show_utms: (args as any).show_utms || false,
          limit: (args as any).limit || 100,
          skip: (args as any).skip || 0,
        });

        let text = "## Page Performance\n\n";
        text += `| URL | Views | Entry Pages |\n`;
        text += `|-----|-------|-------------|\n`;

        for (const item of (result.data || []).slice(0, 20)) {
          const url = item.url || "Unknown";
          text += `| ${url} | ${(item.views || 0).toLocaleString()} | ${(item.entry_page || 0).toLocaleString()} |\n`;
        }

        return { content: [{ type: "text", text }] };
      }

      case "generate_pixel": {
        const accountId = getAccountId(args as Record<string, any>);
        if (!accountId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No account_id provided and SEALMETRICS_ACCOUNT_ID not set.",
              },
            ],
          };
        }

        const pixel = generatePixel(
          accountId,
          (args as any).event_type || "conversion",
          (args as any).label,
          (args as any).value,
          (args as any).ignore_pageview
        );

        let text = "## Sealmetrics Tracking Pixel\n\n";
        text += "Copy this code and paste it into Google Tag Manager or your website:\n\n";
        text += "```html\n" + pixel + "\n```\n\n";
        text += "### Usage Instructions:\n\n";
        text += "1. **For Google Tag Manager:** Create a new Custom HTML tag and paste this code\n";
        text += "2. **For Direct Website Integration:** Paste this code where you want the conversion to be tracked\n";
        text += "3. **Trigger:** Configure when this pixel should fire\n";

        return { content: [{ type: "text", text }] };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
    };
  }
});

// Main entry point
async function main() {
  if (!API_TOKEN && (!EMAIL || !PASSWORD)) {
    console.error(
      "Missing credentials. Set SEALMETRICS_API_TOKEN or SEALMETRICS_EMAIL/PASSWORD"
    );
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
