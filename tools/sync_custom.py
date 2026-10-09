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


def main() -> int:
    check_only = "--check" in sys.argv
    with open(os.path.join(ROOT, "src", "custom.ts"), encoding="utf-8", newline="") as f:
        code = f.read().replace("\r\n", "\n").rstrip("\n")
    block = "```customts\n" + code + "\n```"

    stale = []
    for path in sorted(glob.glob(os.path.join(ROOT, "forest", "forest*.md"))):
        with open(path, encoding="utf-8", newline="") as f:
            raw = f.read()
        text = raw.replace("\r\n", "\n")
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
