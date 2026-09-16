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
- Several other repos exist on this account. If the repo isn't named, ask — that's a
  real question, unlike most.

**Opening move for any edit — clone and first grep in one call.** The clone fails
loudly if auth, repo, or branch is wrong, so it tests all three at once.

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
  registered address that Companies Act 2006 s.82 requires.
- The compression brace's photograph is the 160px thumbnail that came inline in the v5
  design file. It is the product image in admin and at checkout as well as on the page.
  Replace it with a real photograph of the brace.
- Both wrap packs and the four-pack share one SKU (`PR-KNEE-01`), so nothing downstream
  can tell a single from a pair from a four. That predates this work; check it before
  wiring any SKU-driven fulfilment.
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
  offer grid and pushed the page 9px wider than a 390px screen.
