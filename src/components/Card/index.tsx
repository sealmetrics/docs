import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type CardProps = {
  /** Card title (rendered as a heading) */
  title: string;
  /** Internal route or external URL; the whole card becomes clickable */
  to?: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Card body — plain text or MDX children */
  children?: React.ReactNode;
};

/**
 * Reusable docs card, matching the site's card aesthetic
 * (see ReportCards / homepage cards). Use inside <CardGrid>.
 *
 *   <CardGrid>
 *     <Card title="Quick Start" to="/getting-started/quick-start">
 *       Step-by-step setup guide.
 *     </Card>
 *   </CardGrid>
 */
export function Card({ title, to, icon, children }: CardProps): React.ReactElement {
  const header = (
    <div className={styles.cardHeader}>
      {icon != null && <span className={styles.cardIcon}>{icon}</span>}
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
  );

  const body = (
    <>
      {header}
      {children != null && <div className={styles.cardBody}>{children}</div>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={styles.card}>
        {body}
      </Link>
    );
  }
  return <div className={styles.card}>{body}</div>;
}

type CardGridProps = {
  children: React.ReactNode;
};

/** Responsive grid wrapper for <Card> items. */
export function CardGrid({ children }: CardGridProps): React.ReactElement {
  return <div className={styles.grid}>{children}</div>;
}

export default Card;
