---
name: linear-delivery
description: The ticket lifecycle in Linear for studio work - make a ticket before starting, keep only the active one In Progress, finish with a comment and evidence, send verified fixes straight to Done and only look-and-feel or open design calls to review, pause with a WIP note, reopen with the quote, and upload images through the signed-upload flow. Includes the setup for a new game project. Use this whenever you start, pause, finish or hand over any piece of game or studio work, file a bug you noticed, attach a screenshot to a ticket, or set up Linear for a new game. If you are about to write code with no ticket In Progress, stop and use this first.
---

# Delivering work through Linear

The board is how the user sees what you are doing, often from their phone while you work alone. If the board is wrong, they
are blind. Each game has its own project, and the studio's tooling has one too.

## The lifecycle

1. **Ticket first.** Every piece of work gets a ticket before you start it, including bugs found in passing. Search first.
2. **One In Progress.** Nothing else may be In Progress. Switching tasks means pausing the old one first.
3. **Work it:** say what done means, write the test with the fix, run the check (see `studio-operating-model`).
4. **Finish with evidence:**
   - a comment: what changed, the commit, how it was checked, and what to look at in the test level;
   - test output, or a screenshot if the user asked for one or it's a visual result;
   - **Done** if it's verified with full confidence. **Needs Human Attention** only for look and feel or an open design
     call. Filling the review column with proven fixes buries the few tickets that need the user.
5. Cite the commit **after** committing. A comment citing a commit that never landed is worse than none.

## Pausing, blocking, reopening

- **Pause:** comment what's done, what's left, where uncommitted files are and the next step, then move it back to Todo. The
  next session must be able to pick it up from the note alone.
- **Blocked on the user** (a login, money, a taste call): comment exactly what's needed, move it to review, take the next
  ticket. Don't wait.
- **Reopen:** when a playtest shows a ticket isn't fixed, move it back to Todo with the user's words and the moment. Never
  make a new ticket for the same problem.

## A good ticket

- **Title:** the problem as the player sees it, not the code fix.
- **Description:** what happens, what should happen, the steps or the playtest quote with a link, and a frame.
- **Labels:** one type (Bug, Feature, Improvement) and one area for the game.
- **Priority:** 1 is a crash, data loss or a blocked playtest; 2 is a playtest's main complaints. Add a milestone.

## Attaching an image

Linear wants a signed upload; a local path in markdown won't show. Prepare the upload with the exact byte size, PUT the raw
bytes within about a minute sending **every** returned header verbatim (casing included), then create the attachment. A 503
on that last step is common, so retry; the file is already stored. Crop to the part that matters first: a full frame hides
the bug.

## Setting up a new game project

A project named after the game with a one-paragraph description and the design doc link. Milestones with written exit
criteria, from first playable to release. Area labels fitted to the game, reusing what exists.

## Related skills

`studio-operating-model`, `playtest-to-linear`, `ue-test-gate`.
