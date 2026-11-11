---
name: ue-test-gate
description: The test workflow for an Unreal C++ game of any genre - deterministic unit tests, headless runs in seconds, 3D test levels the user picks from a picture grid and validates, a quick check on every commit, a rare full check, impossible-state checks, flakes and long runs left to the nightly. Use this for ANY testing question, when fixing a bug, writing a test, committing, handing a build to the user, or when a test fails or flakes. Read it before writing a test or running one.
---

# The test workflow

Every fix comes with a test, but the agent doesn't sit watching a game to prove it. Deterministic checks prove the logic in
seconds, and the user judges look and feel in the 3D test levels. "This testing loop is just too slow" is why it's shaped
this way. Write the scripts this needs in whatever language suits the job.

## The loop

1. Write a deterministic test for the rule that broke, and fix until it passes.
2. Hand over naming the **test level** to open. The user validates there.
3. Drive levels or take screenshots yourself **only when the user asks**. Look and feel is theirs.
4. Before anything long, say what's running, why and how long. Don't start a run of everything unasked.

## Tiers

| Tier | What | How long |
|---|---|---|
| Unit | pure rules, pulled into small functions | seconds |
| Headless | real navigation, physics or actors, no graphics, one mechanic | seconds a run |
| Test levels | the same scenes in 3D, picked from a grid in game (dev builds) | the user's eye |
| Short real-level checks | only what needs the real level: nothing floating, real sizes, places reachable | a minute or two |
| Impossible states | things that must never happen, checked in **every** dev game | always on |
| Long runs | slow build-up only: leaks, stuck actors, a world grinding down | overnight |

Headless is worth it only when it can catch a real bug. It's for logic: anything reading the drawn UI, the screen or a
screenshot needs a window.

## The checks

- **Quick check, every commit:** the data checks, a build and the unit tests. Well under two minutes on a small change, no
  window. A hook refuses commits of game code, content or config newer than its last pass. Changes that only touch comments
  need no check.
- **For a build the user tests:** the quick check plus the headless tests of the system that changed.
- **Full check, rarely:** before a build leaves the studio, when asked, or after big changes across many systems. Say so
  when you run it. Keep it to a few minutes.

## The commit rule

- An edit after the check makes it stale: check last, then commit at once.
- Never bypass the hook. If a check is red, that's the work: fix it before anything else.
- A running game blocks a build. Ask before closing a game the user may be playing.
- Read the result of **this** run. A report left by an earlier run once made "0 problems" a lie. Check the time or build ID.

## Test levels: 3D unit tests

Every game has its own: one tiny scene per use case, listed by themselves, each with a picture on a grid. Tests that build
on each other load as one level, and anything a test needs first is declared with it, so each level works alone. Make each
level's picture when it's new, not all of them at once; a run of everything takes a long time.

**Set the scene up correctly first, then test inside it.** A false failure came from walls standing side-on in a hand-built
scene. Build scenes through the game's own code, fail a scene as "set up wrong" rather than running it, and look at it. If
every scene passes but the bug persists in the real level, that is the finding: the cause is in what the scene leaves out.

## Writing tests

Group tests by system, so a change runs only its group while working.

- **Name the playtest or ticket** beside the test, so a failure says which promise broke.
- **Judge by evidence, not a proxy.** Measure what the player sees (the route's closest point, the lowest vertex against
  the ground), not something correlated with it (health, a flag, a timer).
- **Make the setup deterministic.** Pick things by rule, not "the first one found". Clear what could interfere: a test's
  worker was once killed by enemies near the spot, which looked like a broken mechanic. Place things by the same rules as
  the player, so nothing starts inside a wall.
- **Stop as soon as the result is in.** Don't sit out a fixed wait.
- **Pass alone.** A test that needs an earlier test's leftovers fails as a level.
- Report what was seen on pass **and** fail, and write results as data after every test, so a crash leaves what ran.
- A fixed time step and seeded randomness make two runs on one build the same.

For unit tests, compare floats with a tolerance, reset any state a test changes, and pull the rule out rather than
building a world to reach it. When a conversion drops part of what a slow test checked, say what was lost.

## Impossible states

Check, in every dev game, things that must never happen: negative stock, invalid positions, an actor stuck while tasked.
Log each kind once per actor with enough to reproduce it. Add one when a bug was an impossible state rather than a wrong
outcome. Keep them cheap, with thresholds normal play never trips; a flaky check is worse than none.

## When a test fails or flakes

1. Read the message and log of **that** run. Reproduce it alone.
2. Decide: game bug, test bug, or flake.
3. A flake is never re-run until green. Find the luck: a stray enemy, a teleport into a wall, a proxy, a race. Fix the setup.
4. If it can't be fixed now, quarantine it in its own group with a ticket. Never delete it quietly.
5. Two failed fixes means roll back and retry smaller. If a theory fails, say so and stop repeating it.

## Long runs and the nightly

Short targeted scenes find more than long automated runs, and real play finds the rest. Don't use a long run to check a fix.
The one thing only time finds is slow build-up, so that's a nightly job, with the clock fast-forwarded and at most 4x game
speed (large time steps create and hide bugs). Skip the nightly while a game is open. Report one issue per failure, and treat
a failure that passes on a rerun as a flake ticket, not a pass.

## Related skills

`studio-operating-model`, `new-game`, `ue-scripted-runs` (visual checks, when asked), `ue-dev-tools` (test setups),
`linear-delivery` (evidence in the ticket).
