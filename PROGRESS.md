# Joint-Health 45+ Shopify Store — Build Progress

Last updated: 2026-08-07 (session 7 — AOV build-out, Shop removal path documented)

## Session 7 (cont.) — Shop removal path + AOV build-out
Client wants Shop branding gone everywhere incl. the login page, and AOV maximised.
- **Login page Shop branding**: comes from Shopify-hosted "New customer accounts".
  Fix is admin-only: Settings → Customer accounts → select **Legacy** accounts →
  enable login link. Theme has a full set of branded, Shop-free account pages
  (templates/customers/: login, register, account, order history, addresses, reset).
  Also (Settings → Payments → Shopify Payments → manage): untick **Shop Pay** wallet
  and disable **Shop Pay Instalments** to remove Shop from checkout + PDP banner.
  Dynamic checkout button already off in theme.
- **AOV levers implemented**:
  1. Cart free-delivery progress nudge — "You're £X away from free UK delivery" with
     progress bar (assumes £40 goal; matches sitewide promise; nudge is Liquid so it
     updates on page load, not on in-page quantity AJAX — acceptable).
  2. Cart cross-sell — "Add a little extra comfort": 4 low-ticket Daily Living Aids
     with quick-add, placed between cart footer and trust block.
  3. PDP "Pairs well with" complementary-products block (renders once Search &
     Discovery app has complementary pairs configured — CLIENT ACTION, ~5 min:
     Search & Discovery app → Product recommendations → set 1–2 complements per
     product, e.g. knee massager → acupressure mat, jar opener → reacher).
  4. Automatic discount "Spend £80, save 5%" created, SCHEDULED to start 1 Sept
     2026 (avoids stacking confusion with SUMMER20 which ends 31 Aug). Doesn't
     combine with other order/product discounts; does combine with free shipping.
     Client can tweak %/threshold or delete in Discounts admin.
  5. Existing: PDP "You may also like" related products; sticky header.
- Suggest surfacing the £80 tier in the announcement bar after 1 Sept (replacing the
  SUMMER20 bar which auto-expires): one-line theme edit when ready.

## Session 7 (cont.) — Tile padding bulletproofed + accounts groundwork + retention pass
- **Tile text flush-left, round 2 — actual root cause**: Dawn's `component-card.css`
  is loaded per-section AFTER steadwell-brand.css, and its `.card--standard >
  .card__content { padding: 0 }` (plus `display: grid`) was overriding our inset at
  equal specificity by document order. Forced with `!important` on the three
  contested properties (padding, display, information padding), scoped only to
  `.collection-list`. This is the load-order-proof fix.
- **Sticky header on scroll-up** enabled (settings_data preset) — cart/search/menu
  always one tap away mid-page; good for older users who scroll far.
- **Customer accounts groundwork**: Dawn header auto-renders a Sign in / My account
  icon the moment accounts are enabled (`shop.customer_accounts_enabled` — verified
  in header.liquid). "My Account" (/account) added to footer Help menu, Track Your
  Order kept beside it.
- **CLIENT ACTION — enable accounts (2 min, admin-only, no API exists):**
  Settings → Customer accounts → choose **"New" customer accounts** (passwordless
  email-code login — far better for 45+ than passwords) → turn ON "Show login link
  in your store's header and at checkout". Result: header account icon appears,
  customers can self-serve order history/tracking, and checkout offers optional
  account creation — exactly the "option to sign up when checking out" requested.
  Optionally also Settings → Checkout → keep customer accounts OPTIONAL (never
  required) so guest checkout stays frictionless.

## Session 7 (cont.) — Tile text-inset fixed (padding rule consolidation)
Client: text on concern tiles sat too close to the left edge. Cause: three separate
rules were setting conflicting padding on `.collection-list .card__content` (2rem
base, then a stale 1.4rem mobile override, then a 1.5rem mobile override from the
grid rewrite) — the smallest one was winning on phones. Removed the stale duplicate,
consolidated to one generous, consistent inset (2.4rem/2.2rem desktop, 2rem/1.8rem
mobile), and gave the heading proper line-height so multi-line labels + arrow don't
crowd the edges.

