# Dev Hub

One local page for a game's health. It reads only what the game's scripts and tests write; nothing is
entered by hand.

```
node devhub/hub.mjs "<game folder>"        # then open http://localhost:7350  (PORT=… to change)
```

| Page | What it shows | Source |
|---|---|---|
| Today | the last full gate run, the last nightly (steps, soak, frame rate, files), new failures since the night before, the frame-rate trend, the night's audit shots | `Saved/Playtest/tests-*.json`, `Saved/Nightly/<date>/` |
| Tests | one row per scenario test, one coloured cell per run (newest right); hover for the message, click for that run's report | `Saved/Playtest/tests-*.json` (last 40 runs) |
| Nightlies | every night: status, build, gate result, soak day, fps, failure keys, links | `Saved/Nightly/*/summary.json` |
| Linear | counts by state, open issues by area and milestone, the review queue, what's in progress (read-only snapshot) | `Saved/DevHub/linear.json` |
| Start here | a card per tool (what for, how to open, three tasks), the keys, the console commands | `Tools/tools_guide.json` (studio.json `toolsGuide`) |
| Mechanics | every tunable on a map of the game's systems (what feeds what); edit with live apply, reset, undo, presets, history, "make default" | `Config/Tuning.json`, `Config/Systems.json` (studio.json `tuning`, `systems`); writes `Saved/TuningChanges.json`, reads `Saved/TuningNow.json` |

The Mechanics page is the one page that writes: to `Saved/TuningChanges.json` (the same file as the game's own DEV
panel, which a running dev build applies within half a second), `Saved/TuningHistory.jsonl`, `Saved/TuningPresets/`,
and, only on "make default", the value in `Config/Tuning.json` itself.

The hub never calls Linear (no API key on disk). The morning triage task, or any session with the Linear connector,
saves the project's issues and runs `node devhub/linear_snapshot.mjs "<game folder>" <issues.json>`.

Evidence files are served read-only from the game's `Saved/` and shots folders only (`/files/<path>`).

Later pages (each its own ticket): Perf, Art (screenshot diffs and ratings), Assets, Playtests, Builds and crashes.
