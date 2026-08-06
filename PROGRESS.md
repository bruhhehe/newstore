# Joint-Health 45+ Shopify Store — Build Progress

Last updated: 2026-08-06 (session 1)

## Status: IN PROGRESS — Phase 1 (theme foundation) done, ready to continue to Phase 2

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
- [ ] 5. Legal/trust pages — NEXT UP (Privacy, Refund, Shipping, Terms via native
      Shopify Policies — confirmed footer already has `show_policy: true` and will
      display them automatically once written; About page already done in Phase 2)
- [ ] 6. Blog + content calendar (default "News" blog confirmed to exist at /blogs/news,
      already wired into homepage blog-teaser section — just needs articles)
- [ ] 7. SEO (meta, alt text, sitemap, schema, speed) — blocked on images (alt text) and
      on Phase 5/6 content existing first
- [ ] 8. App config (Judge.me, Track123, Shopify Inbox) — also where real review content
      will come from; homepage "why Steadwell" section intentionally has no fake reviews
- [ ] 9. QA pass

## ACTIVE BLOCKER: product photography
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
Once brand + catalog answers arrive: build Dawn-based theme fork with brand colors/fonts/logo, apply base.css contrast/type-scale overrides for 45+ readability, push to `feature/theme-setup`, then move to Scope item 2 (site architecture).
