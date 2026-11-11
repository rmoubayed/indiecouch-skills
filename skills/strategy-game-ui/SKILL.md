---
name: strategy-game-ui
description: For strategy and other UI-heavy games - how a HUD and menus should look and work: pictures over text, costs as icons, tooltips on the mouse, panels that collapse, no stretched pictures, no dev numbers for players, plus how to get approved concepts, cut them into game art and build UI from C++. Use this for HUD, menu, tooltip, icon, button, card, minimap or UI-art work in a strategy, management or similar game, when generating UI concepts, when a playtest note mentions the HUD, or when an image on screen looks stretched, boxy or "greybox". Read it before writing UI code or a UI prompt, even for a one-line change.
---

# Strategy game UI

The user judges a HUD in one glance: does it look like a big-studio game, and can I play without reading? Every rule below
came from a HUD the user turned down. Build to the approved frames, not your own taste. Each game has its own style; keep a
record of what was approved and rejected, and read it before proposing a direction.

## Player-facing rules

1. **Pictures over text.** Everything has a picture. A button is an icon or a card, its name in the tooltip.
2. **Costs are icons with numbers,** never words.
3. **No dev numbers for players.** No multipliers or raw formulas. Dev numbers go in a dev-only panel.
4. **Tooltips ride the mouse,** flipped to stay on screen, with a rich card: title, picture, one line, cost, hotkey. Measure
   one frame hidden before showing, or it jumps.
5. **No stretched pictures.** Every image keeps its texture's aspect ratio.
6. **Panels collapse.** Quiet by default, expanding on demand, with the world visible. A permanently open panel is "too intrusive".
7. **Hotkeys show on the tile** and in the tooltip. Locked items show a padlock and a readable reason.
8. **If a game can grow to many units,** group lists by role, not individuals.

## Making UI concepts

1. **Art direction first,** naming the material of every element. Generators fall back to a generic flat UI when the
   direction comes after a long layout spec.
2. A locked spec (goal, format, layout as a wireframe in words, type, colour and material with hex, exact copy, negatives)
   with **one variable changed per variant**.
3. Attach the game screenshot as the first image and the approved style frame as the second, with a style-lock line.
4. One image per prompt, each a different game state.
5. Show a contact sheet and get the user's pick. The approval gate applies (see `art-direction-gates`).

The user wants variations on the approved style, not new styles.

## From image to game art

Generate plates and frames on pure black, then cut them out by script. Slice icon and card sheets into single files. Import
as UI textures with no mips. Draw plates as nine-slice boxes with explicit sizes, with the edge inside the slice border.
Code-drawn rounded hairline buttons read as "greybox / not gamy": plates are painted art. Generate pictures that show live
game state in game, such as portraits and minimaps, so they always match.

## Building UI from C++

- Rebuild a list only when its content changes. Rebuilding every tick kills hover and tooltips.
- A click on any UI must never also order in the world, so cover every panel in the hit check.
- Load textures by path, cache them, keep them safe from garbage collection, and fall back when art is missing.
- Text that can overflow gets an ellipsis and a max width.

## Check it

You can't judge a HUD from code. When visual checks are asked for, shoot every state you touched (nothing selected, each
selection, menus open and collapsed, tooltip, night, pause, end card) with the UI in the shot, and rate each against the frame.

## Traps

- Brush defaults: a brush with no size sets its own, and a border may draw in its own colour, not the brush's tint.
- Fonts lack glyphs: use what the font has and say the rest in the tooltip.
- Copying a reference game literally. Take the UX; keep the game's own era and materials.

## Related skills

`art-direction-gates`, `tripo-studio`, `ue-scripted-runs`, `ue-test-gate`, `playtest-to-linear`, `linear-delivery`.
