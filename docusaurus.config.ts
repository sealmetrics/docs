import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sealmetrics Docs',
  tagline: 'Privacy-first analytics documentation',
  favicon: 'img/favicon.png',

  url: 'https://docs.sealmetrics.com',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'rafa-sealmetrics',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  future: { v4: true },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Site-wide meta + Organization/WebSite JSON-LD only.
  // SoftwareApplication is injected on the homepage only via src/pages or docs/index.mdx <Head>.
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        as: 'image',
        href: '/img/logo.svg',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        href: 'https://docs.sealmetrics.com/llms.txt',
        title: 'LLM-friendly documentation index',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        href: 'https://docs.sealmetrics.com/llms-full.txt',
        title: 'Full documentation content for LLMs',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://pixel.sealmetrics.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#00A47C',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'referrer',
        content: 'strict-origin-when-cross-origin',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Permissions-Policy',
        content:
          'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Content-Security-Policy',
        content:
          "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://pixel.sealmetrics.com https://*.algolia.net https://*.algolianet.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self' https://sealmetrics.com;",
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://sealmetrics.com/#organization',
            name: 'Sealmetrics',
            url: 'https://sealmetrics.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://docs.sealmetrics.com/img/logo.png',
            },
            description:
              'Consentless web analytics that captures 100% of traffic without cookies or consent banners, fully GDPR and ePrivacy compliant.',
            foundingDate: '2020',
            sameAs: [
              'https://www.linkedin.com/company/sealmetrics',
              'https://x.com/sealmetrics',
              'https://github.com/sealmetrics',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              url: 'https://sealmetrics.com/contact',
              availableLanguage: ['English', 'Spanish'],
            },
          },
          {
            '@type': 'WebSite',
            '@id': 'https://docs.sealmetrics.com/#website',
            url: 'https://docs.sealmetrics.com',
            name: 'Sealmetrics Documentation',
            publisher: { '@id': 'https://sealmetrics.com/#organization' },
            inLanguage: 'en-US',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate:
                  'https://docs.sealmetrics.com/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      }),
    },
  ],

  scripts: [
    {
      src: 'https://pixel.sealmetrics.com/t.js?id=sealmetrics2&group=docs',
      defer: true,
    },
  ],

  // 301-equivalent client redirects for URLs renamed since launch.
  // Old trees (pre-Feb-2026 IA migration) → current locations.
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          { from: '/api/accounts', to: '/api/sites' },
          { from: '/product/features', to: '/getting-started/features' },
          { from: '/product/how-it-works', to: '/getting-started/how-it-works' },
          { from: '/privacy-and-consentless/faq', to: '/faq/privacy-security' },
          { from: '/first-steps/first-steps-with-sealmetrics', to: '/getting-started/quick-start' },
          { from: '/first-steps/setting-up-trackers', to: '/implementation/tracker/setup' },
          { from: '/first-steps/first-party-tracker', to: '/implementation/tracker/first-party' },
          {
            from: '/features/event-tracking-and-custom-data/understanding-event-properties',
            to: '/implementation/event-tracking',
          },
          {
            from: '/features/privacy-first-tracking/why-sealmetrics-not-blocked-by-adblockers',
            to: '/security-privacy/adblocker-bypass',
          },
          {
            from: '/features/privacy-first-tracking/if-no-userid-how-attribution-works',
            to: '/security-privacy/attribution-without-userid',
          },
        ],
        createRedirects(existingPath: string) {
          // GDPR-and-ePrivacy pages kept their /legal/... slugs, so they
          // never enter these branches (their existingPath is /legal/...).
          if (existingPath.startsWith('/compliance')) {
            return [existingPath.replace('/compliance', '/legal')];
          }
          if (existingPath.startsWith('/implementation/tracker')) {
            return [existingPath.replace('/implementation/tracker', '/tracker')];
          }
          if (existingPath.startsWith('/reports/insights')) {
            return [existingPath.replace('/reports/insights', '/metrics-insights')];
          }
          if (existingPath.startsWith('/getting-started')) {
            return [existingPath.replace('/getting-started', '/first-steps')];
          }
          return undefined;
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          routeBasePath: '/blog',
          blogTitle: 'Sealmetrics Blog',
          blogDescription:
            'Privacy-first analytics insights — cookieless tracking, GDPR compliance, Google Analytics alternatives, and the consentless analytics playbook for European markets.',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: undefined,
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: null,
          priority: null,
          ignorePatterns: [
            '/tags/**',
            '/blog/tags/**',
            '/blog/page/**',
            '/blog/archive',
            '/blog/authors',
            '/blog/authors/*/authors/**',
            '/guides',
            '/search',
            '/markdown-page',
            '/category/**',
          ],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/sealmetrics-social-card.jpg',

    // 🚀 META TAGS PARA LLMs - Keywords y description
    metadata: [
      {
        name: 'keywords',
        content: 'consentless analytics, GDPR analytics, cookieless tracking, privacy-first analytics, Google Analytics alternative, web analytics without consent, CNIL compliant analytics',
      },
      {
        name: 'description',
        content: 'Complete documentation for Sealmetrics - the consentless analytics platform that captures 100% of your traffic data while staying GDPR compliant. No cookie banners needed.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: 'https://docs.sealmetrics.com/img/sealmetrics-social-card.jpg',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'og:site_name',
        content: 'Sealmetrics Docs',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      {
        name: 'twitter:site',
        content: '@sealmetrics',
      },
    ],

    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },

    navbar: {
      logo: {
        alt: 'Sealmetrics',
        src: 'img/logo.svg',
        width: 191,
        height: 32,
      },
      items: [
        { label: 'Documentation', to: '/intro', position: 'left' },
        { label: 'Changelog', to: '/changelog', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/guides', label: 'Guide', position: 'left' },
        { href: 'https://sealmetrics.com', label: 'Website', position: 'right' },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Consentless Analytics', href: 'https://sealmetrics.com' },
            { label: 'Legal Audit', href: 'https://app.comply.org/attest/sealmetrics' },
            { label: 'Server Status', href: 'https://sealmetrics.instatus.com/' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/sealmetrics' },
            { label: 'LinkedIn', href: 'https://linkedin.com/company/sealmetrics' },
            { label: 'X (Twitter)', href: 'https://x.com/sealmetrics' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Changelog', to: '/changelog' },
            { label: 'Guides', to: '/guides' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Sealmetrics. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

    // -------------------------
    // 🚀 ALGOLIA DOCSEARCH
    // -------------------------
    algolia: {
      appId: 'CGIHF419IR',
      apiKey: '379d9732cb8663ed4de3e2d0d59ce1b0',
      indexName: 'Sealmetrics Docs',
      contextualSearch: true,
      insights: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;