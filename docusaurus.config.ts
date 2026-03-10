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

  // 🚀 META TAGS PARA LLMs - Robots directives
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
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
              url: 'https://docs.sealmetrics.com/img/logo.svg',
            },
            sameAs: [
              'https://www.linkedin.com/company/sealmetrics',
              'https://x.com/sealmetrics',
              'https://github.com/sealmetrics',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://docs.sealmetrics.com/#website',
            url: 'https://docs.sealmetrics.com',
            name: 'Sealmetrics Documentation',
            publisher: { '@id': 'https://sealmetrics.com/#organization' },
            inLanguage: 'en-US',
          },
          {
            '@type': 'SoftwareApplication',
            name: 'Sealmetrics',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Consentless web analytics platform that captures 100% of traffic without cookies or consent banners, fully GDPR compliant.',
            url: 'https://sealmetrics.com',
            offers: {
              '@type': 'Offer',
              price: '199',
              priceCurrency: 'EUR',
              priceValidUntil: '2026-12-31',
            },
            aggregateRating: undefined,
            provider: { '@id': 'https://sealmetrics.com/#organization' },
          },
        ],
      }),
    },
  ],

  scripts: [
    {
      src: 'https://pixel-pre.sealmetrics.com/t.js?id=sealmetrics2&group=docs',
      defer: true,
    },
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
          showLastUpdateTime: false,
        },
        blog: {
          showReadingTime: true,
          routeBasePath: '/blog',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: undefined,
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        // 🚀 SITEMAP optimizado
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
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
      title: '',
      logo: {
        alt: 'Sealmetrics Logo',
        src: 'img/logo.svg',
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
    },
  } satisfies Preset.ThemeConfig,
};

export default config;