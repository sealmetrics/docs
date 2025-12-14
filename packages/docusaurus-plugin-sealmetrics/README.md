# docusaurus-plugin-sealmetrics

Official [SealMetrics](https://sealmetrics.com) analytics plugin for [Docusaurus](https://docusaurus.io/).

Privacy-first, cookieless analytics with full SPA (Single Page Application) support. No cookie banners required.

## Features

- **Privacy First** - No cookies, no consent banners needed
- **SPA Support** - Automatic tracking on route changes
- **Content Grouping** - Categorize pages by URL patterns
- **TypeScript Support** - Full type definitions included
- **Lightweight** - Minimal bundle impact
- **Docusaurus 2 & 3** - Compatible with both versions

## Installation

```bash
npm install docusaurus-plugin-sealmetrics
# or
yarn add docusaurus-plugin-sealmetrics
```

## Quick Start

Add the plugin to your `docusaurus.config.js`:

```js
module.exports = {
  plugins: [
    [
      'docusaurus-plugin-sealmetrics',
      {
        accountId: 'YOUR_ACCOUNT_ID',
      },
    ],
  ],
};
```

That's it! The plugin will automatically track pageviews across your site.

## Configuration

### Basic Configuration

```js
{
  plugins: [
    [
      'docusaurus-plugin-sealmetrics',
      {
        // Required: Your SealMetrics Account ID
        accountId: 'YOUR_ACCOUNT_ID',

        // Optional: Enable tracking in development
        enableInDevelopment: false,

        // Optional: Enable debug logging
        debug: false,
      },
    ],
  ],
}
```

### Content Grouping

Categorize your pages for better analytics segmentation:

```js
{
  plugins: [
    [
      'docusaurus-plugin-sealmetrics',
      {
        accountId: 'YOUR_ACCOUNT_ID',
        contentGroupingRules: [
          { pattern: '/blog', group: 'Blog' },
          { pattern: '/docs/api', group: 'API Reference' },
          { pattern: '/docs/guides', group: 'Guides' },
          { pattern: '/docs', group: 'Documentation' },
        ],
      },
    ],
  ],
}
```

Rules are evaluated in order—first match wins.

### All Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `accountId` | `string` | **required** | Your SealMetrics Account ID |
| `enableInDevelopment` | `boolean` | `false` | Enable tracking in dev mode |
| `useSession` | `boolean` | `true` | Enable session tracking |
| `contentGrouping` | `string` | `null` | Static content group for all pages |
| `contentGroupingRules` | `array` | `null` | Dynamic content grouping rules |
| `debug` | `boolean` | `false` | Log tracking events to console |
| `trackPageViews` | `boolean` | `true` | Auto-track pageviews |
| `respectDoNotTrack` | `boolean` | `false` | Honor browser DNT setting |

## Custom Event Tracking

Track custom events using the global `sealmetricsTrack` function:

```js
// Track a button click
window.sealmetricsTrack('button_click', {
  label: 'signup_cta',
  location: 'header',
});

// Track a conversion
window.sealmetricsTrack('conversion', {
  amount: 99.99,
  currency: 'USD',
  label: 'premium_signup',
});

// Track a microconversion
window.sealmetricsTrack('newsletter_signup', {
  source: 'blog_sidebar',
});
```

### React Component Example

```jsx
import React from 'react';

function SignupButton() {
  const handleClick = () => {
    // Track the click event
    if (typeof window !== 'undefined' && window.sealmetricsTrack) {
      window.sealmetricsTrack('signup_click', {
        location: 'hero_section',
      });
    }
    // Proceed with signup logic
  };

  return (
    <button onClick={handleClick}>
      Get Started
    </button>
  );
}
```

## TypeScript Support

The plugin includes full TypeScript definitions. For custom event tracking:

```typescript
// Type-safe event tracking
declare global {
  interface Window {
    sealmetricsTrack: (
      eventName: string,
      eventData?: Record<string, unknown>
    ) => void;
  }
}

// Usage
window.sealmetricsTrack('custom_event', { key: 'value' });
```

## How It Works

1. **Script Injection** - The plugin injects the SealMetrics tracker script into your site's `<head>`
2. **Initial Pageview** - Tracks the first pageview when the page loads
3. **SPA Navigation** - Listens for History API changes and tracks subsequent pageviews
4. **Content Grouping** - Automatically categorizes pages based on your rules

## Default Content Grouping

If no rules are specified, the plugin uses these defaults:

| URL Pattern | Content Group |
|-------------|---------------|
| `/blog/*` | Blog |
| `/docs/*` | Docs |
| `/` | Home |
| Everything else | Docs |

## Finding Your Account ID

1. Log in to your [SealMetrics dashboard](https://app.sealmetrics.com)
2. Click on your profile icon (top-right)
3. Select "Tags & Connectors"
4. Copy your Account ID

## Troubleshooting

### Events not appearing in dashboard

1. Verify your Account ID is correct
2. Enable `debug: true` and check browser console
3. Ensure you're testing on a production build (or enable `enableInDevelopment`)
4. Check for JavaScript errors in browser console

### Duplicate pageviews

The plugin prevents duplicate tracking for the same URL. If you see duplicates:
1. Check if you have multiple tracking scripts installed
2. Verify the plugin is only listed once in your config

### Content grouping not working

1. Rules are evaluated in order—more specific patterns should come first
2. Enable `debug: true` to see which group is assigned
3. Verify your patterns match the actual URL paths

## Support

- **Documentation**: [docs.sealmetrics.com](https://docs.sealmetrics.com/plugins-and-modules/docusaurus)
- **Email**: support@sealmetrics.com
- **GitHub Issues**: [Report a bug](https://github.com/sealmetrics/docusaurus-plugin-sealmetrics/issues)

## License

MIT
