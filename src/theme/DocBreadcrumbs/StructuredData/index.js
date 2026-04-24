import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBreadcrumbsStructuredData} from '@docusaurus/plugin-content-docs/client';

export default function DocBreadcrumbsStructuredData(props) {
  const data = useBreadcrumbsStructuredData({breadcrumbs: props.breadcrumbs});
  const {siteConfig} = useDocusaurusContext();
  const siteUrl = siteConfig.url;

  const homeItem = {
    '@type': 'ListItem',
    position: 1,
    name: 'Home',
    item: `${siteUrl}/`,
  };

  const existing = (data.itemListElement || []).map((it, i) => ({
    ...it,
    position: i + 2,
  }));

  // Drop empty schemas (when breadcrumbs has only the leaf and we'd emit Home alone)
  if (existing.length === 0) {
    return null;
  }

  const enriched = {
    ...data,
    itemListElement: [homeItem, ...existing],
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(enriched)}</script>
    </Head>
  );
}
