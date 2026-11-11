---
name: game-audio
description: How to make and check a game's sound - sound effects and ambience with Mirelo, music and voice lines with ElevenLabs, keeping API keys out of sight, levelling (one-shots peak -1 dB, voices -3 dB, music and beds around -20 dB RMS), headless import, and checking the mix without ears by recording the game and measuring it. Use this whenever you add, replace, level or import a sound effect, ambience, music track or voice line, wire a sound into the game, when something is silent, too loud or clipped, or when you need to prove the audio works without listening.
---

# Game audio

Sound is made by paid generators, levelled by script, imported headless and **checked by measurement**, because you can't
hear the game. Every step leaves something you can measure, so "it plays" is a number, not a hope.

## Keys and money

- **API keys stay in files, read inside the script, never printed.** Never open, print, grep or copy an env file, and never
  put a key on a command line, in a log or in a ticket. A printed key ends up in the transcript and can't be taken back.
  Check a key exists by letting the script fail with "no key found".
- **Generation costs credits.** Generate only what a ticket asks for, keep prompts in one place, skip files already made,
  and never loop a generator until it "sounds right".

## Sound effects and ambience (Mirelo)

- One-shots: 0.5-3 s, 2-3 variants. Anything heard often needs variants plus a little random pitch, or it machine-guns.
- Looping beds: use the model's seamless loop option, and name them so the import can mark them as looping.
- Describe the sound itself: source, material, action, space. Use a negative prompt for what came back unwanted. Pass an
  idempotency key, so a retry doesn't buy a second job.
- Mirelo doesn't make music.

## Music and voices (ElevenLabs)

- Keep prompts in a script, so the next track shares the same style line.
- Music: instrumental, sits under gameplay, no big drops, ends softly. Music that builds and drops fights the action.
- Voices: short lines (they may play on every click), with one voice per kind of character.

## Level, then import

Levelling is why one sound never drowns the rest. Use peaks for short sounds and RMS for long ones.

| Kind | Target |
|---|---|
| One-shots | trim silence, peak -1 dB, mono for 3D placement |
| Voices | peak -3 dB, so they sit under the world |
| Music and beds | about -20 dB RMS, soft limit, stereo |

Import headless (see `ue-asset-import`). A missing sound asset is usually silent, not an error, so always run the check below.

## Check it without ears

Record the game's real output in a scripted run, then print loudness per second. Silence is about -90 dB, a bed sits near
-20 to -30, a one-shot jumps 10+ dB for a second, and anything at -1 dB peak or above is clipping. Pass marks for the ticket:
the sound appears in the second it was triggered, beds never drop out, nothing clips, and music sits under the effects.

## Traps

- An old recording with the same name looks like a pass. Use a new name per run.
- A silent recording may be the run, not the sound: unattended or headless runs often don't produce audio, and 3D sounds
  far from the listener are culled.
- A bed imported as a one-shot stops after one pass.
- Voices peaked at -1 dB shout over the world.

## Related skills

`ue-scripted-runs`, `ue-asset-import`, `ue-test-gate`, `linear-delivery`, `studio-operating-model`.
