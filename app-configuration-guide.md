# Phase 8 — App Configuration Guide (Judge.me, Track123, Shopify Inbox)

None of these three apps expose their settings through the Shopify Admin API — Judge.me
and Track123 are third-party apps with their own dashboards, and Shopify Inbox's chat
settings live under Sales Channels, not a generic API I have access to. So unlike
products/collections/pages/menus, **I can't configure these directly** — this is a
step-by-step guide for you (or whoever has admin access) to follow. Steps verified via
current help-center documentation as of August 2026.

## ✅ Already done for you
- Added **"Track Your Order"** to the footer menu, linking to Track123's default tracking
  page URL (`/apps/track123`) — this will work as soon as Track123 creates that page
  (it does automatically on install).

## Judge.me (reviews)

**1. Turn on the widgets on your theme** (Dawn is an Online Store 2.0 theme, so this uses app blocks):
- Shopify admin → Online Store → Themes → find the `feature/theme-setup` theme (once connected) → **Customize**
- Left sidebar → **App embeds** icon → enable **Judge.me Core Snippet** → Save
- Back in Sections, switch the template dropdown to **Products → Default product**
- **Add block → Apps → Star Ratings (Preview Badge)** — shows near the product title
- **Add section → Apps → Review Widget** — shows the full reviews list further down the page
- Save

**2. Turn on review request emails**
- Judge.me admin (via Shopify admin → Apps → Judge.me) → **Settings → Request scheduling**
- Reviews are requested automatically once an order is marked *Fulfilled* by default —
  confirm the wait time (e.g. 14 days after fulfillment) under **Request Timing** for
  Domestic/International orders
- Given the compliance sensitivity of this niche, keep review request emails
  **not** framed as marketing — Judge.me treats them as transactional by default, which
  is the safer setting; leave "Sending based on Shopify marketing consent" as-is unless
  you want to restrict further

**3. Star-rating rich snippets in search results**
- This is automatic once the widgets above are active — Judge.me injects its own
  structured data. No extra action needed.

## Track123 (order tracking)

**1. Confirm the tracking page**
- Track123 admin (Shopify admin → Apps → Track123) → **Tracking Page** → confirm the
  page is enabled and styled to match brand (teal/cream/terracotta, same as the rest
  of the site)

**2. Route Shopify's shipping emails to your branded tracking page**
- Track123 admin → **Settings** → enable **Update Shopify's native tracking links**
- Also enable **Send shipping tracking events to Shopify**, so Shopify's own
  Shipping Update / Out for Delivery / Delivered emails fire automatically
- One manual step Track123 can't automate: Shopify admin → Settings → Notifications →
  **Shipping confirmation** email → Edit code → the *first* shipping confirmation email
  for an order needs its tracking link updated manually (a few seconds' delay before
  Track123's link swap takes effect) — Track123's help doc has the exact code snippet
  to search-and-replace

## Shopify Inbox (live chat)

**1. Enable the sales channel**
- Shopify admin → Settings → Apps and sales channels → confirm **Inbox** is added
  as a channel (it's in your app list already per the brief)

**2. Turn on the storefront widget**
- Shopify admin → Sales channels → **Inbox** → Chat settings
- Set **Staff hours** (so customers see accurate availability — important for an
  older audience who may expect a real person, not assume 24/7 AI)
- Decide whether to use Inbox's AI assistant to answer FAQs automatically, or route
  everything to a human — given the brand's "reassuring, not hype-driven" tone and
  the compliance sensitivity of health-adjacent questions, I'd lean toward **AI handles
  logistics questions only** (shipping, returns, sizing) and **routes anything about
  symptoms/conditions to a human** — that's a setting inside Inbox's agent rules

**3. Verify it's live**
- Visit the storefront in an incognito window once the theme is connected and check
  the chat bubble appears (bottom-right by default)

## Once all three are done
Come back and I'll help with the QA pass (Phase 9) — I can check that the tracking
link, review widgets, and chat bubble all render correctly once the theme is connected.
