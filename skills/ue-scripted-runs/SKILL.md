---
name: ue-scripted-runs
description: How to see an Unreal game for yourself when asked - a script of timed commands run in a standalone game, screenshots filed by name, fixed camera spots, rating each shot against the target frame, pulling frames from a recorded playtest call - and how to hand the game to the playtester. Use this when the user asks you to check something visually, take gate or evidence screenshots, or says "run it", "launch it", "build and run", "I want to test" or "show me". By default the user judges visuals in test levels, so use this when asked or at an art gate.
---

# Scripted runs and launching for the player

You can't see the game unless you run it and take pictures. A scripted run is a standalone game that reads a script, runs
timed commands, takes screenshots and quits. Use it when the user asks or at an art gate; day to day, deterministic tests
prove the logic and the user judges the look (see `ue-test-gate`).

## What a run needs

Build a small runner for the game that:

- stamps a build ID, so a shot says which build it came from;
- takes a script of lines: a command at a game time, a command at a real time, named shots, options such as skipping the
  start screen or using a flat floor;
- starts the game, waits, removes the script afterwards so it never drives the user's game, and files shots by name.

Build first if code changed; a run on old binaries proves nothing. After an art rebuild, check the timestamp or log first.

## Rules that cost hours when broken

- **Never open a pause menu in a script.** Game-time lines stop with the clock and the run stalls. Use real-time lines.
- **Always end with quit,** and put a time limit on the wait.
- Give each shot a second or two after a camera move, or motion blur and half-open menus make false bugs.
- If you're writing ten lines of setup, add a command instead (see `ue-dev-tools`).

## Look at every shot and rate it

Open every shot. Rate it 1-10 against the target frame: can you tell what everything is, is anything floating, buried,
stretched, clipped by the UI? Crop and zoom on anything doubtful. Every issue is a ticket unless it's the one you're fixing.
For a set of models or states, make a labelled contact sheet.

## Frames from a recorded call

The recording runs about 40-60 s behind the transcript clock, so pull a few frames around the moment and crop to the game.

## Hand the game to the playtester

When the user says "run it" or "I want to test": ask before closing a game they may be playing, build, launch at their
resolution in front, and tell them what to look at, including which test level to open.

- Check before handing over, not after.
- **Never leave a game you started running** while you still have changes to make. It blocks builds.
- Launch from a shell that doesn't rewrite engine paths.

## Related skills

`ue-test-gate`, `ue-dev-tools`, `art-direction-gates`, `playtest-to-linear`, `linear-delivery`.
