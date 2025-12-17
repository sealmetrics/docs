/**
 * Sealmetrics Client Module for Docusaurus
 *
 * Handles SPA route changes and automatic pageview tracking.
 * Works with Docusaurus 2.x and 3.x.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only run on client-side
if (ExecutionEnvironment.canUseDOM) {
  const config = window.__SEALMETRICS_CONFIG__ || {};
  let smInstance = null;
  let isInitialized = false;
  let lastTrackedPath = null;

  /**
   * Log debug messages if debug mode is enabled
   */
  function debugLog(...args) {
    if (config.debug) {
      console.log('[Sealmetrics]', ...args);
    }
  }

  /**
   * Determine content grouping based on URL path
   */
  function getContentGrouping(pathname) {
    // If static content grouping is set, use it
    if (config.contentGrouping) {
      return config.contentGrouping;
    }

    // If rules are provided, evaluate them
    if (config.contentGroupingRules && Array.isArray(config.contentGroupingRules)) {
      for (const rule of config.contentGroupingRules) {
        if (rule.pattern && rule.group) {
          // Support both string prefix and regex patterns
          if (typeof rule.pattern === 'string') {
            if (pathname.startsWith(rule.pattern)) {
              return rule.group;
            }
          } else if (rule.pattern instanceof RegExp || rule.regex) {
            const regex = rule.regex ? new RegExp(rule.regex) : rule.pattern;
            if (regex.test(pathname)) {
              return rule.group;
            }
          }
        }
      }
    }

    // Default rules for common Docusaurus paths
    if (pathname.startsWith('/blog')) {
      return 'Blog';
    }
    if (pathname.startsWith('/docs')) {
      return 'Docs';
    }
    if (pathname === '/' || pathname === '') {
      return 'Home';
    }

    return 'Docs'; // Default fallback
  }

  /**
   * Check if Do Not Track is enabled and should be respected
   */
  function shouldRespectDoNotTrack() {
    if (!config.respectDoNotTrack) {
      return false;
    }

    const dnt =
      navigator.doNotTrack ||
      window.doNotTrack ||
      navigator.msDoNotTrack;

    return dnt === '1' || dnt === 'yes';
  }

  /**
   * Initialize Sealmetrics tracker
   */
  function initTracker() {
    if (isInitialized || !window.sm) {
      return;
    }

    if (shouldRespectDoNotTrack()) {
      debugLog('Do Not Track enabled, skipping initialization');
      return;
    }

    const options = {
      account: config.accountId,
      use_session: config.useSession ? 1 : 0,
      id: Math.floor(Math.random() * 999) + 1,
    };

    try {
      smInstance = new window.sm(options);
      isInitialized = true;
      debugLog('Tracker initialized with options:', options);
    } catch (error) {
      console.error('[Sealmetrics] Failed to initialize tracker:', error);
    }
  }

  /**
   * Track a pageview event
   */
  function trackPageView(pathname) {
    // Skip if same path (prevents duplicate tracking)
    if (pathname === lastTrackedPath) {
      debugLog('Skipping duplicate pageview for:', pathname);
      return;
    }

    // Skip if tracking is disabled
    if (!config.trackPageViews) {
      debugLog('Pageview tracking disabled');
      return;
    }

    // Wait for tracker script to load
    if (!window.sm) {
      debugLog('Waiting for Sealmetrics script to load...');
      setTimeout(() => trackPageView(pathname), 100);
      return;
    }

    // Initialize tracker if not already done
    if (!isInitialized) {
      initTracker();
    }

    if (!smInstance) {
      debugLog('Tracker not available');
      return;
    }

    const contentGrouping = getContentGrouping(pathname);

    try {
      // Update content grouping for this pageview
      smInstance.options.content_grouping = contentGrouping;

      // Track the pageview
      smInstance.track('pageview');

      lastTrackedPath = pathname;
      debugLog('Tracked pageview:', { pathname, contentGrouping });
    } catch (error) {
      console.error('[Sealmetrics] Failed to track pageview:', error);
    }
  }

  /**
   * Track custom events
   * Exposed globally as window.sealmetricsTrack()
   */
  function trackEvent(eventName, eventData = {}) {
    if (!smInstance) {
      console.warn('[Sealmetrics] Tracker not initialized. Call after page load.');
      return;
    }

    try {
      // Merge event data with instance options
      const trackOptions = {
        ...smInstance.options,
        ...eventData,
        event: eventName,
      };

      smInstance.track(eventName, trackOptions);
      debugLog('Tracked event:', eventName, eventData);
    } catch (error) {
      console.error('[Sealmetrics] Failed to track event:', error);
    }
  }

  // Expose tracking function globally
  window.sealmetricsTrack = trackEvent;

  // Track initial pageview when script loads
  if (document.readyState === 'complete') {
    trackPageView(window.location.pathname);
  } else {
    window.addEventListener('load', () => {
      trackPageView(window.location.pathname);
    });
  }

  // Listen for Docusaurus route changes (SPA navigation)
  // Docusaurus uses History API for navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    // Small delay to ensure React has updated
    setTimeout(() => {
      trackPageView(window.location.pathname);
    }, 0);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(() => {
      trackPageView(window.location.pathname);
    }, 0);
  };

  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      trackPageView(window.location.pathname);
    }, 0);
  });

  debugLog('Sealmetrics client module loaded');
}

export default {};
