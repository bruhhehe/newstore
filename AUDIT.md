# Steadwell — Phase 1 Audit Report

Date: 2026-08-07 · Auditor: Claude (session 7) · Store: `f2r64e-1i.myshopify.com` · Repo branch: `feature/theme-setup`

**Theme framework (confirming per brief):** Shopify Online Store 2.0, Dawn-based fork with `stw-*`/`steadwell-*` prefixed customisations. The GitHub-connected theme `newstore/feature/theme-setup` is the **live (MAIN)** theme and its content now matches the repo — the session-6 sync failure appears resolved. A duplicate "Steadwell (Claude build - ready to publish)" theme (id 197173477753) still sits unpublished and is now redundant.

Verified sources: live Shopify Admin API (products, collections, policies, pages, menus, discounts, delivery profiles, theme files), repo at HEAD `99ff338`, prior-session docs (`PROGRESS.md`, `qa-report.md`, `app-configuration-guide.md`, `legal-policies-draft/`).

---

## 1. Compliance & Trust (the decisive category for this store)

### C1 — CRITICAL: Shipping claims contradict actual shipping settings (three different versions)
- Homepage trust strip (live): "Free UK delivery over **£40**", "Standard delivery is 3–5 working days"
- Shopify delivery profile (live): UK Standard **£4.99**, free at **≥£50**, Express £6.99
- Shipping policy draft (`legal-policies-draft/shipping-policy.html`): "**£3.99**" and free over "**£40**"

A customer reaching checkout below £50 will be charged delivery the homepage told them was free. Under the UK Consumer Protection from Unfair Trading Regulations / ASA rules this is a misleading price claim, and for a trust-sensitive 45+ audience it's exactly the kind of inconsistency that kills conversion. **One number must be chosen (merchant decision) and applied to all three places.**

