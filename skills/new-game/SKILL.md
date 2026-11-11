---
name: new-game
description: Starts a new game of any genre the studio way, in Unreal Engine and C++ - the project and repo, a three-tier test workflow (unit tests, headless runs, 3D test levels the user picks from a picture grid in game), a quick check enforced on commit, in-game tuning, a note key for playtests, the recorded-call playtest loop, Linear and a living design doc. Use this whenever the user starts a new game or prototype, says "new game" or "new project", asks to set up a repo for a game, or starts a session in a folder with no game in it, even if they only describe the idea. Read it before writing any code for a new game.
---

# Starting a new game

The studio makes games in Unreal Engine and C++, and every game gets the same workflow whatever its genre. What the game
is belongs to the user. This skill makes sure the machinery around it exists from day one, because adding it later costs
weeks of slow testing.

This skill says what's needed, not how to write it. Write the tools yourself in whatever suits the engine version and the
job, and improve on what came before. Check whether C++ in the game is better before reaching for an outside script.

## First, read the studio rules

`studio-operating-model` (who decides what, how to report, safety) and `ue-test-gate` (the test workflow). They apply from
the first commit.

## Set up, in this order

1. **Ask only what's truly the user's:** the name, the one-line pitch and what the player does. Decide the rest and say why.
2. **Project:** a C++ project in its own folder and git repo, on the current engine version.
3. **Off-machine copy:** a private remote with large-file storage for binaries. The user approves anything outward.
4. **A small project file** naming the engine, project, default map, scripts folder, shots folder, Linear project and
   design doc, so tools work from it (see `templates/studio.json`).
5. **Linear:** a project with type and area labels and milestones (see `linear-delivery`).
6. **Design doc:** a published living page (see `living-design-doc`).
7. **The test workflow, before the first mechanic** (see below).
8. **Dev tools early:** tunables in data with an in-game panel, a dev overlay kept out of shipping builds, and a note key
   (see `ue-dev-tools`, `playtest-to-linear`).
9. **First playtest** as soon as anything is playable. The user plays a lot and names gaps; change them without asking much
   while it's a first draft.

## What every game must have

Build all of these, in whatever form fits this game:

- **Its own test levels.** One tiny 3D scene per mechanic of this game: a jump arc, a boss phase, a drift, a door puzzle, a
  crowd through a gap. They're 3D unit tests. In dev builds the player can open a grid of them from the menu, each with a
  preview picture and more detail on hover, click one to load it, and see pass or fail with a way to run it again or leave.
  New tests should appear in the list by themselves, and the whole screen must stay out of shipping builds.
- **A way to describe a scene as data,** so adding a case takes minutes: what's placed, what's ordered, what counts as done.
- **Unit tests.** Pure rules, seconds. Write each rule as a small function from the start, so it never needs a slow test.
- **Headless runs.** The real game logic with no window and no graphics, a few seconds a run, for scenes where the rule
  depends on real navigation, physics or actors.
- **A quick check** of at most a minute or two before every commit, enforced by a commit hook, with no window.
- **A full check** that runs everything, kept rare.
- **Impossible-state checks** running in every dev game.
- **Tunable numbers in data,** changeable while playing, with a way to fold the user's changes back into the defaults.
- **A note key:** one press in a playtest captures a screenshot, a save, the game state and a one-line comment.
- **Recorded playtest calls:** the user talks through a session on a call, and the transcript and video become tickets.

## Traps

- **Logic inside actors.** A rule buried in a running object needs a running game to test. Keep rules in small functions.
- **One long test game.** Tests sharing a world fail because of each other and take minutes. One scene per case.
- **Tests that only work in a window.** Prove headless works in the first week.
- **Test scenes built by hand.** Build scenes through the game's own code, and fail a scene as "set up wrong" before running it.
- **Unannounced long runs.** Say what's running, why and how long, before starting anything long.

## Related skills

`studio-operating-model`, `ue-test-gate`, `ue-dev-tools`, `ue-scripted-runs`, `playtest-to-linear`, `linear-delivery`,
`living-design-doc`, `art-direction-gates`, `tripo-studio`, `blender-for-games`, `ue-asset-import`, `game-audio`. Only if the
game has them: `strategy-game-ui`, `procedural-map-rules`, `character-and-animation`.
