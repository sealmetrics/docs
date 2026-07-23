import React, {useCallback, useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * "Was this page helpful?" — dogfooding: votes are sent as Sealmetrics
 * microconversions (docs_feedback) through the site's own pixel. No PII:
 * payload is the page path and the vote only.
 */
export default function DocFeedback() {
  const {pathname} = useLocation();
  const [voted, setVoted] = useState(false);

  // one vote per page per session
  useEffect(() => {
    try {
      setVoted(sessionStorage.getItem(`smfb:${pathname}`) === '1');
    } catch {
      setVoted(false);
    }
  }, [pathname]);

  const vote = useCallback(
    (value) => {
      if (typeof window !== 'undefined' && typeof window.sealmetrics === 'function') {
        window.sealmetrics.micro('docs_feedback', {page: pathname, vote: value});
      }
      try {
        sessionStorage.setItem(`smfb:${pathname}`, '1');
      } catch {
        /* private mode: still show thanks */
      }
      setVoted(true);
    },
    [pathname],
  );

  if (voted) {
    return (
      <div className={styles.feedback} role="status">
        Thanks for the feedback!
      </div>
    );
  }

  return (
    <div className={styles.feedback}>
      <span className={styles.question}>Was this page helpful?</span>
      <button type="button" className={styles.button} onClick={() => vote('up')}>
        👍 Yes
      </button>
      <button type="button" className={styles.button} onClick={() => vote('down')}>
        👎 No
      </button>
    </div>
  );
}