## Session 7 (cont.) — Concern-tile layout bug fixed (root cause found)
Client screenshot showed concern tiles stacked full-width, one per row, with a large
dead-space gap to the right of each — not a 2-column grid at all. Root cause: Dawn's
`.grid` is flex-based (`display:flex`), and the tablet-down 2-column rule only sets a
plain `width` on `.grid__item`, which flex-grow can still expand past under some
conditions — collapsing to one item per row instead of two side by side. Rather than
keep patching around Dawn's flex system, replaced it outright for `.collection-list`
with an explicit CSS Grid (`display:grid; grid-template-columns: repeat(2,1fr)` on
mobile, `repeat(3,1fr)` on desktop) — exact, unambiguous columns that can't collapse.
Tiles also switched from 4:3 to 1:1 aspect ratio on mobile for a tighter, less
cavernous feel in a true 2-up grid. Verify on next storefront check.

## Session 7 (cont.) — Bug fix + client refinements (mobile screenshots)
- **FIXED: blank white concern tiles** — my tile CSS lost a specificity battle with an
  earlier `.card--standard .card__inner{background:#fff}` rule → white cards, white
  (invisible) text. Rebuilt: tile is now the outer card__content itself (inner/media
  hidden entirely), gradient + white label render reliably.
- **Buy it now added** — custom unbranded direct-checkout button (terracotta, full
  width) under Add to cart: plain POST to /cart/add with return_to=/checkout, tiny JS
  syncs selected variant + quantity from the main form. No Shop account, no Shop
  branding. Dynamic checkout stays OFF. Note: the "Pay in 3 with Shop Pay"
  instalment banner on product pages is controlled by Shopify Payments settings
  (Settings → Payments → Shop Pay Instalments), not the theme — client can disable
  there if unwanted.
- **Newsletter** — heading now "Subscribe now for news, comfort tips and exclusive
  deals" per client. WELCOME10 (10%, all customers, no end) remains active for use in
  campaigns/welcome emails; consider an end date or one-per-customer limit in admin.
- **Placeholder consistency** — remaining 8 products regenerated to the labelled
  mist/teal "photo coming soon" style; all 11 now match.

## Session 7 (cont.) — Redesign pass after client feedback
Client flagged: incoherent homepage flow, duplicated/odd footer, uncentred newsletter,
Buy-with-Shop hijacking the buy button, random stock photos on concern tiles, and
wanted a signup discount incentive. Fixed in commit(s) after ddd4926:
- **Homepage narrative rebuilt**: hero → trust strip → "Start with what's bothering
  you" (concern tiles) → sale strip → ONE product grid ("Our most popular comfort
  devices") → brand statement → advice teaser. The redundant second grid
  (daily-living) removed; rhythm/padding rebalanced.
- **Buy button fixed**: dynamic checkout (Buy with Shop) disabled on the product
  template — "Add to cart" is now the single, solid, teal primary action.
- **Concern tiles**: random grass/gravel stock photos no longer shown — tiles are
  clean brand-gradient cards with label + hover lift (CSS; collection images left in
  data, simply not rendered; swap-in note in CSS for real photography).
- **Footer rebuilt**: new dedicated "Footer — Shop" menu (no more main-menu dump with
  duplicate About/FAQ/Contact); Help column trimmed to FAQ, Contact, Track Order,
  About, Privacy; newsletter block centred with divider + breathing room.
- **Newsletter incentive**: heading now "Get 10% off your first order with code
  WELCOME10"; WELCOME10 discount (10%, all customers, no end date) created and live.
  Client may want to add an end date or one-use-per-customer limit in admin.

## Session 7 — Phase 3 IMPLEMENTED (client approved plan with "go")
All approved PLAN.md items executed except where blocked; theme changes pushed to
`feature/theme-setup` (GitHub sync carries them to the connected live theme; store
remains password-protected). NOTE: the session-6 "GitHub sync is broken, bypass it"
guidance further down this file is STALE — sync is verified working and is the
standard workflow again.

### Done this session (store data, via Admin API)
- 3 stock-photo products reverted to honest labelled placeholders (audit C3) ✅
- Contact page body written (T1) ✅ · FAQ page created at /pages/faq (P1.4) ✅
- Main menu: FAQ added · Footer menu: FAQ + Privacy Policy links added ✅
- Collection descriptions added to the 4 type collections (P1.5, text only —
  collection images deferred until real photography exists) ✅
