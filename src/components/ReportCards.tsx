import React from 'react';
import Link from '@docusaurus/Link';
import styles from './ReportCards.module.css';

type Card = {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
};

const cards: Card[] = [
  {
    title: 'Sealmetrics Dashboard',
    description:
      'Overview of visits, page views, conversions, and micro-conversions — your central analytics hub.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 13h2v-2H3v2zm4 0h2v-6H7v6zm4 0h2V5h-2v8zm4 0h2V9h-2v4zm4 0h2V3h-2v10z" />
      </svg>
    ),
    link: '/reports/overview',
  },
  {
    title: 'Traffic Source Analysis',
    description:
      'Analyze acquisition channels, sources, campaigns, and referrers — with conversions and revenue per row.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 13h18v-2H3v2zm0 6h12v-2H3v2zm0-12h18V5H3v2z" />
      </svg>
    ),
    link: '/reports/sources',
  },
  {
    title: 'Evolution Report',
    description:
      'Track entrances, conversions, and revenue over time and spot trends across periods.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 17h2v-2H3v2zm4 0h2v-6H7v6zm4 0h2V9h-2v8zm4 0h2V5h-2v12zm4 0h2v-9h-2v9z" />
      </svg>
    ),
    link: '/reports/evolution',
  },
  {
    title: 'Sales Funnel Report',
    description:
      'Visualize user behavior through funnel stages — from micro-conversions to completed sales.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 3h20l-8 9v5l-4 4v-9L2 3z" />
      </svg>
    ),
    link: '/reports/funnel',
  },
  {
    title: 'Definitions',
    description:
      'Learn the meaning of all key Sealmetrics metrics — entrances, conversions, revenue, and advanced KPIs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h10v2H4v-2z" />
      </svg>
    ),
    link: '/reports/definitions',
  },
];

const ReportCards: React.FC = () => (
  <div className={styles.grid}>
    {cards.map((card) => (
      <Link key={card.title} to={card.link} className={styles.card}>
        <div className={styles.cardHeader}>
          {card.icon}
          <h3 className={styles.cardTitle}>{card.title}</h3>
        </div>
        <p className={styles.cardDescription}>{card.description}</p>
      </Link>
    ))}
  </div>
);

export default ReportCards;
