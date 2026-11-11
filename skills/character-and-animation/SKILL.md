---
name: character-and-animation
description: How to make a rigged game character and animation clips that pass the checks - an A-pose front image with tools held clear, a single-image Tripo model, Smart UV and texture, a back-of-head face test, rigging on the Tripo page, variants on one shared skeleton, and where clips come from (Mixamo through the page's API, custom clips from a video-to-mocap route, simple loops keyed in Blender), plus clip checks for sheets, foot slide and loop seams. Use this whenever a game has characters or creatures and you add or remake one, a rig, a loadout or an animation clip, when a character tears, has a face on the back of its head, slides its feet or pops at a loop, or when someone suggests an animation tool (check the licence here first).
---

# Characters and animation

A character is only done when it passes three tests the eye misses: no face on the back of the head, no mesh tearing when
the rig bends, and feet that stay put when it walks. Each step exists because skipping it once cost a full remake. Script
everything headless, so the pipeline runs without a click per asset.

**The user signs in to every service themselves. Never enter credentials.** Then script the signed-in page.

## 1. Make the character

1. **Front image.** The approved concept, or an edit of it, in a clean **A-pose, hands open, arms clear of the torso, tools
   held clear of the body**. The auto-rig skins anything touching the body to the wrong bone. Edit prompts start by keeping
   the exact character and list all the gear, or the editor invents a different person.
2. **Single-image model, not multiview.** Generated back views drift, and multiview sets are where twin faces came from.
3. **Smart UV first, then texture** in image mode at 4K with Remove Lighting on (see `tripo-studio`). Saving new UVs wipes a
   texture, and baked light fights the engine's lighting. Look before exporting: a texture can fail silently.
4. **Check for a face on the back of the head before rigging,** because rigging costs credits. Render the head from behind
   and run a face detector; also look yourself, because detectors miss strange faces.
5. **Rig on the Tripo page** with the preset for your engine's skeleton, and **stay on the page** until it finishes; leaving
   cancels the job.
6. **Finish:** prep to real height, then run a pose test that bends the rig and counts stretched or collapsed edges as tears.
7. **Import** (see `ue-asset-import`).

**Variants:** several meshes for one role share one skeleton, so they share every clip.

## 2. Where clips come from

Pick the cheapest source that fits. **Never a generic stock clip that doesn't fit the role.** Each role moves its own way;
stock presets are for rig stress tests only.

| Need | Source |
|---|---|
| Idle, walk, run, simple poses | keyed in Blender by script |
| Common locomotion, combat, deaths | Mixamo |
| Specific work Mixamo lacks | a start frame from our own character, a video generator, then video-to-mocap |

**Licences:** the games are commercial, so check the licence of any tool before the first test, not after the batch.
Non-commercial weights are out, however good they look. **Don't propose a tool that needs a human click per clip.**

**Mixamo:** the signed-in page has its own API, usable from page JavaScript: search, export, poll, download. Download links
expire within minutes. Wait for a **new** job id, or you fetch the previous clip. Retarget from its T-pose rest onto our rig.

**Custom clips:** render the start frame from our character with the prop the motion depends on in frame, because prompts
alone place props wrongly. Keep tokens inside the page; never copy them into a file or a message. If a take fails twice,
make a new video rather than trying a third time. Track credits before a batch.

## 3. Clip checks (every clip, every source)

- **A sheet of frames first:** catches feet through the floor, arms through the body, a clip facing backwards.
- **Measure:** foot slip, jitter, loop seam and tearing, with pass marks. The planted-foot speed is the speed to move the
  character at, so feet don't slide in game.
- **Loops:** find the best matching start and end poses and ease the seam, skipping any walk-in.
- **In the engine:** an automated check that feet are on the ground and the character faces its move.

## Traps

- A weapon touching a leg gets skinned to the leg. Fix the front image, not the rig.
- Video-to-mocap output often starts in a rest pose and faces its camera; handle both when retargeting.
- Check the plan: the better mocap models may need a paid tier.

## Related skills

`art-direction-gates`, `tripo-studio`, `blender-for-games`, `ue-asset-import`, `ue-test-gate`, `studio-operating-model`.
