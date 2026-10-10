#!/usr/bin/env python3
"""Keep the hidden game code identical in every tutorial.

src/custom.ts is the single source for the code that lives inside the
```customts block of each tutorial (forest/forest*.md).

    python tools/sync_custom.py            copy src/custom.ts into every tutorial
    python tools/sync_custom.py --check    only report tutorials that are out of date (exit 1 if any)

Files are read and written exactly as they are (line endings are not changed).
A tutorial with no customts block gets one, placed just before its assetjson block.
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOCK = re.compile(r"```customts\n.*?\n```", re.S)

# Blocks a level asks the student to drag, in the order they use them. In that level's toolbox
# they appear at the top of the Custom drawer (MakeCode sorts blocks by //% weight, highest first).
FEATURED = {
    3: ["placeDataRandomly", "enableDataCollection", "spawnEnemyBuoys", "enableBuoyBump", "enablePulse", "setPulseLook"],
    4: ["dataCarried", "completeUpload"],
    5: ["setupAdvisorHUD", "distanceToNearestBuoy", "dangerRadius", "setAdvice", "dataCarried", "uploadAt"],
    6: ["enableAutopilot", "enableWinAtScore", "setMissionTuning"],
    7: ["enableAdaptiveAdvisor"],
}


def with_weights(code: str, level: int) -> str:
    """Add //% weight=NN under the //% block line of each featured function."""
    lines = code.split("\n")
    for rank, name in enumerate(FEATURED.get(level, [])):
        idx = next(i for i, l in enumerate(lines) if l.startswith("    export function " + name + "("))
        j = idx - 1
        while j >= 0 and not lines[j].lstrip().startswith("//% block="):
            j -= 1
        assert j >= 0 and idx - j < 6, name
        lines.insert(j + 1, "    //% weight=" + str(90 - rank))
    return "\n".join(lines)


def main() -> int:
    check_only = "--check" in sys.argv
    with open(os.path.join(ROOT, "src", "custom.ts"), encoding="utf-8", newline="") as f:
        code = f.read().replace("\r\n", "\n").rstrip("\n")

    stale = []
    for path in sorted(glob.glob(os.path.join(ROOT, "forest", "forest*.md"))):
        with open(path, encoding="utf-8", newline="") as f:
            raw = f.read()
        text = raw.replace("\r\n", "\n")
        m = re.search(r"forest(\d+)\.md$", path)
        block = "```customts\n" + with_weights(code, int(m.group(1)) if m else 0) + "\n```"
        if BLOCK.search(text):
            new = BLOCK.sub(lambda m: block, text, count=1)
        else:
            i = text.find("```assetjson")
            if i < 0:
                print("skip (no assetjson block to anchor on):", os.path.basename(path))
                continue
            new = text[:i] + block + "\n\n" + text[i:]
        if "\r\n" in raw:
            new = new.replace("\n", "\r\n")
        if new != raw:
            stale.append(os.path.basename(path))
            if not check_only:
                with open(path, "w", encoding="utf-8", newline="") as f:
                    f.write(new)

    if check_only:
        if stale:
            print("OUT OF DATE:", ", ".join(stale))
            print("Run:  python tools/sync_custom.py")
            return 1
        print("All tutorials are in sync with src/custom.ts")
        return 0
    print("updated:", ", ".join(stale) if stale else "nothing (already in sync)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
