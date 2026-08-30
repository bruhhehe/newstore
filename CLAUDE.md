# CLAUDE.md — operating notes for theme edits

Standing instructions for AI sessions working on this theme. Read this before starting.

> This repo is **public**. Never commit credentials, credential file paths, or
> customer data. Auth comes from the private project knowledge, never from here.

## Standing context (skip discovery)

- **Repo/branch:** `bruhhehe/newstore`, active branch `feature/thermawell`
- **Auth:** fine-grained PAT supplied via private project knowledge. Read it at
  runtime, use it inline on clone/push, and scrub it from the git remote
  immediately after cloning. Never echo it.
- **Landing page:** `sections/jointwell-landing.liquid` (~1500 lines, self-contained —
  CSS in a `<style>` block near the top, markup below, JS at the bottom)
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

`jm_count` is assigned around line 927 of `sections/jointwell-landing.liquid` but first
used around line 681. Liquid evaluates top-down, so the Judge.me badge branch can never
fire. Moving the `assign` above the `bb-copy` block fixes it. Left alone deliberately.