- SEO title_tag/description_tag metafields set on About, Contact, FAQ (P2.1) ✅

### Done this session (theme, commit 5d8d129 + follow-up)
- Sale copy auto-expires after 31 Aug 2026 via Liquid date guards; hero sale note
  removed (was 3x repetition); announcement bar rebuilt as guarded custom-liquid (P0.3/P1.2) ✅
- Hero: Unsplash CDN hotlink removed — self-contained brand gradient + SVG texture,
  zero external requests; swap-in note left in CSS for real photography (P1.1) ✅
- Product template: vendor block removed; trust line under buy buttons; Delivery &
  returns + How to use & care collapsible tabs; related-products section (P1.3) ✅
- Cart trust block (P1.6); collection filtering off / sorting kept (P1.5) ✅
- FAQ accordion styles, always-underlined body links, announce bar styles (P1.7) ✅

### Blocked → manual steps for client (in order of importance)
1. **Free-delivery threshold £50 → £40** — Settings → Shipping and delivery → edit the
   conditional free rate on UK Standard. API refused: rate uses Shopify's new
   rate-conditions system; this app's API version can read but not write it.
   Until changed, homepage/policies say £40 but checkout charges under £50. ~30 seconds.
2. **Paste 3 policies** — `legal-policies-draft/` now contains FINAL paste-ready HTML
   for Refund, Shipping, Terms (+ improved Privacy, optional replacement of the default).
   `shopPolicyUpdate` still denied (`write_legal_policies` scope missing). ~2 minutes.
   Then add footer links for Refund/Shipping/Terms (I only linked Privacy, which is live,
   to avoid dead links).
3. **Legal business name + registered address** — one [REQUIRED BEFORE LAUNCH] line in
   the Privacy + ToS files. UK distance-selling requirement; cannot be invented.
4. **Homepage meta** (Online Store → Preferences): title "Steadwell | Comfort & Mobility
   Products for Adults 45+"; description "Honest, comfort-first products for joint
   stiffness and everyday mobility — heat & massage devices, supports and daily living
   aids. Free UK delivery over £40, 30-day returns."
5. Apps (Judge.me / Track123 / Inbox) per `app-configuration-guide.md`; theme-library
   cleanup (delete "Horizon" + the redundant "ready to publish" duplicate); confirm
   storefront password is ON; real product photography remains the launch gate.

## Session 7 (cont.) — Phase 2 plan delivered, awaiting go-ahead
Client confirmed the audit and instructed: (1) placeholders for the 3 stock-photo
products — DONE, all 3 reverted to honest labelled placehold.co images via Admin API;
(2) "write your own terms" — DONE, policy drafts finalised (30-day returns, customer
pays return postage unless faulty, £4.99/free-over-£40 shipping) with ONE remaining
[REQUIRED BEFORE LAUNCH] item: legal business name + registered address; (3) expand
scope to a full design & UX pass — reviewed brand CSS/templates, findings folded into
PLAN.md (hero Unsplash hotlink, 3x sale repetition, product-page trust gaps, missing
FAQ page, etc.). `PLAN.md` committed. **STOPPED for client go-ahead before Phase 3.**
Client still owes a decision on C1 only if they DISAGREE with the proposed £40
free-shipping threshold (default: change Shopify setting £50→£40 on plan approval).

## Session 7 — Phase 1 re-audit complete, awaiting client confirmation
Full current-state audit delivered at `AUDIT.md` (verified live store via Admin API +
repo at HEAD). Headlines: live theme now correctly shows the branded build (session-6
sync issue is resolved — GitHub sync IS working; the "bypass GitHub" guidance below is
stale). 3 Critical items found: (C1) homepage/policy/shipping-settings disagree on the
free-delivery threshold (£40 vs £50) and standard rate (£3.99 vs £4.99); (C2) Refund/
Terms/Shipping policies still unpublished while homepage promises 30-day returns;
(C3) three products carry stock photos presented as real product photography.
**STOPPED per brief for client confirmation before Phase 2 (Plan).** Five client
decisions listed at the end of AUDIT.md.

