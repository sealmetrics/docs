/**
 * Sealmetrics dogfooding: manual pageviews with a content group per docs
 * section. The tracker script is loaded with ?auto=0&spa=0 (see
 * docusaurus.config.ts), so nothing fires automatically and every pageview
 * below carries the right group — the canonical SPA pattern from
 * /implementation/tracker/spa-support.
 */

const GROUPS = [
  ['/api', 'api'],
  ['/lens', 'lens'],
  ['/reports', 'reports'],
  ['/implementation', 'implementation'],
  ['/integrations', 'integrations'],
  ['/compliance', 'compliance'],
  ['/security-privacy', 'security-privacy'],
  ['/billing', 'billing'],
  ['/platform', 'platform'],
  ['/getting-started', 'getting-started'],
  ['/guides', 'guides'],
  ['/troubleshooting', 'troubleshooting'],
  ['/use-cases', 'use-cases'],
  ['/web-analytics-prompts', 'prompts'],
  ['/faq', 'faq'],
  ['/blog', 'blog'],
  ['/changelog', 'changelog'],
];

function groupFor(pathname) {
  for (const [prefix, group] of GROUPS) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return group;
  }
  return 'other';
}

function firePageview(pathname, attempt = 0) {
  if (typeof window === 'undefined') return;
  if (typeof window.sealmetrics === 'function') {
    window.sealmetrics({ group: groupFor(pathname) });
  } else if (attempt < 20) {
    // tracker script is deferred; retry briefly until it's available
    setTimeout(() => firePageview(pathname, attempt + 1), 250);
  }
}

export function onRouteDidUpdate({ location, previousLocation }) {
  // fires on initial load (previousLocation === null) and on every SPA route
  // change; skip same-path hash/anchor navigation
  if (previousLocation && previousLocation.pathname === location.pathname) return;
  firePageview(location.pathname);
}
