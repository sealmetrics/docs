/**
 * docusaurus-plugin-sealmetrics
 *
 * Official Sealmetrics analytics plugin for Docusaurus.
 * Provides privacy-first, cookieless tracking with full SPA support.
 *
 * @see https://docs.sealmetrics.com/plugins-and-modules/docusaurus
 */

const path = require('path');

const DEFAULT_OPTIONS = {
  accountId: '',
  enableInDevelopment: false,
  useSession: true,
  contentGrouping: null,
  contentGroupingRules: null,
  debug: false,
  trackPageViews: true,
  respectDoNotTrack: false,
};

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('./index').PluginOptions} options
 * @returns {import('@docusaurus/types').Plugin}
 */
function pluginSealmetrics(context, options) {
  const { siteConfig } = context;
  const isProd = process.env.NODE_ENV === 'production';

  const {
    accountId,
    enableInDevelopment,
    useSession,
    contentGrouping,
    contentGroupingRules,
    debug,
    trackPageViews,
    respectDoNotTrack,
  } = { ...DEFAULT_OPTIONS, ...options };

  // Validate required options
  if (!accountId) {
    throw new Error(
      '[docusaurus-plugin-sealmetrics] Missing required option: accountId. ' +
      'Get your Account ID from your Sealmetrics dashboard.'
    );
  }

  // Skip in development unless explicitly enabled
  const isEnabled = isProd || enableInDevelopment;

  return {
    name: 'docusaurus-plugin-sealmetrics',

    getClientModules() {
      return isEnabled ? [path.resolve(__dirname, 'client.js')] : [];
    },

    contentLoaded({ actions }) {
      if (!isEnabled) {
        return;
      }

      actions.setGlobalData({
        accountId,
        useSession,
        contentGrouping,
        contentGroupingRules,
        debug,
        trackPageViews,
        respectDoNotTrack,
      });
    },

    injectHtmlTags() {
      if (!isEnabled) {
        return {};
      }

      // Build content grouping rules as JSON for client-side use
      const rulesJson = contentGroupingRules
        ? JSON.stringify(contentGroupingRules)
        : 'null';

      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
              window.__SEALMETRICS_CONFIG__ = {
                accountId: "${accountId}",
                useSession: ${useSession ? 1 : 0},
                contentGrouping: ${contentGrouping ? `"${contentGrouping}"` : 'null'},
                contentGroupingRules: ${rulesJson},
                debug: ${debug},
                trackPageViews: ${trackPageViews},
                respectDoNotTrack: ${respectDoNotTrack}
              };
            `,
          },
          {
            tagName: 'script',
            attributes: {
              src: '//app.sealmetrics.com/tag/v2/tracker',
              async: true,
            },
          },
        ],
      };
    },
  };
}

module.exports = pluginSealmetrics;
