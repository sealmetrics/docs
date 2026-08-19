/**
 * Sealmetrics dogfooding — two pixels side by side, same pattern as
 * sealmetrics.com:
 *
 *   - pre  (pixel-pre.sealmetrics.com, id sealmetrics2)  → per-section group
 *   - prod (t.sealmetrics.com,         id sealmetricsv2) → group "docs"
 *
 * Both scripts are loaded with ?auto=0&spa=0, so nothing fires automatically
 * and every pageview below carries its own group — the canonical SPA pattern
 * from /implementation/tracker/spa-support.
 *
 * Each t.js overwrites `window.sealmetrics` when it executes, so the global is
 * only usable for the pixel that loaded last. The instance is therefore
 * captured in the script's own onload handler (which runs synchronously right
 * after that script executes) and calls are dispatched to both instances.
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

function sectionGroup(pathname) {
  for (const [prefix, group] of GROUPS) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return group;
  }
  return 'other';
}

const PIXELS = [
  {
    label: 'pre',
    host: 'https://pixel-pre.sealmetrics.com',
    id: 'sealmetrics2',
    group: sectionGroup,
  },
  {
    label: 'prod',
    host: 'https://t.sealmetrics.com',
    id: 'sealmetricsv2',
    // the whole subdomain is one content group inside the main prod account
    group: () => 'docs',
  },
];

const instances = PIXELS.map(() => null);
const queues = PIXELS.map(() => []);

/** Run `fn(instance, index)` on every pixel, queueing until each has loaded. */
function dispatch(fn) {
  instances.forEach((instance, index) => {
    if (instance) fn(instance, index);
    else queues[index].push(fn);
  });
}

function capture(index) {
  const instance = window.sealmetrics;
  // guard against a script that did not (re)define the global
  if (typeof instance !== 'function' || instances.includes(instance)) return;
  instances[index] = instance;
  const queue = queues[index];
  while (queue.length) queue.shift()(instance, index);
}

let injected = false;

function injectPixels() {
  if (injected) return;
  injected = true;
  PIXELS.forEach((pixel, index) => {
    const script = document.createElement('script');
    script.id = `sealmetrics-pixel-${pixel.label}`;
    script.defer = true;
    script.onload = () => capture(index);
    script.src = `${pixel.host}/t.js?id=${pixel.id}&auto=0&spa=0`;
    document.head.appendChild(script);
  });
}

let scheduled = false;

function ensureLoaded() {
  if (scheduled) return;
  scheduled = true;
  if (document.readyState === 'complete') injectPixels();
  else window.addEventListener('load', injectPixels, {once: true});
}

function firePageview(pathname) {
  dispatch((instance, index) => instance({group: PIXELS[index].group(pathname)}));
  ensureLoaded();
}

export function onRouteDidUpdate({location, previousLocation}) {
  if (typeof document === 'undefined') return;
  // fires on initial load (previousLocation === null) and on every SPA route
  // change; skip same-path hash/anchor navigation
  if (previousLocation && previousLocation.pathname === location.pathname) return;
  firePageview(location.pathname);
}
