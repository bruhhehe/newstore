# STEADWELL — AI AGENT HANDOVER PROMPT
*(Paste this at the start of a new session, then state the task. Last updated: 7 Aug 2026, session 7.)*

You are continuing work on **Steadwell**, a Shopify store selling joint-health, comfort and mobility products to adults 45+ in the UK. Read this whole document before doing anything, then read `PROGRESS.md` in the repo for the detailed change log, and resume from there without re-asking anything already answered.

---

## 1. THE BUSINESS & BRAND

- **Store:** Steadwell — `f2r64e-1i.myshopify.com` (Shopify Basic, GBP, UK, contact s77506910@gmail.com). Dropshipping model; supplier photos not yet available.
- **Audience:** adults 45+ with joint stiffness, aches, reduced mobility. Price- and trust-sensitive researchers, not impulse buyers. Mostly on phones.
- **Positioning:** *honesty as the differentiator.* No hype, no miracle claims, no urgency gimmicks (no countdown timers, no fake scarcity). Comfort and support, never cures.
- **Voice:** reassuring, credible, benefit-led, plain English. Products are described as comfort devices with an explicit "not a medical device… speak to your GP" note. This is non-negotiable and legally motivated (UK ASA/CPRs; FTC/FDA-equivalent caution).
- **Owner preferences learned so far (respect these):**
  - Hates Shop/Shop Pay branding — remove/avoid it everywhere possible. Dynamic checkout is OFF in the theme; a custom unbranded "Buy it now" button exists. Owner intends to switch to **Legacy customer accounts** and untick Shop Pay wallet + Instalments (admin steps, may not be done yet — verify).
  - Wants placeholders (not stock photos) until real product photography exists. Never present stock photos as product photos.
  - Wants strong conversion/AOV/retention focus and a clean, coherent design; dislikes cramped spacing and incoherent page flow.
  - Communicates tersely; wants action, not essays. Implement, push, summarise.

## 2. DESIGN SYSTEM (theme = Dawn fork, Online Store 2.0)

- **Brand CSS:** everything custom lives in `assets/steadwell-brand.css`, sectioned with numbered comment headers (currently ~28 sections). Custom classes are prefixed `stw-` (`.stw-hero`, `.stw-nudge`, `.stw-announce`, `.stw-pdp-trust`, `.stw-404`, `.stw-buy-now`, `.stw-faq`, `.stw-sale-strip`…).
- **Palette (CSS vars in that file):** `--stw-teal` #1E5B58, `--stw-teal-dark` #14403D, `--stw-terracotta` #B6552F (CTA/accent), `--stw-mist` #E9F1EF (soft bg), `--stw-ink` (body text), cream page background. WCAG AA verified — keep it that way.
- **Type:** Work Sans; body scale 110% (≈16px+ minimum), generous line-height; body-copy links are always underlined (45+ readability). Tap targets ≥44px.
- **Hero:** self-contained CSS gradient + inline SVG texture (NO external images — an Unsplash hotlink was deliberately removed). Swap-in note in the CSS for real photography.
- **Homepage narrative (do not scramble it):** hero → trust strip → "Start with what's bothering you" concern tiles → sale strip → "Our most popular comfort devices" grid → why-Steadwell → blog teaser.
- **Concern tiles:** brand-gradient tiles (collection images intentionally not rendered). Their grid is **explicit CSS Grid**, replacing Dawn's flex grid — see gotchas.

## 3. STACK, ACCESS & WORKFLOW

- **Target repo:** `github.com/bruhhehe/newstore`, branch **`feature/theme-setup`** — this branch is the GitHub-connected **live (MAIN) theme**. Pushing to this branch deploys to the live theme via Shopify's GitHub sync (verified working; takes ~1–2 min). The store should be password-protected pre-launch — verify before risky pushes.
- **GitHub auth:** a fine-grained PAT is stored in the project file `Github_PAT_key_for_editing_shopify_theme` (also configured in the session environment). Clone with `https://x-access-token:<PAT>@github.com/bruhhehe/newstore.git`. **Never print the token in responses or commit it anywhere.**
- **Reference store/repo (READ-ONLY, never modify):** Bunny Perch — `admin.shopify.com/store/cjyz7c-cf`, `github.com/bruhhehe/store`.
- **Shopify access:** via the connected Shopify MCP tools (Admin GraphQL + convenience tools). Store data changes (products, pages, menus, collections, discounts, metafields) go through the API; **theme file changes go through the repo only** (see gotchas).
- **Hard rules:** never push to `main`; never publish/unpublish themes or change payment settings; never touch Bunny Perch; don't invent products/pricing/brand assets; ask when blocked instead of placeholder-and-proceeding; commit progress to `PROGRESS.md` before stopping.

## 4. KNOWN API/PLATFORM LIMITATIONS (don't rediscover these)

1. **`write_legal_policies` scope is missing** → `shopPolicyUpdate` is denied. Policies must be pasted manually by the owner (final HTML ready in `legal-policies-draft/`).
2. **Shipping rates use Shopify's new rate-conditions system** → legacy `deliveryProfileUpdate` refuses the free-shipping condition and the new `rateGroups` input isn't in this API version. The £50→£40 threshold change is a manual admin step.
3. **Theme file writes to the MAIN theme are blocked via API** → all theme edits go through the repo + GitHub sync. This is the intended workflow anyway.
4. Customer-accounts version, checkout settings, homepage meta (Online Store → Preferences), storefront password, and app dashboards (Judge.me, Track123, Inbox, Search & Discovery) have **no API surface** — they're documented manual steps.

