# CLAUDE.md — operating notes for theme edits

Standing instructions for AI sessions working on this theme. Read this before starting.

> This repo is **public**. Never commit credentials, credential file paths, or
> customer data. Auth comes from the private project knowledge, never from here.

## Standing context (skip discovery)

- **Repo/branch:** `bruhhehe/newstore`, active branch `feature/thermawell`
- **Auth:** fine-grained PAT supplied via private project knowledge. Read it at
  runtime, use it inline on clone/push, and scrub it from the git remote
  immediately after cloning. Never echo it.
- **Landing page:** `sections/jointwell-landing.liquid` (markup and Liquid only).
  Its CSS is `assets/jw-v5.css` and its behaviour is `assets/jw-v5.js`; the header
  and footer are `snippets/jw-header.liquid` and `snippets/jw-footer.liquid`, shared
  with every other page. Prices and variant ids reach the script through the
  `window.JW` object the section prints — nothing is hardcoded in the JS.
- **Repeat call to action:** `snippets/jw-cta.liquid`, rendered six times down the
  landing page. Edit the button copy and the trust row there, not in the section;
  they were six near-copies before and had drifted apart.
- **Announcement bar:** in `jw-header.liquid`, and it carries the sale. Both figures
  come off the wrap variant's own `compare_at_price`, so clearing that in admin
  swaps the bar back to the delivery line by itself.
- Several other repos exist on this account. If the repo isn't named, ask — that's a
  real question, unlike most.

**Opening move for any edit — clone and first grep in one call.** The clone fails
loudly if auth, repo, or branch is wrong, so it tests all three at once.

**Testing the real cart needs a local reverse proxy.** Headless Chromium cannot
do TLS through the session's agent proxy, and weakening TLS to get round that is
blocked, correctly. `.claude/revproxy.py` fronts velagoods.co.uk on plain HTTP at
127.0.0.1:8100: the browser talks HTTP to it, Python does the verified HTTPS, and
cookies and redirects are rewritten so the cart session works. That is how the
add, the clear and the back-button behaviour were exercised end to end.

**Images the user attaches do not land on disk.** `/root/.claude/uploads/` gets text
files only; `/mnt/attach` stays empty. They are in the session transcript as base64,
under `/root/.claude/projects/<project>/<session>.jsonl`, as top-level `type: image`
blocks on `message.role == "user"` — tool-result screenshots nest a level deeper, so
filter on the top level or you will extract your own screenshots. Decode with
`base64.b64decode`, then `stagedUploadsCreate` → multipart POST to the returned target
→ `productCreateMedia`. Do not substitute other pictures and do not tell the user to
upload them by hand.

## Don't verify what the next step will prove

- No API call to check the token before using it
- No repo listing when the repo is named
- No branch listing when the branch is named
- No API call to confirm a push that already exited 0
- No `view` of lines already printed in full by a grep

Attempt the operation; let failure be the diagnostic. Verification *before* an action
earns its cost only when the action is destructive and hard to reverse. A commit to a
feature branch is neither.

## Asking is expensive — treat it that way

A clarifying question costs more than a wrong guess on a reversible edit. A wrong guess
takes one `git revert`; a question takes a human round-trip.

**Don't ask when:**
- The user quoted the text. Quoted fragments are the target list. Two quotes with
  ellipses means two things to remove.
- A screenshot shows it. Read the crop's **centre**, not its edges — elements sliced by
  the frame boundary are incidental context, not targets.
- Positional words conflict with quoted content. "The text above X", where X is itself
  quoted, almost always means "X, which sits above the thing I just mentioned." Trust
  the quote over the preposition.
- The edit is reversible. Do it, show the diff, offer to revert.

**Do ask when:** the target is genuinely unnamed, the repo or branch is unspecified, or
the change is destructive and irreversible.

## Match effort to the job

A two-line text removal is not an engineering project. Skip the Liquid tag-balance
check, the orphaned-CSS audit, the multi-string verification loop. Edit, `git diff`,
read it, push.

Scale up only for schema changes, JS and interaction logic, anything touching cart or
checkout, or changes spanning several files.

## Preserve conditional branches

When removing text from a Liquid `if/else`, delete only the branch asked for. If that
empties the wrapper, make the wrapper conditional rather than deleting it — don't take
a working code path down with a copy change.

## Report format

Lead with the diff summary. State side decisions in one line each. Flag adjacent issues
in a sentence at the end; don't fix them uninvited and don't write paragraphs about them.

## Known, unfixed

