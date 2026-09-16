# Vendored skills

These are copies, not a checkout. They were installed here because this repo is
worked on from Claude Code's remote environment, which does not install
marketplace plugins from project settings — `.claude/settings.json` with
`extraKnownMarketplaces` and `enabledPlugins` was tried first and registered
nothing (`~/.claude/plugins/installed_plugins.json` stayed empty and no
marketplace cache was written). Project skills are read straight from the repo,
so they work everywhere.

| Skill | Upstream | Commit | Version | Licence |
|---|---|---|---|---|
| `impeccable` | https://github.com/pbakaus/impeccable | `0a4e72a` | 4.3.1 | Apache 2.0 |
| `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`, `ponytail-review` | https://github.com/DietrichGebert/ponytail | `e3ba2aa` | 4.10.0 | MIT |

Each licence is kept beside the skill it covers. `.claude/agents/impeccable-*.md`
came from the same impeccable commit; the skill delegates to them by name.

## Updating

Re-copy from upstream and bump the commit above:

    git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/impeccable
    cp -r /tmp/impeccable/plugin/skills/impeccable .claude/skills/impeccable
    cp -r /tmp/impeccable/plugin/agents/impeccable-*.md .claude/agents/

    git clone --depth 1 https://github.com/DietrichGebert/ponytail /tmp/ponytail
    cp -r /tmp/ponytail/skills/. .claude/skills/

## What is deliberately NOT here

Both projects also ship **hooks** that run their own executables on every
Edit/Write and on Stop. They are not wired up, and not committed, on purpose:
this repo is public, and a committed hook runs third-party code on every edit
for anyone who clones it. Impeccable's own README puts its hook in
`.claude/settings.local.json` — gitignored, per machine — for the same reason.
Follow each project's README if you want them, on your own machine.

Impeccable's engine binary is not in the repo either. The launcher at
`impeccable/scripts/impeccable` downloads it on first run, which may not
succeed through a sandboxed proxy; the skill documents a degraded path that
reads project context directly when the launcher is unavailable.
