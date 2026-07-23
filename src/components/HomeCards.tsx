import React from 'react';
import Link from '@docusaurus/Link';
import styles from './HomeCards.module.css';

type PersonaCard = {
  audience: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  cta: string;
  secondary?: {
    prefix: string;
    label: string;
    link: string;
  };
};

const cards: PersonaCard[] = [
  {
    audience: 'Marketers & site owners',
    title: 'Install the pixel',
    description:
      'Add the tracker to your site and verify your first event in under 5 minutes — no cookies, no consent banner.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2L3 14h7v8l10-12h-7l0-8z" />
      </svg>
    ),
    link: '/getting-started/quick-start',
    cta: 'Quick start →',
    secondary: {
      prefix: 'Or let your AI assistant do it:',
      label: 'Install with AI',
      link: '/getting-started/install-with-ai',
    },
  },
  {
    audience: 'Developers',
    title: 'Explore the API',
    description:
      'Generate a token, find your Site ID, and pull traffic data via REST — your first API call in three steps.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    ),
    link: '/api/quick-start',
    cta: 'API quick start →',
  },
  {
    audience: 'Legal & privacy teams',
    title: 'Compliance for your DPO',
    description:
      'Regulator-by-regulator self-assessments — GDPR, ePrivacy, CNIL, UK PECR — plus subprocessors and data subject rights.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1l8 4v6c0 5.25-3.5 10.74-8 12-4.5-1.26-8-6.75-8-12V5l8-4z" />
      </svg>
    ),
    link: '/compliance',
    cta: 'Compliance hub →',
  },
];

const HomeCards: React.FC = () => (
  <div className={styles.grid}>
    {cards.map((card) => (
      <div key={card.title} className={styles.card}>
        <span className={styles.iconChip}>{card.icon}</span>
        <p className={styles.audience}>{card.audience}</p>
        <h3 className={styles.cardTitle}>
          <Link to={card.link}>{card.title}</Link>
        </h3>
        <p className={styles.cardDescription}>{card.description}</p>
        <div className={styles.cardActions}>
          <Link to={card.link} className={styles.cta}>
            {card.cta}
          </Link>
          {card.secondary && (
            <span className={styles.secondary}>
              {card.secondary.prefix}{' '}
              <Link to={card.secondary.link}>{card.secondary.label}</Link>
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default HomeCards;