- No support telephone number is set, so the header and footer fall back to the email
  address. Set one in Theme settings → Jointwell, along with the company number and
  registered address that Companies Act 2006 s.82 requires. Until then the narrow
  header reads "Email us" rather than a 23-character address broken across two lines;
  a real phone number fits and the full string comes back on its own.
- The page is light-only by choice: `<meta name="color-scheme" content="light">` in
  `layout/theme.liquid` declares it, so browsers do not force-darken the form controls.
  A dark theme would be a separate piece of work, not a missing variant.
- The compression brace's photograph is the 160px thumbnail that came inline in the v5
  design file. It is the product image in admin and at checkout as well as on the page.
  Replace it with a real photograph of the brace.
- Both wrap packs and the four-pack share one SKU (`PR-KNEE-01`), so nothing downstream
  can tell a single from a pair from a four. That predates this work; check it before
  wiring any SKU-driven fulfilment.
- The buy box's photo carousel is the four supplier studio shots, chosen with a
  thumbnail strip. It renders the wrap product's own Shopify media, so reordering or
  adding images on `jointwell-heated-joint-massager` in admin changes the carousel with
  no code change and no deploy; it appears at two images or more, and the strip wraps
  to a second row past about six. The window is a fixed square with `object-fit:contain`
  because the photographs are not all the same shape and a growing box shoves the price
  and the buy button around. The orange-lit Gemini render was deleted on request.
- The `jw-dimensions.jpg` diagram in the FAQ's fit question is labelled **50 cm** by
  the manufacturer, while the specifications and the FAQ copy both say **46 cm across**.
  One of the two is wrong and there is no source here to settle it. Measure a real unit
  before this goes into an ad.
- The buy button empties the basket before it posts. `/cart/add` appends, so
  without it a second press bought two of everything. The clear is a fetch to
  `routes.cart_clear_url` with `.js` appended; it can only delay the native post,
  never cancel it, and a 2.5s ceiling covers a slow or failed reply. Both the buy
  button and the email button reset themselves on `pageshow`, which is what fires
  when the browser restores the page from its back-forward cache.
- `sections/sajda-page.liquid` still pulls Public Sans off Google Fonts. It is the
  prayer-stool page from a previous product and no template renders it, so nothing
  fetches it — but delete the section rather than leave it if that stays true.

## Skills

`.claude/skills/` carries vendored copies of two third-party skill sets, so they
work in any session including Claude Code's remote environment:

- **impeccable** (`/impeccable`) — design fluency for frontend work. Takes a
  sub-command: `audit`, `critique`, `polish`, `layout`, `typeset`, `bolder`,
  `quieter` and about seventeen more, plus a target.
- **ponytail** (`/ponytail`, plus `-audit`, `-debt`, `-gain`, `-help`, `-review`)
  — "lazy senior dev mode": YAGNI, stdlib first, no unrequested abstractions.

They are copies pinned to an upstream commit, not a checkout, and neither
project's hooks are wired up. `.claude/skills/VENDORED.md` has the provenance,
the update commands, and why the hooks were left out.

The marketplace route was tried first and does not work here: a
`.claude/settings.json` with `extraKnownMarketplaces` and `enabledPlugins`
registered nothing in this environment. Don't re-add it expecting it to install
them.

## Corrections made to the v5 design file

Three, all marked `CORRECTION` at the rule in `assets/jw-v5.css`. Do not "restore"
them from the design file:

- `img` had `max-width` but no `height:auto`, so the width/height attributes pinned
  each photograph's height and stretched it. Measured at 3x on a phone.
- `.rev-who em` and `.verif` ran together as "RiponVerified buyer".
- `.bump-pts` was a hard `1fr 1fr`, whose min-content floor propagated up through the
  offer grid and pushed the page 9px wider than a 390px screen. **Every grid in the
  file now uses `minmax(0,...)` for the same reason** — a bare `1fr` is
  `minmax(auto,1fr)` and cannot shrink below its widest word. Do not "simplify" them
  back to `1fr`.
- Nothing in the shipping UI states a colour of its own; the design file's loose hexes
  are tokens now (`--gold`, `--green-dk`, `--green-tint`, `--rule-2`, the `--on-deep-*`
  family). The mock-mode `.ph` and `.todo` hexes stay raw on purpose: placeholders
  should not look designed.
- `.head-tel`, `.foot-legal` and `.faq summary` carry `overflow-wrap:anywhere`. It is
  load-bearing, not cosmetic: it is what moves the min-content floor. `break-word`
  changes only the rendered break and does not fix the overflow.
