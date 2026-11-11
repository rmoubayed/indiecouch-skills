---
name: playtest-to-linear
description: Turn a recorded playtest and notes filed in game with the note key into triaged Linear tickets - fetch the Fireflies transcript and screen-share video, pull frames at the moments the user points at, write one ticket per point with the quote, a timestamp link, a frame, type, area, priority and milestone, cross-check the review column (reopen or confirm), and summarise in a table. Use this whenever the user says "check Fireflies", "check f8s", "I recorded a call", "transcribe my playtest", shares playtest notes or a voice memo, or finishes a playtest session, even if they only say "check it". Also use it to triage feedback from any tester.
---

# Playtest to Linear

The user playtests in a recorded Google Meet with the Fireflies notetaker, sharing the game and talking through what they
see, and presses the note key (F8) at moments that matter. Your job afterwards is a short triage: every point becomes a
ticket they can recognise, with the evidence attached, and nothing they said is lost. Every game has both from the start
(see `new-game`).

## 1. Get the call

Find the newest call and its transcript. If it's missing it may still be processing, so say so and check again. **Work from
the user's own transcript sentences, never the AI summary, and quote them back.** Downloading the video needs the user's yes.

## 2. Read it as a list of points

Write down every distinct point with the user's words and timestamp: a bug, a complaint, a wish, or a "this is nice" (praise
says what not to break). Merge repeats and keep the clearest quote. Leave out what isn't about the game, and mention it in
the summary. "Look at this" means a frame is needed.

## 3. Pull frames

The recording usually runs 40-60 s behind the transcript clock, so pull a few frames around each moment and keep the one
that shows it. Crop to the game. The user's own screenshots are better when they exist.

## 4. Cross-check the review column first

For each point:
- It's about a reviewed ticket that **isn't fixed:** reopen it with the quote and frame.
- The user confirms a fix: move it to Done, quoting them.
- Otherwise it's new.

## 5. File the new tickets

One ticket per point (see `linear-delivery`): title in the player's terms, the quote, a timestamp link, what should happen
instead and the frame. The things they dwelt on or repeated are priority 2; crashes and blockers are 1. If two points share
a cause, file both and link them, because the user tests them separately. Name the test level that reproduces it if one
exists, or add one.

## 6. Report back

A table, newest first: ticket, what the user said, type and area, priority. Then reopened and confirmed tickets, the
non-game items, and which ticket to start with and why. Keep it short.

## Notes filed in game

One key press takes a screenshot with the UI, saves the game, and records the build, seed, time, speed, camera and selection
plus the last seconds of the log, then asks for a one-line comment and a mood. Triage them with the call, in the same pass:
list the notes not yet filed, cross-check them, draft one ticket each with how to reproduce it from the save, attach the
cropped shot, and mark each as filed so it isn't filed twice. An empty comment still counts: title it from the shot.

## Deep testing

For a long session, the call and the note key work together. Triage both in one pass, and make each ticket name the level
or save that reproduces it.

## Related skills

`linear-delivery`, `ue-scripted-runs`, `studio-operating-model`.
