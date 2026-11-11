---
name: living-design-doc
description: Keep the game's design page (a published artifact) in step with the build - after a design decision lands in code, read the live page, change only what changed plus one changelog entry, check it still runs, and republish to the same URL with a short label. Use this whenever a change alters what the design says (costs, times, rules, content, the opening, systems), when a playtest decision is implemented, when the user says "update the artifact", "keep the design in sync" or "add a draft", and at the end of any batch of design work before reporting done. A design change that is in code but not on the page is not finished.
---

# The living design doc

The design lives in one page the user reads and shares, not in the code. When the build and the page disagree, the next
decision gets made on wrong numbers. So every design change that lands in code is mirrored on the page, in the same session,
as part of "done". The page's link is recorded in the game's project file.

## When a change counts

Mirror anything a designer would read: a number, a rule, the opening, a system's text. Pure code quality, art swaps and bug
fixes that restore the written design need no draft. If unsure, mirror it: a changelog line costs little, a stale page costs
a wrong decision.

## The update

1. **Read the live page,** never an old local copy. The user may have edited it since your last publish.
2. **Look before you cut.** Design pages can hold huge embedded images. Inspect structure without printing them; they fill
   the context and tell you nothing.
3. **Change only what changed,** with a small script rather than rewriting the file, and add one changelog entry.
4. **Check it still runs** before publishing. One stray quote can blank the page for everyone, and publishing won't catch it.
5. **Republish to the same URL** with a short label, and say which draft went up.

Why these rules exist:

- **Never round-trip huge embedded data through an edit.** It's slow, can truncate, and one wrong byte breaks every picture.
- **Strip any wrapper the host added when you read it,** or publishing nests a page inside a page.
- **One changelog entry per draft,** newest first, each item one decision in plain words with its reason or the playtest
  quote. Batch a session's decisions into one draft.
- **Same URL.** The user has shared the link; a new URL orphans it.

## Code and page stay one source

If the game's data is generated from the page, or both hold the numbers, change a number in one place and mirror it in the
same session. Regenerate only from a freshly read page, and check the diff shows only what you meant: an old copy rolls back
every direct edit. Mirror the design value, not an exported or scaled one.

## Writing for the page

Plain English for a designer: what the player sees and why, no class names or file paths. Name the playtest or ticket when a
decision came from one.

## Related skills

`studio-operating-model`, `ue-dev-tools`, `linear-delivery`, `playtest-to-linear`.
