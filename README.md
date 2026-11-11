# Indie Couch Studio Toolkit

How Indie Couch Games makes games: the studio's skills, shared tools and the Dev Hub, kept apart from any one game.
The skills are game agnostic and high level: they say what's needed and why, and the agent writes its own tools.

They come from building a AAA RTS in Unreal Engine 5 and C++, with one person directing and AI agents (Claude Code)
doing the hands-on work: code, art, animation, testing and delivery. They change as we learn. Feedback is very welcome:
open an issue with what's missing, wrong or worked differently for you.

## The skills

| Skill | What it covers |
|---|---|
| `studio-operating-model` | The house rules for how the studio makes games with an AI agent, for any game |
| `new-game` | Starts a new game of any genre the studio way, in Unreal Engine and C++ |
| `ue-test-gate` | The test workflow for an Unreal C++ game: unit tests, headless runs, 3D test levels, a quick check on every commit |
| `ue-scripted-runs` | How the agent sees an Unreal game for itself: scripted runs and screenshots |
| `ue-dev-tools` | The dev tools a game needs so you tune during playtests instead of asking for rebuilds |
| `ue-asset-import` | Scripted import of models, textures and materials into an Unreal project |
| `art-direction-gates` | How a game gets its look without wasting your time: one target frame, art in layers, an approval gate per layer |
| `tripo-studio` | Approved concept images to textured, game-ready models with Tripo Studio |
| `blender-for-games` | Headless Blender for game art: procedural props, cleanup and prep of generated models |
| `character-and-animation` | Rigged game characters and animation clips that pass the checks |
| `game-audio` | How to make and check a game's sound |
| `strategy-game-ui` | UI for strategy and other UI-heavy games |
| `procedural-map-rules` | Generated maps driven by rules kept as data, with a check that must report 0 violations |
| `playtest-to-linear` | A recorded playtest into triaged Linear tickets |
| `linear-delivery` | The ticket lifecycle in Linear for studio work |
| `living-design-doc` | Keep the game's design page in step with the build |

## Layout

| Folder | What's in it |
|---|---|
| `skills/` | Claude Code skills: how we work, for any game. They say what is needed; the agent writes its own tools |
| `tools/` | Shared scripts, usable as examples. A game can write its own instead |
| `templates/` | `studio.json`, the small project file tools read |
| `devhub/` | The Dev Hub: one local page for builds, tests, assets, playtests, performance and Linear |

## Each game's `studio.json`

A game points the toolkit at itself with a `studio.json` at its root (see `templates/studio.json`): the engine,
the project file and editor target, the default map, where its scripts and shots live, how it stamps a build ID, its
test commands and its Linear project. The tools read it, so the same tool works for every game.

## Install (Claude Code)

```
claude plugin marketplace add rmoubayed/indiecouch-skills
claude plugin install indiecouch-studio@indiecouch
```

From a local clone: `claude plugin marketplace add <path to this folder>`.

## Tools

- `tools/ue/run_script.ps1 -Game <game folder> -Script <script> -Out <folder> [-Build] [-ResX] [-ResY]`: runs a
  debug script in a standalone game (editor closed), files every `Shot` under the game's shots folder by
  the `# name` line before it, and stamps the build ID first.