## Status: CRITICAL FIX APPLIED (session 6) — see below before anything else

## ⚠️ What went wrong and what was fixed (session 6)
The client reported the live store looked completely unbranded — default Dawn content,
"Example product title" placeholders. Diagnosis: a theme named `newstore/feature/theme-setup`
WAS connected via GitHub and WAS live (role: MAIN), but its actual file content was stock
default Dawn (e.g. `templates/index.json` still said "Browse our latest products") —
the GitHub sync never pulled my real commits, for reasons I couldn't fully diagnose
(possibly a one-time snapshot at connection time, possibly branch/sync configuration).

**Fix:** stopped relying on GitHub sync entirely. Used the Shopify Admin GraphQL API
directly:
1. `themeDuplicate` on the live theme → created a new **unpublished** theme
   ("Steadwell (Claude build - ready to publish)", id `197173477753`)
2. `themeFilesUpsert` to push the 7 files that actually differ from stock Dawn directly
   into it: `config/settings_data.json`, `templates/index.json`, `layout/theme.liquid`,
   `sections/header.liquid`, `sections/header-group.json`, `sections/footer-group.json`,
   `assets/steadwell-brand.css`
3. Hit two validation errors from Shopify's schema (not caught by local theme-check,
   which doesn't validate against live setting constraints): `body_scale`/
   `spacing_grid_horizontal`/`spacing_grid_vertical` must land on the schema's defined
   step increments (fixed: 112→110, 10→12), and a `richtext`-type description field
   needs an actual `<p>` wrapper, not plain text (fixed). Both corrected and re-pushed
   successfully.
4. This new theme is **unpublished** — I cannot publish it myself (theme publishing is
   a blocked mutation, matching the original "don't go live without me" instruction).
   **The client needs to preview it and click Publish when ready.**
   Preview URL: `https://f2r64e-1i.myshopify.com/?preview_theme_id=197173477753`

**Also fixed per client's explicit instruction ("use templates for images"):** all 11
products now have a placeholder image (via placehold.co — a purpose-built placeholder
image service, not scraped/copyrighted photography) and are set to **ACTIVE** status,
so the store is no longer empty. Alt text and the image itself both flag "photo coming
soon" so it's honest to any actual site visitor. **These MUST be swapped for real
product photography before genuine launch** — flagging clearly so this doesn't get
missed. Previous Blocker 1 (no images at all) is now "placeholder images in place,
real photos still needed," not fully resolved.

## Lesson for future sessions
Don't assume a described manual step ("connect via GitHub") was completed correctly
just because time has passed — verify directly via API before reporting something as
done-pending-a-manual-step. The `themeDuplicate` + `themeFilesUpsert` path (used here)
is more reliable than depending on GitHub sync working, and should be the default
approach going forward, not a fallback.

## Brand Decisions (confirmed by client, session 1)
- Brand name: **Steadwell** (text wordmark, no image logo)
- Colors: deep teal `#1E5B58` (primary/trust), warm cream `#FAF6EF` (background), muted terracotta `#B6552F` (accent/sale), dark charcoal `#24211E` (text) — synthesized from client's "use your judgment" on the calming/warm split
- Typography: Work Sans (header 700wt / body 400wt), heading_scale 115%, body_scale 112% for 45+ readability
- Domain: client will provide later — not yet set anywhere
- Catalog: final 11-item list approved (client deferred to judgment) — see below, unchanged from session 1 proposal

## Store & Repo Facts (confirmed this session)
- Target store: `f2r64e-1i.myshopify.com` ("My Store" — unbranded, Basic plan, GBP, UK, no products, no theme customization yet)
- Reference store: `cjyz7c-cf.myshopify.com` (Bunny Perch / velagoods.co.uk) — READ-ONLY, not touched, not modified
- Target repo: `github.com/bruhhehe/newstore` — was completely empty (no branches, no commits). Working branch created: `feature/theme-setup`
- Reference repo: `github.com/bruhhehe/store` — cloned locally read-only for structure reference only. Confirms Bunny Perch runs Shopify's **Dawn** theme architecture (assets/config/layout/locales/sections/snippets/templates), customized with `bp-*` prefixed assets. We are using Dawn as our own base too (good fit: accessible, fast, mobile-first — matches the 45+ readability brief) but will NOT copy Bunny Perch's actual branded assets/copy — new store gets its own theme fork sourced from Shopify's stock Dawn.

