import json
import math
import random
import sys

from pix import Img
import design2
import design3

OUT = sys.argv[1]


def kelp(seed):
    t = Img(16, 16)
    rnd = random.Random(seed)
    for sx in (3, 8, 12):
        h = rnd.randint(8, 14)
        x = sx
        for k in range(h):
            y = 15 - k
            t.set(x, y, "7")
            if k % 4 == 1:
                x += 1
            if k % 4 == 3:
                x -= 1
        t.set(sx + 1, 15, "7")
        t.set(sx, 14, "6")
    return t


def coral():
    t = Img(16, 16)
    t.rect(6, 12, 9, 15, "e")
    for (x, y0, y1, c) in ((4, 5, 12, "3"), (7, 2, 12, "4"), (10, 4, 12, "3"), (12, 7, 12, "4")):
        for y in range(y0, y1 + 1):
            t.set(x, y, c)
            if (y - y0) % 3 == 0:
                t.set(x + 1, y, c)
    t.set(7, 1, "5")
    t.set(4, 4, "1")
    t.set(10, 3, "1")
    return t


def backdrop():
    bg = Img(160, 120)
    bg.rect(0, 0, 159, 119, "8")
    # light shafts: diagonal dithered beams that fade as they go down
    for y in range(0, 70):
        for x in range(160):
            band = (x + y * 2) % 48
            if band < 7 and (x + y) % 2 == 0 and y < 62 - (band * 3):
                bg.set(x, y, "6")
    # depth: dither black into the bottom of the screen
    for y in range(86, 120):
        for x in range(160):
            if y > 100 and (x + y) % 2 == 0:
                bg.set(x, y, "f")
            elif (x % 4 == 0) and (y % 4 == 0) and y >= 86:
                bg.set(x, y, "f")
    return bg


def to_ts(img, indent=""):
    return "\n".join(indent + "".join(r) for r in img.p)


ART = {}
dr = design2.drone()
ART["DRONE"] = dr
ART["SHIP"] = design3.ship()
ART["SHARD_A"] = design3.shard(0)
ART["SHARD_B"] = design3.shard(1)
ART["BUOY_A"] = design2.buoy(True)
ART["BUOY_B"] = design2.buoy(False)
ART["PULSE_1"] = design2.pulse_frame(4, 2)
ART["PULSE_2"] = design2.pulse_frame(7, 2)
ART["PULSE_3"] = design2.pulse_frame(10, 2)
ART["PULSE_4"] = design2.pulse_frame(12, 1, True)
ART["TILE_BUBBLES_A"] = design3.tile_water(1, "bubbles")
ART["TILE_BUBBLES_B"] = design3.tile_water(7, "bubbles")
ART["TILE_RIPPLE_A"] = design3.tile_water(2, "ripples")
ART["TILE_RIPPLE_B"] = design3.tile_water(5, "ripples")
ART["TILE_ROCK_A"] = design3.tile_rock(0)
ART["TILE_ROCK_B"] = design3.tile_rock(1)
ART["TILE_ROCK_C"] = design3.tile_rock(2)
ART["TILE_KELP"] = kelp(3)
ART["TILE_CORAL"] = coral()
ART["BACKDROP"] = backdrop()

if __name__ == "__main__":
    json.dump({k: [v.w, v.h, v.text()] for k, v in ART.items()}, open(OUT + "/art.json", "w"))
    # --- scene mock: backdrop + tiles + sprites, 160x120 at x6 ---
    sc = Img(160, 120)
    bg = ART["BACKDROP"]
    for y in range(120):
        for x in range(160):
            sc.p[y][x] = bg.p[y][x]
    rnd = random.Random(11)
    waters = [None, ART["TILE_BUBBLES_A"], ART["TILE_BUBBLES_B"], ART["TILE_RIPPLE_A"], ART["TILE_RIPPLE_B"], ART["TILE_KELP"], ART["TILE_CORAL"]]
    wts = [10, 2, 2, 3, 3, 1, 1]

    def blit(im, ox, oy):
        for yy in range(im.h):
            for xx in range(im.w):
                c = im.p[yy][xx]
                if c != ".":
                    sc.set(ox + xx, oy + yy, c)

    for ty in range(8):
        for tx in range(10):
            t = rnd.choices(waters, wts)[0]
            if t is not None:
                blit(t, tx * 16, ty * 16)
    for ty in range(8):  # left wall column
        blit(ART["TILE_ROCK_" + "ABC"[ty % 3]], 0, ty * 16)
    blit(ART["SHIP"], 24, 14)
    blit(ART["DRONE"], 70, 64)
    blit(ART["BUOY_A"], 120, 30)
    blit(ART["SHARD_A"], 112, 84)
    blit(ART["SHARD_B"], 40, 90)
    blit(ART["PULSE_3"], 96, 52)
    sc.png(OUT + "/scene.png", scale=6)
    print({k: (v.w, v.h) for k, v in ART.items()})
