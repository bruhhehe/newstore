# Joint-Health 45+ Shopify Store — Build Progress

Last updated: 2026-08-06 (session 1)

## Status: BLOCKED — waiting on brand/domain/catalog decisions from client

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
- [ ] 0. Brand identity confirmed (name, logo, colors, domain, voice) — **BLOCKED, asked client**
- [ ] 0b. Product catalog + pricing confirmed — **BLOCKED, asked client**
- [ ] 1. Theme setup (Dawn base, accessibility tuning, pushed to feature branch)
- [ ] 2. Site architecture (nav, footer, homepage sections)
- [ ] 3. Collections (by condition + by product type)
- [ ] 4. Product pages (copy, specs, images, Judge.me)
- [ ] 5. Legal/trust pages
- [ ] 6. Blog + content calendar
- [ ] 7. SEO (meta, alt text, sitemap, schema, speed)
- [ ] 8. App config (Judge.me, Track123, Shopify Inbox)
- [ ] 9. QA pass

## Open Questions Asked (session 1)
See chat — asked about: brand name, logo, color/font direction, target domain, product catalog + pricing sign-off, brand voice samples.

## Manual Steps Flagged For Client (never automated by this agent)
- Going live / publishing the store
- Payment provider setup / entering any payment or financial credentials
- Domain purchase/connection (agent will prep DNS-ready config once domain name is known, but won't enter registrar credentials)
- Final merge of `feature/*` branches into `main` — will describe changes and ask for confirmation first

## Next Session Resume Point
Once brand + catalog answers arrive: build Dawn-based theme fork with brand colors/fonts/logo, apply base.css contrast/type-scale overrides for 45+ readability, push to `feature/theme-setup`, then move to Scope item 2 (site architecture).