## Product Research Findings (from Market_Product_research)
This is a strategic dropshipping framework (4 audience segments), not a final SKU list. For "joint-health/mobility 45+", the relevant candidates are pulled from **Segment 2 (shared 45+)** plus a couple of relevant items from **Segment 4 (men 45+)**. Segment 3 (women 45+) is mostly menopause-focused and NOT relevant to this store's joint-health angle.

Proposed initial catalog (pending client confirmation — see questions asked):
1. Cordless heated knee massager (heat + compression + vibration) — hero product, top-ranked (56/65)
2. Shiatsu cordless neck/shoulder massager
3. Heated cordless back massager cushion
4. Percussion mini massage gun (recovery)
5. Heated foot/ankle massager
6. Posture corrector brace
7. Acupressure mat set
8. Adjustable ergonomic pillow
9. Reacher-grabber daily-living aid
10. Grip-assist jar openers
11. Anti-fatigue kitchen mat

**Critical compliance constraint (from research doc, must be followed in ALL copy):** UK ASA/CAP Code Section 12 treats medical-device efficacy claims as requiring MHRA registration + clinical evidence. NEVER use "treats arthritis," "cures joint pain," or similar medical claims. Always frame as "soothing warmth," "compression comfort," "circulation support," "post-activity relaxation," "mobility support." This applies to product copy, blog content, ads, and structured data.

**Tone note:** Advice_Trascript is a dropshipping ad-funnel/CRO video (scarcity, urgency, "sell the outcome," withhold pricing). This conflicts with the brief's "reassuring, credible, not hype-driven" requirement and the compliance constraints above. Using only the compatible parts (clear benefit-led copy, FAQ/objection handling, genuine trust signals) — NOT the scarcity/urgency/aggressive persuasion tactics.

## Scope Checklist
- [x] 0. Brand identity confirmed (name, logo, colors, domain, voice)
- [x] 0b. Product catalog + pricing confirmed
- [x] 1. Theme setup — Dawn forked and branded (see commits a34b913, 8912967)
- [x] 2. Site architecture — nav (main + footer menus via Admin GraphQL), footer content
      (brand info, link columns, honest trust text, newsletter), homepage template
      (hero, trust strip, shop-by-concern grid, featured products, "why Steadwell"
      trust section, blog teaser). Commit c23053d.
- [x] 3. Collections — all 10 created as smart/tag-based collections (6 by condition,
      4 by type), auto-populate from product tags. Created via Shopify Admin API
      (not theme code — no git diff, tracked here instead).
- [x] 4. Products — all 11 catalog items created with compliant benefit-led copy,
      correct condition+type tags, GBP pricing, SKUs. Posture brace has S/M/L variants;
      rest are single-variant. **All left as DRAFT status with NO images** — see
      blocker below. Created via Shopify Admin API (no git diff).
- [~] 5. Legal/trust pages — About page done (Phase 2). Refund, Shipping, Privacy, and
      Terms of Service **drafted in full** at `legal-policies-draft/*.html` but **NOT
      pushed to Shopify** — the connected Shopify app doesn't have the
      `write_legal_policies` scope, only `read_legal_policies`. Blocked on either (a) you
      re-authorizing the Shopify connector with that scope so I can push directly via
      `shopPolicyUpdate`, or (b) you pasting the HTML from those files into
      Settings → Policies yourself. Drafts use real UK statutory content (14-day
      cancellation right, Consumer Rights Act 2015 faulty-goods rights) where the law
      sets a baseline, and clearly bracketed `[MERCHANT TO CONFIRM]` placeholders for
      business-specific facts I don't have: legal entity name & registered address,
      whether returns are extended beyond the 14-day statutory minimum, who pays return
      postage, and shipping costs/timeframes.
