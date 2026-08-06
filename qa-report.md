# Phase 9 — QA Pass

## What could be checked without the theme being live (done this session)

### 1. Automated theme linting (Shopify's official `theme-check`)
Ran `@shopify/theme-check-node` against the full theme repo (169 files scanned).
**Result: 9 warnings, 0 errors — and none of the 9 are in files I created or modified.**
All 9 are pre-existing in stock Dawn code (variable naming conventions, one orphaned
snippet, one complexity-threshold nudge in `facets.liquid`) — none are functional bugs,
and none are things this build introduced. Full list kept in session logs if needed later.

### 2. JSON validity
`settings_data.json`, `settings_schema.json`, `header-group.json`, `footer-group.json`,
`templates/index.json` all parse as valid JSON (checked at time of writing, re-confirmed
by theme-check successfully loading all of them).

### 3. Internal link audit
Cross-checked every internal link written into blog posts, the About page, and draft
policies against actual collection/page handles in the store:
- All 3 blog posts' collection links resolve to real collections ✓
- About page's link to `/pages/contact` resolves ✓
- Draft policies link to `/pages/contact` (resolves now) and `/policies/*` (will resolve
  once policies are published — currently blocked, see Blocker 2)

### 4. Functional check: smart collection tagging
Queried live product counts per collection and compared against expected tagging —
**exact match on all 10 collections** (e.g. Heat & Massage: 5 products, General
Mobility: 4, Support & Posture: 1, etc.). Confirms the tag-based auto-population is
working correctly, not just configured correctly.

### 5. Accessibility: color contrast (actual WCAG math, not estimation)
Computed real relative-luminance contrast ratios for every foreground/background pairing
used in the theme:

| Pairing | Ratio | WCAG AA (text) | WCAG AA (large/UI) |
|---|---|---|---|
| Body text on cream background | 14.87:1 | PASS | PASS |
| White text on teal button | 7.80:1 | PASS | PASS |
| White text on terracotta (sale badge) | 4.85:1 | PASS | PASS |
| Text on card background | 13.95:1 | PASS | PASS |
| Cream text on dark footer | 14.87:1 | PASS | PASS |
| Teal secondary-button label on cream | 7.24:1 | PASS | PASS |

Every pairing clears the 4.5:1 minimum for normal text. Worth noting: the terracotta
button color only passes at 4.85:1 because I deliberately darkened it from a lighter,
more "warm coral" shade during Phase 1 — the lighter version would have failed.

### 6. Mobile-first settings review
Confirmed sensible mobile column counts throughout (`collection-list`: 2 columns mobile,
`featured-collection`: 2 columns mobile, `multicolumn` trust strip: 1 column mobile —
stacks vertically rather than cramming). Dawn's underlying layout is mobile-first by
design; nothing in the customization work fights that.

## What CANNOT be checked without the theme connected live
- **Actual checkout flow** (test mode) — needs a live/preview URL
- **Real page-speed / Lighthouse numbers** — needs a live/preview URL
- **Visual QA** (does it actually look right, do the trust-strip icons render, etc.) —
  needs a live/preview URL
- **Judge.me / Track123 / Shopify Inbox widgets actually appearing** — depends on the
  app configuration work in `app-configuration-guide.md`, which also needs the theme live

**Recommendation:** once the theme is connected (Online Store → Themes → Add theme →
Connect from GitHub → `feature/theme-setup`), it's worth a preview-mode walkthrough
before merging to `main` or publishing. I'm glad to do a second QA pass at that point.

## Known gaps carried into any future QA pass
- All 11 products are DRAFT with no images (Blocker 1) — won't appear in a live store
  view until photography exists and status flips to ACTIVE
- Legal policies are drafted but not live (Blocker 2)
