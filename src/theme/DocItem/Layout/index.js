import React from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import DocFeedback from '@site/src/components/DocFeedback';
import styles from './styles.module.css';

// Which schema.org type each section emits. TechArticle for anything a
// developer or operator follows step by step; Article for the explanatory and
// legal material (compliance self-assessments, guides, use cases, FAQ) where
// "technical" would be a stretch. Sections not listed (root intro, changelog,
// home) emit nothing here — the home page carries SoftwareApplication itself.
const ARTICLE_TYPE_BY_PREFIX = [
  ['/api/', 'TechArticle'],
  ['/implementation/', 'TechArticle'],
  ['/getting-started/', 'TechArticle'],
  ['/reports/', 'TechArticle'],
  ['/integrations/', 'TechArticle'],
  ['/platform/', 'TechArticle'],
  ['/security-privacy/', 'TechArticle'],
  ['/lens/', 'TechArticle'],
  ['/troubleshooting/', 'TechArticle'],
  ['/billing/', 'TechArticle'],
  ['/web-analytics-prompts/', 'TechArticle'],
  ['/ga4-migration', 'TechArticle'],
  ['/compliance/', 'Article'],
  ['/guides/', 'Article'],
  ['/use-cases/', 'Article'],
  ['/faq/', 'Article'],
  ['/compare/', 'Article'],
];

const ORGANIZATION_ID = 'https://sealmetrics.com/#organization';
const SOFTWARE_ID = 'https://sealmetrics.com/#software';
const WEBSITE_ID = 'https://docs.sealmetrics.com/#website';

function articleTypeFor(permalink) {
  const hit = ARTICLE_TYPE_BY_PREFIX.find(([p]) => permalink.startsWith(p));
  return hit ? hit[1] : null;
}

// Frontmatter `date` (blog-style) or `last_update.date` are the only
// publication dates we trust. Never derive datePublished from git: the first
// commit of a file is a migration artefact for most of this site.
function toIsoDate(value) {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function ArticleStructuredData() {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();
  const type = metadata?.permalink ? articleTypeFor(metadata.permalink) : null;
  if (!type) {
    return null;
  }
  const url = `${siteConfig.url}${metadata.permalink}`;
  const imageUrl = `${siteConfig.url}${
    frontMatter.image || '/img/sealmetrics-social-card.jpg'
  }`;
  const dateModified = metadata.lastUpdatedAt
    ? toIsoDate(metadata.lastUpdatedAt)
    : undefined;
  const datePublished = toIsoDate(frontMatter.date);
  const data = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': url,
    mainEntityOfPage: url,
    url,
    headline: metadata.title,
    name: metadata.title,
    description: metadata.description,
    inLanguage: 'en-US',
    isPartOf: {'@id': WEBSITE_ID},
    about: {'@id': SOFTWARE_ID},
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      contentUrl: imageUrl,
    },
    author: {'@id': ORGANIZATION_ID},
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Sealmetrics',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/img/logo.png`,
      },
    },
    ...(datePublished ? {datePublished} : {}),
    ...(dateModified ? {dateModified} : {}),
    ...(frontMatter.keywords ? {keywords: frontMatter.keywords} : {}),
  };
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  );
}

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return {hidden, mobile, desktop};
}

export default function DocItemLayout({children}) {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  return (
    <div className="row">
      <div className={clsx('col', 'docMainCol', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <ArticleStructuredData />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
            <DocFeedback />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