### C2 — CRITICAL: Refund, Terms of Service and Shipping policies are not published
Only the Privacy Policy exists on the store (Shopify's default template). Meanwhile the homepage promises "30-day returns" — a returns promise with no published returns policy behind it. Full UK-law drafts exist in `legal-policies-draft/` (14-day statutory cancellation + 30-day extended window — consistent with the homepage claim), but pushing them is blocked: the connected app has `read_legal_policies` only. Resolution options: (a) re-authorise the Shopify connector with `write_legal_policies`, or (b) paste the four drafts into Settings → Policies manually. Also still needed from you, marked `[MERCHANT TO CONFIRM]` in the drafts: legal entity name and registered address (Privacy + ToS).

### C3 — CRITICAL: Stock photos presented as real product photos on 3 of 11 products
`Percussion Mini Massage Gun`, `Heated Foot & Ankle Massager` and `Acupressure Mat & Pillow Set` now carry generic stock photography with alt text describing them as the product itself (no "photo coming soon" disclosure). The other 8 products correctly use clearly-labelled placeholders. For a dropship catalog, stock photos of *similar-looking* items misrepresent the SKU the customer will actually receive (returns, chargebacks, ASA risk). Fix: revert those 3 to the honest placeholder treatment, or supply real supplier photography. **All 11 products still need real photos of the actual sourced SKUs before genuine launch** (long-standing Blocker 1).

### C4 — Recommended: Sale copy is hard-coded and will outlive the discount
`SUMMER20` (20% off, verified ACTIVE, ends 31 Aug 22:59 UTC) is advertised in two hard-coded homepage sections (hero note + sale strip). When the code expires the homepage will advertise a dead discount. Plan the removal edit for 1 Sept, or rebuild the strip so the offer text is a theme setting that's easy to clear. Current treatment is otherwise compliant with the "no urgency gimmicks" rule — it's a plain, truthful, dated offer with no countdown.

### C5 — Pass: product copy compliance
Spot-checked descriptions use comfort/warmth/relaxation framing, carry an explicit "not a medical device… speak with your GP" note, and blog posts follow the documented content rules. No cure/treatment claims found in products, collections, homepage, or blog. Keep enforcing this rule on all future copy.

---

## 2. Trust signals & content pages

### T1 — Recommended: Contact page body is empty
The template renders Dawn's contact form, but the page has zero copy — no expected response time, no alternative contact route, no reassurance. For this audience, a short human paragraph materially improves trust.

### T2 — Recommended: "Track Your Order" footer link dead until Track123 is configured
`/apps/track123` will 404 until the app's tracking page is enabled (manual step in the app dashboard — see `app-configuration-guide.md`). Either configure the app or temporarily remove the link.

### T3 — Recommended: No reviews infrastructure live yet
Product cards have `show_rating: true`, but nothing renders until Judge.me is configured (widget placement, review request emails, rating schema). Manual dashboard steps documented in `app-configuration-guide.md`. Same for Shopify Inbox chat — the "Real people to talk to" trust-strip claim depends on it being switched on.

### T4 — Nice-to-have: product-page guarantee/returns snippet
Once policies are published, a short above-the-fold "30-day returns · Free UK delivery over £X" line on the product template would complete the brief's trust-signals requirement.

---

## 3. SEO

### S1 — Done/verified
Unique meta titles + descriptions on all 11 products and 10 collections (spot-checked, keyword-natural, compliant). Clean handles throughout. Dawn ships Product/Article JSON-LD out of the box. Sitemap auto-generated at `/sitemap.xml`.

### S2 — Recommended: page-level and homepage meta
About and Contact pages have no meta descriptions (needs the `global.title_tag`/`global.description_tag` metafield route or manual entry). Homepage meta title/description (Online Store → Preferences) not verifiable via API from here — likely still default; needs manual check/set.

### S3 — Recommended: Search Console submission is a launch-day manual step
Requires the live custom domain (not yet chosen/connected).

### S4 — Nice-to-have: internal linking
Blog→collection links exist; product→related-blog links do not. Organization schema (beyond Dawn defaults) could be added once the legal entity details exist.

---

## 4. UX & Accessibility

### A1 — Verified pass (static checks)
- WCAG AA contrast: all brand colour pairings pass (documented math in `qa-report.md`; terracotta button uses the darker AA-safe shade)
- Body scale 110%, heading scale 115%, Work Sans — meets the ≥16px body requirement
- Navigation is shallow (two-level dropdowns, no mega-menu); mobile columns configured; Dawn's base is mobile-first and keyboard-accessible
- theme-check: 0 errors (9 pre-existing stock-Dawn warnings only)

### A2 — Recommended: live visual/interaction QA not yet done
Checkout flow (incl. guest checkout verification), tap-target spot checks, page-speed/Core Web Vitals, and cross-device visual QA all need the live/preview storefront. Nothing here is knowably broken — it's simply unverified. One image note for the CWV pass: the placeholder PNGs and the 3 stock JPGs should be checked for size once real photos arrive.

### A3 — To verify with you: store password state
I could not reach the public storefront (consistent with password protection being on, which is correct pre-launch) — please confirm it is on, since all 11 products are ACTIVE with placeholder imagery and must not be publicly browsable in this state.

---

## 5. App configuration status

| App | Status | Blocking |
|---|---|---|
| Judge.me | Not configured — full setup guide written | Manual dashboard steps (no API surface) |
| Track123 | Not configured; footer link pre-wired | Manual dashboard steps |
| Shopify Inbox | Not enabled | Manual (Sales Channels → Inbox) |

---

## 6. Technical debt & housekeeping

- **D1 — Recommended:** Redundant themes: "Horizon" (stock, unpublished) and "Steadwell (Claude build - ready to publish)" (now duplicate of live). Deleting them avoids future confusion — theme deletion is a blocked mutation for me, so it's a 30-second manual cleanup for you.
- **D2 — Recommended:** `PROGRESS.md` contains stale session-6 guidance ("don't rely on GitHub sync") that no longer reflects reality — sync is now working and is the correct workflow again. Will correct in the Phase 3 docs pass.
- **D3 — Nice-to-have:** Inventory untracked on all variants (sensible pre-sourcing; decide tracked-vs-untracked with the supplier before launch to avoid overselling).
- **D4 — Nice-to-have:** EU (£14.99) and International (£23.99) shipping zones exist — confirm this launch scope is intentional for a UK dropship operation, and that the shipping policy covers non-UK statutory cancellation handling if kept.

---

## Summary counts
- **Critical: 3** (C1 shipping-claim mismatch · C2 unpublished policies · C3 stock-photo misrepresentation)
- **Recommended: 9** (C4, T1, T2, T3, S2, S3, A2, D1, D2)
- **Nice-to-have: 5** (T4, S4, D3, D4, A3-verify)

## Decisions needed from you before/with Phase 2
1. Free-delivery threshold and standard rate — which numbers are true? (currently £40 vs £50, £3.99 vs £4.99)
2. Legal entity name + registered address for the policy pages
3. Policy publishing route: re-authorise connector with `write_legal_policies`, or you paste manually?
4. The 3 stock-photo products: revert to honest placeholders, or do you have real photos?
5. Confirm store password protection is on
