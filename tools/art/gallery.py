"""Build the "My Assets" picture gallery students can choose from (drones, ships, data shards, pulses).

    python gallery.py <art.json> <repo root> <preview folder>

art.json comes from finalart.py. The gallery is made by recolouring the base drone, ship and shard, plus
a few new pulse rings. The script writes the pictures into the `assetjson` block of every
forest/forest*.md (images.g.jres and images.g.ts) and saves labelled preview PNGs.
To add your own picture to the gallery, append it to GALLERY below.
"""
import base64
import glob
import json
import math
import os
import re
import sys

from PIL import Image, ImageDraw
from pix import Img, PAL, hex2rgb

ART_JSON, REPO, PREVIEW = sys.argv[1], sys.argv[2], sys.argv[3]
art = json.load(open(ART_JSON))


def base(key):
    w, h, text = art[key]
    return [list(r) for r in text.split("\n")][:h]


def recolor(rows, mapping):
    return [[mapping.get(c, c) for c in r] for r in rows]


def ring(size, radius, outer, inner, dither):
    c0 = (size - 1) / 2
    rows = [["."] * size for _ in range(size)]
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - c0, y - c0)
            if radius - 2 < d <= radius:
                rows[y][x] = outer if d > radius - 1 else inner
            elif radius - 3.5 < d <= radius - 2 and (x + y) % 2 == 0:
                rows[y][x] = dither
    return rows


DRONE = base("DRONE")
SHIP = base("SHIP")
SHARD = base("SHARD_A")

GALLERY = [
    # (category, name, rows)
    ("drone", "droneManta", DRONE),
    ("drone", "droneStealth", recolor(DRONE, {"5": "b", "4": "c", "e": "a"})),
    ("drone", "droneRescue", recolor(DRONE, {"5": "1", "4": "d", "e": "2"})),
    ("drone", "droneExplorer", recolor(DRONE, {"4": "7", "e": "6"})),
    ("drone", "droneNeon", recolor(DRONE, {"5": "3", "4": "a", "e": "c"})),
    ("ship", "shipCruiser", SHIP),
    ("ship", "shipTeal", recolor(SHIP, {"2": "6", "e": "c"})),
    ("ship", "shipStealth", recolor(SHIP, {"d": "b", "b": "c", "2": "a", "e": "c"})),
    ("data", "dataCyan", SHARD),
    ("data", "dataGold", recolor(SHARD, {"9": "5", "6": "4", "5": "1"})),
    ("data", "dataGreen", recolor(SHARD, {"9": "7", "6": "6", "5": "5"})),
    ("data", "dataPink", recolor(SHARD, {"9": "3", "6": "a", "5": "1"})),
    ("pulse", "pulseCyan", ring(16, 7, "1", "9", "6")),
    ("pulse", "pulseGold", ring(16, 7, "5", "4", "2")),
    ("pulse", "pulseGreen", ring(16, 7, "1", "7", "6")),
    ("pulse", "pulsePink", ring(16, 7, "1", "3", "a")),
]


def encode(rows):
    h, w = len(rows), len(rows[0])
    col = (h + 1) // 2
    col += (-col) % 4
    out = bytearray([0x87, 0x04, w & 255, w >> 8, h & 255, h >> 8, 0, 0])
    for x in range(w):
        b = bytearray(col)
        for y in range(h):
            v = 0 if rows[y][x] == "." else int(rows[y][x], 16)
            b[y >> 1] |= v << ((y & 1) * 4)
        out += b
    return base64.b64encode(bytes(out)).decode()


def decode(b64):
    d = base64.b64decode(b64)
    w, h = d[2] | d[3] << 8, d[4] | d[5] << 8
    col = (h + 1) // 2
    col += (-col) % 4
    return ["".join("." if ((d[8 + x * col + (y >> 1)] >> ((y & 1) * 4)) & 15) == 0 else "%x" % ((d[8 + x * col + (y >> 1)] >> ((y & 1) * 4)) & 15) for x in range(w)) for y in range(h)]


# self-check: the encoder round-trips
for _, name, rows in GALLERY:
    assert decode(encode(rows)) == ["".join(r) for r in rows], name

jres = {}
ts = ['// Auto-generated code. Do not edit.', 'namespace myImages {', '',
      '    helpers._registerFactory("image", function(name: string) {',
      '        switch(helpers.stringTrim(name)) {']
for i, (_, name, rows) in enumerate(GALLERY, 1):
    jres["image%d" % i] = {"data": encode(rows), "mimeType": "image/x-mkcd-f4", "displayName": name}
    ts.append('            case "image%d":' % i)
    ts.append('            case "%s":return img`' % name)
    ts.extend("".join(r) for r in rows)
    ts.append('`;')
jres["*"] = {"mimeType": "image/x-mkcd-f4", "dataEncoding": "base64", "namespace": "myImages"}
ts += ['        }', '        return null;', '    })', '',
       '    helpers._registerFactory("animation", function(name: string) {',
       '        switch(helpers.stringTrim(name)) {', '', '        }', '        return null;', '    })', '',
       '    helpers._registerFactory("song", function(name: string) {',
       '        switch(helpers.stringTrim(name)) {', '', '        }', '        return null;', '    })', '', '}',
       '// Auto-generated code. Do not edit.', '']
JRES = json.dumps(jres, indent=4)
TS = "\n".join(ts)

for path in sorted(glob.glob(os.path.join(REPO, "forest", "forest*.md"))):
    raw = open(path, encoding="utf-8", newline="").read()
    crlf = "\r\n" in raw
    t = raw.replace("\r\n", "\n")
    m = re.search(r"```assetjson\n(.*?)\n```", t, re.S)
    j = json.loads(m.group(1))
    j["images.g.jres"] = JRES
    j["images.g.ts"] = TS
    new = "```assetjson\n" + json.dumps(j, indent=2) + "\n```"
    t = t[:m.start()] + new + t[m.end():]
    if crlf:
        t = t.replace("\n", "\r\n")
    open(path, "w", encoding="utf-8", newline="").write(t)
    print("assets updated:", os.path.basename(path))

# labelled preview sheets (also used as the pictures in the tutorial hints)
os.makedirs(PREVIEW, exist_ok=True)
SC = 5
for cat in ("drone", "ship", "data", "pulse"):
    items = [(n, r) for c, n, r in GALLERY if c == cat]
    cw = max(len(r[0]) for _, r in items) * SC + 24
    ch = max(len(r) for _, r in items) * SC + 36
    im = Image.new("RGB", (cw * len(items), ch), hex2rgb("#003fad"))
    dr = ImageDraw.Draw(im)
    for k, (n, r) in enumerate(items):
        ox = k * cw + 12
        for y, row in enumerate(r):
            for x, c in enumerate(row):
                if PAL[c]:
                    dr.rectangle([ox + x * SC, 8 + y * SC, ox + x * SC + SC - 1, 8 + y * SC + SC - 1], fill=hex2rgb(PAL[c]))
        dr.text((ox, ch - 20), n, fill=(255, 255, 255))
    im.save(os.path.join(PREVIEW, "Gallery_%s.png" % cat))
print("preview sheets saved")
