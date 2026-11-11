---
name: ue-dev-tools
description: The developer tools a game needs so the user tunes during playtests instead of asking for rebuilds - tunable numbers in data with an in-game panel, dev toggles, rules with a live editor, one command per test setup, the 3D test level screen, in-game debug windows and a dashboard. Use this whenever you add a number someone might tune, a debug view, a test setup, a dev panel, a console command, an in-game debug window, or when the user says "take my tuning", "make this tunable" or "I want to tune this while playing". Read it before adding a constant to game code.
---

# Dev tools

The user tunes feel during playtests themselves, like a studio designer, instead of asking for a code change and a rebuild.
So a number or rule someone might want to change is **data with a tool**, never a bare constant, and any setup you'd need
twice is **one command**. Build these for the game at hand, in whatever form suits it.

## Tunable numbers

- Each tunable is declared once, with an id, group, name, unit, range, step, value and a plain description citing where it
  came from. The range is what's sane to play, not what compiles.
- Read it by id, with a fallback, at the point of use, so a change shows at once. If it only applies at load, say so.
- Unit tests guard the file: values clamp, entries are complete, unknown ids fall back.
- **In the game:** a dev-only panel lists every tunable by group with minus, value and plus; clicking the value resets it. A
  save writes only what differs, with the time and game day, read on top of the defaults in later games.
- **Taking the user's tuning:** when they say so, show what would change in plain words, fold it into the defaults, then
  check and commit. Say what changed, and mirror design numbers on the design page.
- **Scripted runs ignore personal tuning,** so a test measures the shipped defaults. Keep that rule for anything that persists.

## Dev toggles

A developer view (paths, forecasts, fog off, forced weather or time) is a console variable plus a row in the panel, saved
between runs. The same variable works in scripts, so one switch serves both. Dev views stay off for playtests unless asked.

## Rules as data, with an editor

Generation and check rules live in a data file that both the generator and the checker read. An editor shows them, previews
each change and saves with history. The preview runs the real code in a separate process, so what the user sees is what
ships and a crash can't kill the editor. Copy this pattern for any rules-heavy system.

## One command per test setup

If a test or shot needs more than a few lines of setup, write a command and use it everywhere: scripts, tests, the console.
Give it help text, log what it did, pick things by rule, place them by the player's rules and clear strays, so it's
deterministic. Keep it out of shipping builds. Useful ones: every asset side by side on a flat floor, one thing at a chosen
spot and state, fixed camera spots, plenty of resources.

## Test levels (every game has them)

A screen in dev builds lists every 3D test as a grid of pictures: hover for more, click to load. Picking one reopens the map
with that test's setup at normal speed, with the camera on it, and the game stays open. A bar shows pass or fail with Run
again, back to the list, and Leave. New tests appear by themselves. See `ue-test-gate`.

## In-game debug windows

New developer UI belongs in a dev-only overlay, not the player HUD. Check how it's kept out of shipping by searching the
shipping executable, because an always-on helper module once left it inside.

## A dashboard

Every tool should write its results as data, so one local page can show the last check, test history, and tickets.

## Related skills

`ue-test-gate`, `ue-scripted-runs`, `procedural-map-rules`, `living-design-doc`, `studio-operating-model`.
