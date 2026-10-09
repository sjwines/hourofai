# Operation Uplink: how the shared game code works

Every tutorial (`forest/forest0.md` to `forest7.md`) hides the same game blocks inside its
```` ```customts ```` section. To avoid editing that code eight times:

1. **Edit `src/custom.ts`.** This is the only copy you change.
2. Run `python tools/sync_custom.py`. It copies the file into all eight tutorials.
3. `python tools/sync_custom.py --check` tells you if any tutorial is out of date (it exits with an error if so).
4. Commit and push as usual. Students need nothing extra: the code stays inside the tutorials.

Pop-up text, steps and hints are written directly in the `forest*.md` files and are not touched by the script.

## Where things live

| What | Where |
| --- | --- |
| Game blocks (arena, buoys, pulse, upload, advisor, autopilot, mission report) | `src/custom.ts` |
| Drone, ship and data-pod pictures students see in the steps | the `img` pictures inside each `forest*.md` (blocks and `template`) |
| Buoy, sonar rings, ocean tiles, backdrop | the `img` pictures near the top of `src/custom.ts` |
| Skillmap (order of levels, tile pictures, certificate) | `forest.md` |
| Level files MakeCode loads | listed in `pxt.json` |

Tutorial step counts: MakeCode counts every `##` heading, including pop-ups, as a step. Keep each level at 14 or fewer.

## Markdown gotchas learned the hard way

- Put a **blank line** between a `~hint Title` line and the `---` under it. Without it, Markdown turns the title into a big heading and the hint box shows up as plain text.
- Keep these files with Unix (LF) line endings, as in the repo already.

## Pictures

`tools/art/` holds the small Python scripts used to draw the sprites and tiles with the 16 MakeCode colours
(run `python finalart.py <output folder>` to write previews and `art.json`; needs the Pillow package).
You can also just edit any picture in the MakeCode image editor and paste the new `img` literal into the file.
