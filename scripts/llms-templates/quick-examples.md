## Quick Implementation Examples

### Basic Installation (HTML)
```html
<script src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID" defer></script>
```

### Installation with Content Grouping
```html
<!-- Blog pages -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID&group=blog" defer></script>

<!-- Product pages -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID&group=product" defer></script>

<!-- Checkout flow -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID&group=checkout" defer></script>
```

### Verify Installation
```javascript
// In browser console
typeof sealmetrics === 'function' // Should return true
```

---

## Conversion Tracking

### Basic Conversion
```javascript
sealmetrics.conv('purchase', 99.99);
```

### Conversion with Properties
```javascript
sealmetrics.conv('purchase', 149.99, {
  order_id: 'ORD-2025-001234',
  currency: 'EUR',
  payment_method: 'credit_card',
  coupon: 'SAVE10'
});
```

### Lead (No Monetary Value)
```javascript
sealmetrics.conv('lead', 0, {
  form_name: 'contact_form',
  source: 'homepage'
});
```

### SaaS Signup
```javascript
sealmetrics.conv('signup', 0, {
  plan: 'trial',
  referral_code: 'FRIEND20'
});
```

### E-commerce Thank You Page
```html
<script src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID&group=checkout" defer></script>
<script>
  window.addEventListener('load', function() {
    sealmetrics.conv('purchase', 189.99, {
      order_id: 'ORD-2025-001234',
      currency: 'EUR',
      items_count: '3',
      payment_method: 'credit_card'
    });
  });
</script>
```

### Deduplication (Prevent Double Tracking)
```javascript
var orderId = 'ORD-2025-001234';
if (!localStorage.getItem('tracked_' + orderId)) {
  sealmetrics.conv('purchase', 99.99, { order_id: orderId });
  localStorage.setItem('tracked_' + orderId, 'true');
}
```

---

## Microconversion Tracking

### Add to Cart
```javascript
sealmetrics.micro('add_to_cart', {
  product_id: 'SKU-456',
  product_name: 'Wireless Headphones',
  price: '89.99',
  category: 'electronics'
});
```

### Checkout Funnel Steps
```javascript
// Step 1: View cart
sealmetrics.micro('view_cart', { items_count: '3', cart_value: '249.99' });

// Step 2: Begin checkout
sealmetrics.micro('begin_checkout', { items_count: '3' });

// Step 3: Add shipping info
sealmetrics.micro('add_shipping_info', { shipping_method: 'express' });

// Step 4: Add payment info
sealmetrics.micro('add_payment_info', { payment_method: 'credit_card' });

// Step 5: Purchase (use conversion, not microconversion)
sealmetrics.conv('purchase', 249.99, { order_id: 'ORD-123' });
```

### Video Engagement
```javascript
var video = document.querySelector('video');

video.addEventListener('play', function() {
  sealmetrics.micro('video_play', { video_id: 'product-demo' });
});

video.addEventListener('ended', function() {
  sealmetrics.micro('video_complete', { video_id: 'product-demo' });
});
```

### Scroll Depth
```javascript
var tracked = {};
window.addEventListener('scroll', function() {
  var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  [25, 50, 75, 100].forEach(function(milestone) {
    if (scrollPercent >= milestone && !tracked[milestone]) {
      tracked[milestone] = true;
      sealmetrics.micro('scroll_' + milestone);
    }
  });
});
```

---

## Framework Integration

### Next.js (App Router)
```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### React with NPM Package
```tsx
import { SealMetricsProvider, useSealMetrics } from '@sealmetrics/react';

// Wrap app
function App() {
  return (
    <SealMetricsProvider accountId="YOUR_ACCOUNT_ID">
      <YourApp />
    </SealMetricsProvider>
  );
}

// Track in components
function ProductPage({ product }) {
  const { micro, conv } = useSealMetrics();

  const handleAddToCart = () => {
    micro('add_to_cart', { product_id: product.id });
  };

  const handlePurchase = () => {
    conv('purchase', product.price, { currency: 'EUR' });
  };
}
```

### Nuxt 3
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        { src: 'https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID', defer: true }
      ]
    }
  }
});
```

### Google Tag Manager
1. Create Custom HTML tag
2. Paste:
```html
<script src="https://t.sealmetrics.com/t.js?id=YOUR_ACCOUNT_ID" defer></script>
```
3. Set trigger to "All Pages"
4. Publish

---

## API Examples

### cURL - Get Overview Stats
```bash
curl -X GET "https://my.sealmetrics.com/api/v1/stats/overview?account_id=YOUR_ACCOUNT_ID&period=7d" \
  -H "X-API-Key: sm_your_api_key_here"
```

### Python
```python
import requests

API_KEY = "sm_your_api_key_here"
ACCOUNT_ID = "your-account-id"

response = requests.get(
    "https://my.sealmetrics.com/api/v1/stats/overview",
    headers={"X-API-Key": API_KEY},
    params={"account_id": ACCOUNT_ID, "period": "7d"}
)
print(response.json())
```

### JavaScript/Node.js
```javascript
const API_KEY = 'sm_your_api_key_here';
const ACCOUNT_ID = 'your-account-id';

const params = new URLSearchParams({ account_id: ACCOUNT_ID, period: '7d' });
const response = await fetch(
  `https://my.sealmetrics.com/api/v1/stats/overview?${params}`,
  { headers: { 'X-API-Key': API_KEY } }
);
const data = await response.json();
```