- [x] 6. Blog — 3 SEO-focused, compliance-safe articles published to the store's existing
      "News" blog (already wired into the homepage teaser). Full content-calendar outline
      with 8 more planned posts at `blog-content-calendar.md`. Content rules documented
      there: no specific exercise/stretch technique instructions (injury-risk/liability),
      no medical claims, GP-referral disclaimer on every post, one collection link each.
- [~] 7. SEO — meta title + description set via Admin API on all 11 products and all 10
      collections (real, keyword-natural, benefit-led copy, no medical claims — see
      table below is superseded, SEO copy lives in Shopify now not in a table).
      Confirmed Dawn already ships JSON-LD structured data out of the box for products
      and articles (`sections/main-product.liquid`, `sections/main-article.liquid`) —
      no extra work needed there; review/rating schema will come from Judge.me
      automatically once installed (Phase 8), not hand-rolled. Clean URLs are automatic
      via Shopify handles (already clean, e.g. `/products/cordless-heated-knee-massager`).
      Sitemap is auto-generated by Shopify at `/sitemap.xml` — actual *submission* to
      Google Search Console needs a live, verified domain, so that's a Phase 9/launch-day
      manual step, not something to do now.
      **Remaining:** (a) Page-level SEO (About page, and the 4 legal pages once live) —
      Shopify's Page object has no native `seo` field in this API version; likely needs
      the legacy `global.title_tag`/`global.description_tag` metafield convention or
      just doing it by hand in Settings → Pages, haven't chased this down yet. (b) Alt
      text — blocked on Blocker 1 (photography). (c) Homepage meta title/description —
      lives in Online Store → Preferences, not reachable via the Admin GraphQL calls
      tried so far. (d) Page-speed pass — needs a live/staged URL to run properly,
      better done in Phase 9.
- [~] 8. App config (Judge.me, Track123, Shopify Inbox) — **can't configure these
      directly**: they're third-party apps (or Shopify's own Inbox channel) with
      settings in their own dashboards, no Admin API surface reachable from here.
      Wrote a full step-by-step guide at `app-configuration-guide.md`, verified against
      current (Aug 2026) help docs for each app. One thing I *could* do directly and
      did: added "Track Your Order" to the footer menu linking to Track123's default
      tracking page URL. Flagged a compliance-relevant recommendation in the guide:
      route Shopify Inbox's AI assistant to handle logistics questions only, and
      hand off anything about symptoms/conditions to a human — fits the "comfort not
      cure" framing used everywhere else.
- [~] 9. QA pass — everything checkable without a live theme is done, see `qa-report.md`:
      automated theme-check lint (0 errors, 9 pre-existing warnings none of which are
      mine), JSON validity, internal link audit, functional verification that smart
      collections are actually populating correctly (live product counts match expected
      tagging exactly), and real WCAG contrast-ratio math for every color pairing (all
      pass AA, confirmed the terracotta button needed the darker shade chosen in Phase 1).
      **Remaining:** checkout flow, page speed, and visual QA all need the theme
      connected live first — recommended as a second QA pass once that's done.

## ACTIVE BLOCKER 1: product photography
None of the 11 products have images. I did not use stock photos, hotlinked images, or
AI-generated product renders — for a dropship catalog, the images need to be the actual
photos of the actual sourced SKU, or they'll misrepresent what customers receive. This
needs one of:
(a) real photos from whichever supplier/SKU gets sourced per the research doc's
    sourcing notes (Alibaba/AliExpress/CJ Dropshipping etc.), or
(b) the client supplies photography another way.
All 11 products are DRAFT status and should stay that way until images exist — flagging
so this doesn't get missed before any thought of going live. Once images arrive, use
update-product with the images array, then flip status to ACTIVE.

## ACTIVE BLOCKER 2: legal policy write permission
The connected Shopify app has `read_legal_policies` but not `write_legal_policies`, so
`shopPolicyUpdate` fails with an access-denied error. Drafted Refund, Shipping, Privacy,
and Terms of Service policies are saved at `legal-policies-draft/*.html`, ready to push
the moment permission is granted, or to paste manually into Settings → Policies. Also
need from the client: legal business name & registered address, extended-returns
decision, who pays return postage, and shipping costs/timeframes (all marked inline
in the draft files as `[MERCHANT TO CONFIRM]`).

