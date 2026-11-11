---
name: art-direction-gates
description: How a game gets its look without wasting the user's time - one target frame everything is judged against, art built in layers with an approval gate per layer, the user approving every concept image, readability from the gameplay camera, real-world scale with a check that must stay at 0, prompts that work, a log of looks already rejected, and a 1-10 rating rubric. Use this whenever you start a new look, art layer, concept batch, UI style or asset set; before you show the user any concept sheet or gate report; when writing an image prompt for direction or concepts; when a model looks wrong in game; or when the user says a look is "off", "cartoony", "generic" or "too much like X". Read it before generating anything visual, even one image.
---

# Art direction and approval gates

The user decides the look; you make it cheap for them to decide. Every rule here came from a round of art that was rejected.

## 1. One target frame

Before any asset is made, the user picks **one gameplay frame** (real or generated) that is the look. It shows real play at
the real camera with the UI, not a pretty concept shot. Write down what it contains (materials, light, UI layout) and judge
every gate and asset against it.

- Use the **real game camera**. Text-only camera descriptions failed; attach a real screenshot when the angle must match.
- A change of direction replaces the target frame and is written down the same day.

## 2. Layers and gates

Art is built in layers, each ending in a gate the user tests and approves. **Never start the next layer before the user
approves the current gate.** The user can reorder the layers; follow their order.

- **The user approves every concept image before it is modelled,** existing renders included. Show concepts as a labelled
  contact sheet and record picks and redo notes.
- **Art only changes the look.** Models replace how a thing looks, never its collision or footprint. Anything without a
  model falls back to a placeholder, so the game always runs and the tests don't move.
- **A gate report has:** screenshots from the same fixed camera spots each time, including a match of the target frame's
  view; tests green; frame time on a fixed busy scene; a sheet of every new asset; the credits spent; and final checks
  (camera doesn't clip, nothing wedged, log clean). Commit and tag at each approved gate.
- Check a rebuild really happened (log, timestamps) before judging a shot. One script once silently overwrote another's asset.

## 3. Readability

The player must know what a thing is from the gameplay camera in under a second.

- **A distinct silhouette plus identifying props,** written into the prompt. Generic shapes get rejected as "all alike".
- **Variants read as the same thing.** An upgrade or a level-up is a visible change of the same design, not a new design.
- **Materials say what it costs or how advanced it is,** in a table written for the game.
- Prompts for a single asset end with the asset alone on a plain light grey background, so the game supplies the setting.

## 4. Real-world scale

Everything is real size, and a check proves it. A game learned this late when a car stood as big as a building. Before the
first asset, write a table of sizes for the game's kinds of thing and add an automated scale check in the first art layer. It
**must report 0**. Fix scale in the art or data tables, never per instance, and never stretch a model to fit.

## 5. Prompts that work

- **Long and specific:** real gameplay at the real camera, with the UI, the materials of every element, the time of day.
  This user reads details; vague prompts give generic results.
- **Describe the look, never name a game.** Naming games pulled in their settings.
- **Placeholders in a reference get copied.** Say what each placeholder must become.
- With two references, the finished-looking one takes over the camera. To keep a layout, attach only your screenshot and
  describe the look in words. For a style lock, attach the approved frame as the second image.
- One prompt with the image count set; never write "make 4 variations" (you get a collage).
- UI prompts: a locked spec (goal, format, layout as a wireframe in words, type, colour and material with hex, exact copy,
  negatives), art direction first, one variable per variant. Variations go **on** the approved style, not new styles.

## 6. Looks already rejected

Keep a table per game: what was rejected and the user's words. Add a row the day a look is rejected and never offer it
again. Things this user has rejected across the board: AI repaints of our own screenshots, mixed art sources that clash
(scans beside generated art), code-drawn "greybox" UI, and copying a reference game too literally.

## 7. Rating rubric (1-10, against the target frame)

Rate gate shots and new assets in the game's own lighting.

| Score | Meaning |
|---|---|
| 9-10 | Could sit inside the target frame; reads instantly |
| 7-8 | Right look, small faults; fix in the batch |
| 5-6 | Right idea, wrong execution; redo before the gate |
| 3-4 | Generic or off-style; new concept needed |
| 1-2 | Broken: floating, buried, untextured, wrong scale |

Nothing under 7 goes to the user as "done". Crop and zoom before calling anything fine. Every fault below 7 is a ticket.

## Related skills

`studio-operating-model`, `tripo-studio`, `ue-scripted-runs`, `ue-test-gate`, `character-and-animation`.
