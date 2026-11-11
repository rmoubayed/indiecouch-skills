---
name: ue-asset-import
description: Scripted import of models, textures and materials into an Unreal project - run with the editor closed, one folder per asset, 1:1 scale, vertex colours kept, no auto collision, material instances of script-built masters, per-object data, safe re-imports and reading the result back. Use this whenever a model, texture or material has to go into Unreal or be re-imported, when building or changing a master material by script, when an imported asset looks grey, untextured, wrongly sized or keeps an old texture, or when a commandlet run "succeeded" but nothing changed. Never import by hand in the editor's dialogs; script it.
---

# Importing assets into Unreal

Every import is a script, so it can be re-run for every model and for the next game. It imports, wires the materials, saves,
and logs one line per asset to compare with what Blender printed. Write it against the installed engine's API.

## Running it

- **Close the editor first.** It holds the packages, and a headless run saving the same asset fights it.
- Run with no dialogs, no window and no GPU. An import not marked automated opens a dialog and waits forever.
- Arguments with spaces in the path break easily; a small wrapper that sets them up is safer.
- **Judge the run by its results, not its console.** The console hides script errors and prints success regardless. Read
  this run's log, and check the asset's timestamp is newer than the run's start. An old report once made a rebuild look done.
- Never let one script rebuild another script's asset.

## What a good import sets

- **Scale 1:1,** meshes combined, no auto collision: art is visual only, and collision is a gameplay decision.
- **Vertex colours replaced,** or masks don't arrive and the material reads zero.
- **One folder per asset,** so mesh, texture and instance travel together and a re-import can clean up.
- **Textures:** correct colour space, and capped for small things.
- **Material:** an instance of the family's master, on every slot.
- **Nanite** where it suits; only things walked on keep their shape as collision.
- Save everything in the folder, and log size in metres, triangles and texture size.
- Skip what's already imported when run without names.

## Master materials by script

Families share one master; a model only gets an instance. Build masters by script, idempotently, rebuilding **in place**,
because deleting and re-creating one breaks every instance. Set usage flags when you create it; a mesh type without its flag
draws grey. Numbers a designer may tune are parameters.

**The pin-name trap:** connecting nodes by pin name silently skips a name that doesn't exist, the material compiles, and the
surface renders grey or at a default. Output names differ by node, so read the graph back after building it. Other causes of
grey: wrong sampler type and wrong coordinate width.

## Per-object data, not per-object materials

Use custom primitive data per actor, per-instance data for instanced meshes, and vertex colour per vertex.

## Re-importing

- Replacing a mesh can keep an existing texture, so a remodelled mesh gets painted with the old one. **Delete the folder's
  textures before re-importing.**
- An FBX with an embedded texture unpacks beside it and reuses a file already there. Clear that folder too.
- To change only a texture, import it alone over the existing asset's name.
- Skeletal meshes share one skeleton. Set material slots as fresh entries; editing the returned entries in place didn't stick.

## Verify after a reload

Saving is not proof. In a separate pass, load each asset, read its slots and source file, compare names and sizes with the
source, and export the texture to compare pixels. A name and path once matched while the asset held an older image. Then run
the scale check.

## Related skills

`blender-for-games`, `tripo-studio`, `ue-scripted-runs`, `ue-test-gate`, `studio-operating-model`.
