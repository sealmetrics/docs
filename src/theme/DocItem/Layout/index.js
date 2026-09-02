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

// Antes esto era una allow-list de ocho prefijos, y se quedó corta: dejaba
// 93 páginas de documentación sin ningún schema de artículo — entre ellas las
// 26 de /compliance, que son justo las que leen los DPO en las revisiones de
// proveedor. Una allow-list hay que acordarse de ampliarla cada vez que nace
// una sección, y nadie se acordó.
//
// Ahora se emite para toda la documentación. Este componente solo envuelve
// DocItem, así que "toda la documentación" es exactamente eso: el blog tiene
// su propio BlogPosting (con Person) por el plugin de blog, y las páginas de
// /tags las genera Docusaurus como listados navegables y nunca pasan por aquí.
function shouldEmitTechArticle(permalink) {
  return Boolean(permalink);
}

function TechArticleStructuredData() {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();
  if (!metadata?.permalink || !shouldEmitTechArticle(metadata.permalink)) {
    return null;
  }
  const url = `${siteConfig.url}${metadata.permalink}`;
  const imageUrl = `${siteConfig.url}${
    frontMatter.image || '/img/sealmetrics-social-card.jpg'
  }`;
  const dateModified = metadata.lastUpdatedAt
    ? new Date(metadata.lastUpdatedAt).toISOString()
    : undefined;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': url,
    mainEntityOfPage: url,
    url,
    headline: metadata.title,
    name: metadata.title,
    description: metadata.description,
    inLanguage: 'en-US',
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      contentUrl: imageUrl,
    },
    // Inline, no una referencia `{@id}` pelada: la referencia es JSON-LD
    // válido y Google la resuelve contra el nodo Organization del @graph,
    // pero obliga a cualquier consumidor a cruzar dos <script> distintos
    // para saber quién firma. `publisher` ya se declara así unas líneas
    // más abajo; esto solo lo hace consistente.
    author: {
      '@type': 'Organization',
      '@id': 'https://sealmetrics.com/#organization',
      name: 'Sealmetrics',
      url: 'https://sealmetrics.com',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://sealmetrics.com/#organization',
      name: 'Sealmetrics',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/img/logo.png`,
      },
    },
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
        <TechArticleStructuredData />
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
