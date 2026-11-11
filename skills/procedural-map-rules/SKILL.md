---
name: procedural-map-rules
description: For games with a generated world or map - the map comes from rules kept as data that both the generator and a map check read, the check must report 0 violations, a live rules editor with preview and history, world rules such as dry level sites and graded roads, ground the game can dig, and real-world scale. Use this only when the game has procedural or rule-driven maps, for any map generation, terrain, road, river, layout, placement or earthworks work, when the user asks to change how the map looks or plays, when something floats, sinks, sits in water or on a slope, or when a map rule needs tuning. Read it before editing a generator or terrain code.
---

# Procedural map rules

A map is not eyeballed into shape. It's generated from rules, and the same rules are checked, so a building in a river or a
road into nothing fails the build like a failing test. The user tunes the rules themselves in an editor; you keep the
generator, the check and the game agreeing.

## The shape of it

- **Rules are data.** Every tunable number is a named rule with a range, a description of what the player sees, and its
  source. Both generator and check read it. A bare constant in the generator is a bug waiting to be tuned in code.
- **A generate, check, write pipeline.** It writes even on violations, so you can look, but it fails. Violations must be 0.
- **A check in game too,** against the live ground, because what's drawn can differ from the data.
- **Each violation names the spot** and a sentence a person can act on.
- **Template rules:** let the user add rules with no code ("keep X at least N m from Y", "at most N X near Y").
- **An editor:** every rule with a slider, the map redrawn a moment after each change with its violations, and a history of
  every save. The preview runs the real generator and check in a separate process, so what the user sees is what ships.
- **Seeded:** one seed gives one map, byte for byte, with a check that proves it.

## World rules worth guarding

Adapt these to the game:

- Sites are dry and level, and clear of hazards.
- Roads are graded, end somewhere, and have no stubs, jogs or sharp bends.
- Crossings are straight runs with a bridge placed exactly there.
- Shores slope to the water, with no stepped banks and no dry ground under the surface.
- Competing start positions are fair.
- Generator rules leave a margin above the check's limit, so the check guards a margin instead of fighting the generator.

## Ground that changes

If the game digs or levels ground, draw it as your own mesh so it can change.

- A pad is a level floor from the ground before any digging, so it doesn't drift, then banks back to the terrain.
- Overlapping pads share a floor; two floors in one overlap leave something in the air.
- Banks keep off roads, other pads and protected places.
- Things on dug ground move with it. Earthworks are saved, replayed on load, and reset at each game start.
- Hidden terrain must have its collision removed, not just switched off, or it comes back.

## Traps

- **A stale report.** Read a check's output only after a run that really ran it.
- **Floating is measured against what's drawn,** not the height data.
- **Path search limits.** Long paths can come back partial at engine defaults; raise the search limit and use costs for
  danger zones, not obstacles.
- **A fix in one place only.** The generator, check, placement rules and in-game check must agree.
- **More is not denser.** Density is often capped by something else; a bigger radius only scatters things.

## Related skills

`ue-test-gate`, `studio-operating-model`, `ue-scripted-runs`, `linear-delivery`.
