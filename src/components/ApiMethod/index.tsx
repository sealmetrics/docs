import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type ApiMethodName = 'get' | 'post' | 'put' | 'patch' | 'delete';

type Props = {
  /** HTTP method (case-insensitive): get | post | put | patch | delete */
  method: ApiMethodName | Uppercase<ApiMethodName> | string;
  /** Endpoint path, e.g. "/stats/overview" */
  path: string;
};

/**
 * HTTP method badge + monospace endpoint path.
 *
 * Usage in MDX:
 *   <ApiMethod method="get" path="/stats/overview" />
 *
 * Colors are theme tokens defined in styles.module.css
 * (light values on :root scope, dark overrides on [data-theme='dark']).
 */
export default function ApiMethod({ method, path }: Props): React.ReactElement {
  const normalized = method.toLowerCase();
  const badgeClass =
    styles[normalized as ApiMethodName] ?? styles.get; // unknown methods fall back to GET styling

  return (
    <span className={styles.apiMethod}>
      <span className={clsx(styles.badge, badgeClass)}>
        {normalized.toUpperCase()}
      </span>
      <code className={styles.path}>{path}</code>
    </span>
  );
}
