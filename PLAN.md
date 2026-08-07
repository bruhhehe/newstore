# Steadwell — Phase 2 Plan

Date: 2026-08-07 · Maps to `AUDIT.md` findings · Scope expanded per client: full design & UX pass, not only functionality/compliance.

**Already executed on client's direct instruction (2026-08-07):** the 3 stock-photo products reverted to honest labelled placeholders (C3 ✅); policy drafts finalised with concrete terms (C2 authoring ✅ — publishing is below).

---

## Priority 0 — Critical (do first)

### P0.1 — Unify the shipping story (audit C1)
Proposed single source of truth: **UK standard £4.99 (3–5 working days) · free over £40 · express £6.99**.
- Change the Shopify free-shipping condition from ≥£50 → ≥£40 (one settings change; homepage and finalised shipping policy already say £40; £40 is the customer-generous direction, so no one is worse off than promised).
- No theme edit needed — homepage strip already reads "over £40" and "3–5 working days".
- ⚠️ This is a store-settings change; treated as approved only if you approve this plan (or say otherwise — the alternative is editing the homepage/policy to £50 instead, your call).

### P0.2 — Publish the four policies (audit C2)
- Attempt `shopPolicyUpdate` via Admin API for Refund, Shipping, Terms, Privacy using the finalised drafts.
- If the `write_legal_policies` scope is still missing → hand you the four paste-ready files with a 2-minute instruction (Settings → Policies), and mark the item "deferred: manual".
- Terms chosen for you (changeable any time): 30-day change-of-mind returns from delivery on top of the 14-day statutory right; customer pays return postage unless faulty or misdescribed; refunds within 14 days of receiving the return; delivery rates as P0.1.
- **Remaining hard requirement only you can supply: legal business name + registered address** (UK distance-selling rules). Flagged inline in Privacy + ToS as `[REQUIRED BEFORE LAUNCH]`; everything else is finalised.

### P0.3 — Sale copy auto-expiry (audit C4)
Wrap the hero sale note, announcement bar fallback, and sale strip in a Liquid date guard so all SUMMER20 messaging disappears automatically after 31 Aug 2026, 23:59 UK — no dead-code advertising, no manual date-of removal needed. (Announcement bar text isn't Liquid-capable; move it to a custom-liquid announcement or schedule its removal as a documented step — will pick whichever Dawn supports cleanly.)

## Priority 1 — Design & UX pass (client-requested expansion)

### P1.1 — Hero image off the Unsplash hotlink
The hero background is hotlinked from `images.unsplash.com` — render-blocking-adjacent LCP risk, third-party dependency that can break or change, and inconsistent with the store's no-stock-photos-for-products stance. Fix: download, compress to ~150–250 KB WebP + JPG fallback, upload as a theme asset served from Shopify's CDN, add mobile-sized variant via media query. (Keeping a lifestyle image for the hero is fine — it isn't presented as a product — but it must be self-hosted and optimised. If you'd rather have a pure brand-colour hero until real photography exists, say so.)

### P1.2 — Reduce sale-message repetition
SUMMER20 currently appears 3× above the fold (announcement bar, hero note, mid-page strip). For a "no hype" brand this reads pushy. Keep announcement bar + mid-page strip; drop the hero note, letting the hero do its one job (positioning). All remaining instances get the P0.3 expiry guard.

### P1.3 — Product page trust & structure
- Remove the pointless `vendor` block (every product is "Steadwell").
- Add a compact trust line directly under the buy buttons: "30-day returns · Free UK delivery over £40 · Tracked shipping".
- Add Dawn collapsible tabs after the description: Delivery & returns (links to policies), How to use & care, and the existing "what this is/isn't" note stays in the description.
- Add a "You may also like" related-products section (Dawn's `related-products`) — internal linking win too (audit S4).

### P1.4 — Contact page + new FAQ page (audit T1 + page-inventory gap)
- Contact: short human intro (who replies, response time "within 1 working day", email alternative) above the form.
- FAQ: new page + template answering the questions this audience actually has — delivery times/costs, returns process, "will this help my arthritis?" (honest, compliant answer that routes to GP advice), sizing (posture brace), battery/charging basics, how to reach a person. Linked from footer + main menu.

### P1.5 — Collection pages
Add 1–2 sentence intro descriptions to the 4 type collections that lack imagery/description polish (Heat & Massage, Support & Posture, Daily Living Aids, Comfort Accessories) and collection images for those 4 (brand-styled graphics, not fake product photos). Disable filter noise (11 products don't need faceted filtering; keep sort only).

### P1.6 — Cart page reassurance
Small trust block on cart: returns line, delivery threshold nudge ("You're £X away from free UK delivery" is Dawn-native if enabled), secure-checkout note. No upsells.

### P1.7 — Small design polish
Underline links inside body copy for the 45+ audience (never colour-only), verify mobile menu tap spacing, add a subtle "Back to top" on long pages, blog article images (currently postless-looking teasers) — brand-styled header graphics per post.

## Priority 2 — SEO & housekeeping

- **P2.1** Page-level meta title/description for About, Contact, FAQ via the `global.title_tag`/`description_tag` metafields (audit S2).
- **P2.2** Homepage meta title/description — manual step for you (Online Store → Preferences); I'll supply the exact copy.
- **P2.3** Update `PROGRESS.md`/stale docs (audit D2) and `app-configuration-guide.md` cross-references.
- **P2.4** Post-implementation QA pass on the preview: visual, keyboard nav, tap targets, checkout reachability (stopping before payment), theme-check re-lint (audit A2).

## Manual steps that remain yours (unchanged)
Judge.me / Track123 / Inbox dashboard setup (guide ready) · theme cleanup (delete "Horizon" + the redundant "ready to publish" duplicate) · homepage meta (P2.2) · legal entity name/address · Search Console at launch · confirm storefront password is ON · publishing/merging anything.

---

## Page inventory

| Page | Status | Plan |
|---|---|---|
| Home | ✅ built | P0.3, P1.1, P1.2 edits |
| Collections (10) | ✅ built | P1.5 polish |
| Products (11) | ✅ built, honest placeholders | P1.3 template rework; real photos still outstanding |
| About | ✅ | P2.1 meta only |
| Contact | ⚠️ empty body | P1.4 |
| FAQ | ❌ missing | P1.4 create |
| Blog (3 posts) | ✅ | P1.7 imagery |
| Privacy / Refund / Shipping / Terms | ⚠️ drafted, unpublished | P0.2 |
| Track order | ⚠️ dead link | your Track123 setup (guide ready) |
| 404 / Cart / Search | ✅ Dawn defaults | P1.6 cart only |

## Execution notes
- All theme changes on `feature/theme-setup` only; GitHub sync verified working; no pushes to `main`; nothing published/merged without you.
- Store-data changes in scope on plan approval: shipping threshold (P0.1), policy publish attempt (P0.2), collection descriptions/images (P1.5), page + menu additions (P1.4), page metafields (P2.1).
- Estimated order of work: P0.1 → P0.2 → P0.3 → P1.2 → P1.1 → P1.3 → P1.4 → P1.5 → P1.6 → P1.7 → P2.x → QA.

**Awaiting your go-ahead to start Phase 3. If any single item above shouldn't happen (e.g. you'd rather keep the £50 threshold, or keep the hero sale note), name it and I'll strike it — everything else proceeds as written.**