## 5. THEME GOTCHAS (hard-won; respect them)

- **CSS load order:** Dawn loads `component-card.css` and other per-section stylesheets AFTER `steadwell-brand.css`. Equal-specificity rules lose. The concern-tile rules use scoped `!important` on `padding`/`display` for exactly this reason — don't "clean them up."
- **Dawn's `.grid` is flex-based and fragile:** it once collapsed the concern tiles to one-per-row. `.collection-list.grid` is now explicit CSS Grid (`repeat(2,1fr)` mobile / `repeat(3,1fr)` desktop). Extend that pattern rather than fighting flex widths.
- **Custom-liquid sections don't AJAX-refresh:** the cart free-delivery nudge updates on page load, not on in-page quantity taps. Known and accepted.
- **Sale auto-expiry:** all SUMMER20 messaging (guarded announcement bar in `sections/header-group.json`, sale strip in `templates/index.json`) sits inside Liquid date guards and disappears automatically after **31 Aug 2026**. After 1 Sept, the plan is to point the announcement bar at the "Spend £80, save 5%" tier.
- **FAQ schema is a static copy:** `templates/page.faq.json` contains FAQPage JSON-LD mirroring the FAQ page body. If the FAQ page is edited, update the template too or Google may penalise the mismatch.
- **Placeholders:** all 11 products use uniform placehold.co images (mist bg, product name, "Product photo coming soon") with honest alt text. Keep this style for any new products until real photos exist.

## 6. LIVE STATE SNAPSHOT (as of 7 Aug 2026 — re-verify, don't trust blindly)

- **Catalog:** 11 products (£14.99–£69.99), ACTIVE, untracked inventory, compliant copy, unique SEO meta, placeholder images. 10 collections (6 by concern, 4 by type) with descriptions.
- **Pages:** About, Contact (with copy + form), FAQ (`/pages/faq`, accordion + JSON-LD template), blog "news" with 3 compliant articles (8 more planned in `content-calendar.md` if present).
- **Menus:** main-menu (Shop by Concern / Shop by Type / All Products / Advice / About / FAQ / Contact), `footer-shop` (dedicated Shop column), `footer` (My Account, Track Your Order, FAQ, Contact, About, Privacy).
- **Discounts:** `SUMMER20` (20% off, ACTIVE, ends 31 Aug 2026) · `WELCOME10` (10%, active, no end — intended for the newsletter welcome email) · "Spend £80, save 5%" automatic, SCHEDULED from 1 Sept 2026.
- **Conversion/AOV features live in theme:** unbranded Buy-it-now (express: cart-permalink checkout of ONLY that item, with localStorage cart backup/restore so the customer's cart is never lost — see snippets/steadwell-buy-now-restore.liquid) + solid Add-to-cart, PDP trust line + Delivery/Use collapsible tabs + "Pairs well with" complementary block (empty until Search & Discovery pairs are set) + "You may also like", cart free-delivery progress bar (£40 goal) + low-ticket cross-sell + trust block, sticky header on scroll-up, helpful 404, Organization JSON-LD.
- **Policies:** ONLY Privacy published (Shopify default). Refund/Shipping/Terms final HTML awaiting manual paste.

## 7. OUTSTANDING — THE OWNER'S MANUAL CHECKLIST (top of `PROGRESS.md` has details)

Priority order: **① Settings → Shipping: change UK free-delivery condition £50 → £40** (site promises £40 everywhere; checkout still charges under £50 — the #1 trust bug). **② Settings → Policies: paste Refund/Shipping/Terms** from `legal-policies-draft/` (+ supply legal business name & registered address for the two flagged lines — required by UK distance-selling law; never invent these). **③ Settings → Customer accounts → Legacy** (removes Shop from login; theme account pages are ready) + Settings → Payments: untick Shop Pay wallet & Instalments. **④ Apps:** Judge.me, Shopify Inbox, Track123 (guide: `app-configuration-guide.md`), Search & Discovery complementary pairs. **⑤ Real product photography** — the single biggest conversion blocker; when photos arrive, replace placeholders with descriptive alt text. Also: homepage meta title/description (copy in `PROGRESS.md`), delete redundant themes ("Horizon", "Steadwell (Claude build - ready to publish)"), custom domain + Search Console at launch, keep storefront password ON until launch-ready.

## 8. HOW TO WORK

Audit-before-acting on anything ambiguous; verify live state via API rather than assuming this document is current. Make changes surgically; validate JSON templates and CSS brace balance before pushing; one descriptive commit per logical change; update `PROGRESS.md` before ending any session; give the owner a short, concrete summary with any new manual steps clearly separated. If the owner sends a screenshot of a visual bug, find the root cause (usually a Dawn cascade/load-order interaction) rather than patching symptoms.

**Now ask the owner what they want done next, or execute the task they've pasted below this document.**
