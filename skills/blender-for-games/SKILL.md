---
name: blender-for-games
description: Headless Blender for game art - procedural props built from primitives, cleanup and prep of generated models to real size with the right pivot and facing, vertex-colour masks (team colour, wind sway and so on), derived models such as construction stages, export for Unreal and look renders for review. Use this whenever a fix needs the model itself changed (a mask, proportions, a missing part, splitting or cutting a mesh, a pivot, UVs), when a new small prop is needed, when a downloaded model must be prepared for the engine, or when you are tempted by a workaround that avoids touching the art (a marker beside an object, a shader guessing at parts, stretching a mesh to fit). Do the real work in Blender instead.
---

# Blender for game art

When the model is wrong, change the model. A marker on a pole beside an object was rejected as a workaround; painting the
right parts into the model is what stuck. Cheap detours look cheap in playtests and cost a second round. If an engine limit
really forces another route, say so and name the proper option and its cost.

Every change is a script run headless, so it can be re-run on every model and on the next game. Write them for the installed
Blender version, and check its docs when a call fails, because the API changes between versions.

## How to run it

- Run with no window and factory settings, so a run is the same everywhere.
- Start from an empty scene. Use absolute native paths.
- Print one tagged line per output (size, triangles), so a batch can read it, and one summary line per model.
- Re-running must give the same model: seed any randomness.

## Conventions the engine expects

| Thing | Rule | Why |
|---|---|---|
| Units | metres, exported so they import 1:1 | no per-instance scale fixes |
| Up / forward | Z up, the model faces the engine's forward | placement and animation agree |
| Pivot | where the game places it: bottom centre for ground objects, the grip for held tools | the game places by the pivot |
| Size | real world size, uniform scale only | the scale check must report 0 |
| Transforms | applied before export; joined to one named mesh | names become asset names |
| Materials | one per real surface | the import makes one slot each |

## Prepping a generated model

Generated models arrive about one unit long, centred, in several parts, with stray bits.

1. Import, join, clear parents, apply transforms, delete leftover empties.
2. **Weld first.** Exports split vertices at every UV seam, so without welding every UV island counts as a loose part.
3. Drop tiny loose islands.
4. Turn it the right way, scale by footprint or by height, move the pivot.
5. Export and print the final size and triangle count.

Keep cuts optional per model. A cut that suits most models took important parts off others.

## Vertex-colour masks

A mask is data for a material, painted per face corner. Write each channel's meaning in the script and in the material that
reads it. Rules come from geometry (normals, height, distance from a root), so transform normals to world space first and
keep thresholds at the top of the script. They come from looking: the first threshold usually misses a case.

## Look renders: check before you import

Every script writes a picture next to its output, and you look at it before anything goes into the engine: a simple lit
three-quarter view for props, and a flat view of the mask from the gameplay camera's angle for masks. A good Blender render
is not proof, so then see it in the game.

## Derived models

Build new models from the finished one, so they share its origin and texture and the game can swap them in place. New
pieces can take UVs from patches of the model's own texture, so they need no texture of their own.

## Traps

- Adding a duplicate face raises an error; catch it per face, or build poles as triangle fans.
- Recalculate normals after building a mesh by hand. One-sided pieces need a two-sided material.
- Apply scale before a bevel, or the bevel stretches with the object.
- **Never stretch to fit.** Fit uniformly; if proportions are wrong, fix the geometry.
- Weld before counting islands, and check the printed size against the real size.

## Related skills

`ue-asset-import`, `ue-scripted-runs`, `ue-test-gate`, `studio-operating-model`.