## Product Catalog Reference (session 3)
| Product | Price | Tags | SKU(s) |
|---|---|---|---|
| Cordless Heated Knee Massager | £69.99 | condition-knee, type-heat-massage | STW-KNEE-001 |
| Shiatsu Neck & Shoulder Massager | £49.99 | condition-neck-shoulder, type-heat-massage | STW-NECK-001 |
| Heated Back Massager Cushion | £54.99 | condition-back-spine, type-heat-massage | STW-BACK-001 |
| Percussion Mini Massage Gun | £44.99 | condition-general-mobility, type-heat-massage | STW-GUN-001 |
| Heated Foot & Ankle Massager | £49.99 | condition-feet-ankle, type-heat-massage | STW-FOOT-001 |
| Posture Corrector Brace | £24.99 | condition-back-spine, type-support-posture | STW-POST-S/M/L |
| Reacher-Grabber Aid | £19.99 | condition-general-mobility, type-daily-living | STW-REACH-001 |
| Grip-Assist Jar Opener Set | £14.99 | condition-hand-wrist, type-daily-living | STW-GRIP-001 |
| Anti-Fatigue Kitchen Mat | £29.99 | condition-feet-ankle, condition-general-mobility, type-daily-living | STW-MAT-001 |
| Acupressure Mat & Pillow Set | £27.99 | condition-back-spine, condition-general-mobility, type-comfort-accessories | STW-ACU-001 |
| Adjustable Ergonomic Pillow | £34.99 | condition-neck-shoulder, type-comfort-accessories | STW-PILLOW-001 |

Inventory is untracked on all variants (no real stock counts yet from a supplier) —
revisit once sourcing is confirmed.

## Technical Notes For Next Session
- **Navigation menus**: my loaded Shopify MCP toolset has no menu-management tool. Shopify's
  Admin GraphQL API supports `menuCreate`/`menuUpdate` mutations — next session, run
  `tool_search` for "graphql mutation" to load `Shopify:graphql_mutation` /
  `Shopify:graphql_query` (seen in the initial deferred-tools index but not surfaced by the
  "navigation menu" keyword search) and use those to build the main + footer menus
  programmatically. Fallback: build nav manually in Online Store > Navigation.
- **Theme deployment**: all theme code lives on GitHub `feature/theme-setup`. There is no
  direct "push to Shopify Theme Library" tool available here — the store needs its
  Online Store > Themes > "Add theme > Connect from GitHub" set up once (or the repo owner
  runs `shopify theme push` via Shopify CLI locally) to actually see these changes live in
  the theme editor. Flagging as a step for the client, since it's store-level integration
  setup, not something to do silently.
- Font keys used (`work_sans_n7` / `work_sans_n4`) are standard Shopify font-picker IDs but
  weren't checked against a live theme editor — verify once theme is connected; harmless
  fallback if wrong (just resets to Shopify's default font, no breakage).

## Open Questions Asked (session 1)
See chat — asked about: brand name, logo, color/font direction, target domain, product catalog + pricing sign-off, brand voice samples.

## Manual Steps Flagged For Client (never automated by this agent)
- Going live / publishing the store
- Payment provider setup / entering any payment or financial credentials
- Domain purchase/connection (agent will prep DNS-ready config once domain name is known, but won't enter registrar credentials)
- Final merge of `feature/*` branches into `main` — will describe changes and ask for confirmation first

## Next Session Resume Point
Every phase in the original scope has now been worked through at least once. What's
left is entirely blocker-driven, not phase-driven:
1. **Product photography** (Blocker 1) — nothing else can make the 11 products ACTIVE
2. **Legal policy write permission + business facts** (Blocker 2) — policies are
   drafted and ready, just need pushing live
3. **Theme connection** (Online Store → Themes → Connect from GitHub) — needed for
   any real visual/checkout/speed QA, and for the three apps' widgets to actually render
4. **App configuration** (`app-configuration-guide.md`) — Judge.me/Track123/Inbox setup

None of these need more building from me — they need decisions or access from the
client. Once any of them move, say so specifically (e.g. "here are product photos" or
"I've connected the theme") and I'll pick up exactly where that unblocks. See
`qa-report.md` for the full Phase 9 findings.
