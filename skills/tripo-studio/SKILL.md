---
name: tripo-studio
description: How to turn approved concept images into textured game-ready models (and make concept and UI images) with Tripo Studio from the browser - the user logs in, you drive the page, keep about 10 jobs in flight in small batches, use Regenerate for variants, and follow the fixed pipeline (geometry only at 80k, Smart UV then Save, 4K texture with Remove Lighting, export GLB) - plus which image model to pick and the traps (the safety filter, toggle buttons that switch off on a second click, jobs that silently never start, the age pop-up). Use this whenever you generate, regenerate or upscale an image with Tripo, model, unwrap, texture or export anything in Tripo, upload a reference, count credits, or when a job fails, never starts, or exports grey. Read it before opening Tripo, even for one image.
---

# Tripo Studio: concepts to textured models

Tripo turns one concept image into a mesh, unwraps it and paints it. The concept must already be approved by the user (see
`art-direction-gates`); Tripo is never where the look is decided.

## Ground rules

- **The user logs in themselves.** Never type a password, read or print an API key, accept terms, buy credits or click a
  plan upgrade. If the page shows a login, a bot check, an age pop-up or a payment screen, stop, say exactly what's needed,
  and do other work meanwhile. Never click the age pop-up. Never bypass a bot check.
- **Use the Studio pages in the browser, not the API.** Studio credits and the API wallet are separate.
- **Pacing: about 10 jobs in flight, in batches.** Send a batch, check the results, send the next; never queue a long run.
  The user complained about flooding when 36 went back to back. Space image submissions about 9 s apart. Check the plan's limit.
- **Image generation costs credits.** Count it in the report.
- **Downloads need the user's OK,** per file or for a named batch.
- Record the model id per asset, and credits per gate.

## Images

Set 4 images and 16:9 for frames.

- **New variants: click Regenerate on the image's card. Never re-prompt with a Tripo image as the reference, and never
  re-upload one** ("it will create variants"). Image-referenced upscales also tripped the safety filter.
- **Safety filter:** keep the first prompt short and plain for assets, without combat or game framing. Change the image
  rather than touching the age pop-up.
- **Toggle trap:** aspect and count buttons switch **off** on a second click. Read which is selected first.
- **References:** two work, scene first, style second. Check only the intended ones are attached before each submit.
- **Which model:** compare what's on offer for your need. In past tests, the newest GPT Image model was best for UI (clean
  text, respected layout), and Nano Banana suited asset concepts but invented numbers in UI. Re-test as models change.
- For a contact sheet, fetch result URLs as blobs into a canvas, because drawing the image directly taints it.

## The model pipeline

The settings are fixed; deviating has cost a rework every time. Read the cost on the button, and stop if it's unexpected,
because a different cost means a setting is wrong. Report credits at every gate.

1. **Model:** upload the concept, **geometry only** (texture off), Ultra Mesh off, **80,000 faces**. Smart UV only accepts
   80k triangles or fewer.
2. **Smart UV:** Unwrap UV, wait, then **Save**. Saving wipes textures, which is why UV comes first.
3. **Texture:** **Remove Lighting on, 4K.** Both reset on every visit, so set them each time. Baked light fights the engine's.
4. **Check it really started:** the page must show it generating. A lit button on a grey model means nothing is running.
5. **Look before exporting:** a texture can fail silently and export grey.
6. **Export GLB** with a clear name, then wait; exports can take minutes.

Characters differ: see `character-and-animation`.

## Many assets

Write yourself small page helpers, one per step, that check their preconditions and return a short status. A helper should
refuse rather than spend when a cost isn't the expected one. Signed links to concepts expire, so refresh them. Stop a batch
on anything unexpected.

## After Tripo

Prep in Blender (see `blender-for-games`), import with the editor closed (see `ue-asset-import`), then run the scale check.

## Related skills

`art-direction-gates`, `blender-for-games`, `character-and-animation`, `ue-asset-import`, `studio-operating-model`.
