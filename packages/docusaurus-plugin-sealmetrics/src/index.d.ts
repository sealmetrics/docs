/**
 * Type definitions for docusaurus-plugin-sealmetrics
 */

import type { Plugin } from '@docusaurus/types';

/**
 * Content grouping rule for automatic categorization
 */
export interface ContentGroupingRule {
  /**
   * URL path prefix to match (e.g., '/blog', '/docs/api')
   * Can also be a regex pattern string
   */
  pattern: string;

  /**
   * If using regex pattern, set this to the regex string
   * @example "^/docs/api.*"
   */
  regex?: string;

  /**
   * Content group name to assign when pattern matches
   * @example "Blog", "API Documentation", "Guides"
   */
  group: string;
}

/**
 * Plugin configuration options
 */
export interface PluginOptions {
  /**
   * Your Sealmetrics Account ID (required)
   * Find this in your Sealmetrics dashboard under Settings > Account
   * @example "60a52f6ac660b269d13c3f53"
   */
  accountId: string;

  /**
   * Enable tracking in development mode
   * By default, tracking only runs in production builds
   * @default false
   */
  enableInDevelopment?: boolean;

  /**
   * Enable session tracking for better attribution
   * Recommended for most use cases
   * @default true
   */
  useSession?: boolean;

  /**
   * Static content grouping value applied to all pages
   * Use this for simple sites with a single content type
   * @example "Documentation"
   */
  contentGrouping?: string;

  /**
   * Dynamic content grouping rules based on URL patterns
   * Rules are evaluated in order; first match wins
   * @example
   * [
   *   { pattern: '/blog', group: 'Blog' },
   *   { pattern: '/docs/api', group: 'API Reference' },
   *   { pattern: '/docs', group: 'Documentation' },
   * ]
   */
  contentGroupingRules?: ContentGroupingRule[];

  /**
   * Enable debug mode to log tracking events to console
   * Useful during development and testing
   * @default false
   */
  debug?: boolean;

  /**
   * Automatically track pageviews on navigation
   * Set to false if you want to track pageviews manually
   * @default true
   */
  trackPageViews?: boolean;

  /**
   * Respect browser's Do Not Track setting
   * When true, tracking is disabled if DNT is enabled
   * @default false
   */
  respectDoNotTrack?: boolean;
}

/**
 * Global tracking function exposed on window object
 * Use this to track custom events
 *
 * @example
 * // Track a custom event
 * window.sealmetricsTrack('button_click', { label: 'signup' });
 *
 * // Track a conversion
 * window.sealmetricsTrack('conversion', { amount: 99.99, currency: 'USD' });
 */
declare global {
  interface Window {
    sealmetricsTrack: (eventName: string, eventData?: Record<string, unknown>) => void;
    __SEALMETRICS_CONFIG__: PluginOptions;
  }
}

/**
 * Sealmetrics plugin for Docusaurus
 *
 * @example
 * // docusaurus.config.js
 * module.exports = {
 *   plugins: [
 *     [
 *       'docusaurus-plugin-sealmetrics',
 *       {
 *         accountId: 'YOUR_ACCOUNT_ID',
 *         contentGroupingRules: [
 *           { pattern: '/blog', group: 'Blog' },
 *           { pattern: '/docs', group: 'Documentation' },
 *         ],
 *       },
 *     ],
 *   ],
 * };
 */
declare function pluginSealmetrics(
  context: unknown,
  options: PluginOptions
): Plugin;

export default pluginSealmetrics;
