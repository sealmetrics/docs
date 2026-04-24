import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBlogPostStructuredData} from '@docusaurus/plugin-content-blog/client';

const ABS = /^https?:\/\//i;

function absolutize(url, siteUrl) {
  if (!url) return url;
  if (ABS.test(url)) return url;
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function BlogPostStructuredData() {
  const data = useBlogPostStructuredData();
  const {siteConfig} = useDocusaurusContext();
  const siteUrl = siteConfig.url;

  // Default image when the post does not declare its own
  const defaultImageUrl = `${siteUrl}/img/sealmetrics-social-card.jpg`;

  // Absolutize author images
  let author = data.author;
  if (Array.isArray(author)) {
    author = author.map((a) =>
      a && a.image ? {...a, image: absolutize(a.image, siteUrl)} : a,
    );
  } else if (author && author.image) {
    author = {...author, image: absolutize(author.image, siteUrl)};
  }

  // Ensure image is present and absolute
  let image = data.image;
  if (!image) {
    image = {
      '@type': 'ImageObject',
      '@id': defaultImageUrl,
      url: defaultImageUrl,
      contentUrl: defaultImageUrl,
      caption: data.headline,
    };
  } else if (typeof image === 'object' && image.url && !ABS.test(image.url)) {
    const abs = absolutize(image.url, siteUrl);
    image = {...image, url: abs, contentUrl: abs, '@id': abs};
  }

  const enriched = {
    ...data,
    author,
    image,
    publisher: {
      '@type': 'Organization',
      '@id': 'https://sealmetrics.com/#organization',
      name: 'Sealmetrics',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/logo.png`,
      },
    },
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(enriched)}</script>
    </Head>
  );
}
