import math
import random
import sys

from pix import Img, sheet

OUT = sys.argv[1]


def ship():
    s = Img(44, 24)
    # hull: long grey navy hull, red anti-fouling below the waterline
    for y in range(11, 20):
        for x in range(2, 43):
            # pointed bow on the right, flat stern on the left
            bow = 43 - x
            top = 11 + max(0, (4 - bow) // 2) if bow < 8 else 11
            if y < top:
                continue
            if x > 36 and y > 19 - (x - 36):
                continue
            s.set(x, y, "b" if y < 17 else ("2" if y < 19 else "e"))
    # deck line + highlights
    s.rect(2, 11, 40, 11, "d")
    s.rect(4, 13, 38, 13, "d")
    for x in range(6, 38, 6):
        s.rect(x, 14, x + 1, 15, "c")   # hull windows / vents
    # bridge / superstructure
    s.rect(14, 5, 28, 10, "b")
    s.rect(14, 5, 28, 6, "d")
    s.rect(14, 9, 28, 10, "c")
    s.rect(16, 7, 17, 8, "9")
    s.rect(19, 7, 20, 8, "9")
    s.rect(22, 7, 23, 8, "9")
    s.rect(25, 7, 26, 8, "9")
    s.rect(17, 3, 25, 4, "b")
    s.rect(17, 3, 25, 3, "d")
    s.rect(19, 4, 23, 4, "c")
    # funnel + radar mast
    s.rect(30, 5, 34, 10, "c")
    s.rect(30, 5, 34, 6, "b")
    s.rect(32, 1, 32, 5, "d")
    s.rect(30, 1, 34, 1, "d")
    s.set(31, 0, "d")
    s.set(33, 0, "d")
    # flag
    s.rect(9, 6, 9, 10, "d")
    s.rect(10, 6, 12, 8, "2")
    s.rect(10, 7, 12, 7, "1")
    # bow gun
    s.rect(34, 9, 36, 10, "c")
    s.rect(36, 9, 39, 9, "d")
    # outline and foam
    for x, y in s.outline():
        s.set(x, y, "f")
    for x in range(1, 43):
        if s.get(x, 20) == "." and (x // 2) % 2 == 0:
            s.set(x, 21, "1")
        if s.get(x, 20) == "." and (x // 3) % 2 == 1:
            s.set(x, 22, "9")
    return s


def shard(frame):
    d = Img(16, 16)
    cx = cy = 7.5
    # glowing capsule / data core
    for y in range(16):
        for x in range(16):
            dist = math.hypot(x - cx, y - cy)
            if dist <= 6.6:
                d.set(x, y, "9" if dist > 4.6 else ("1" if dist < 2.4 else "9"))
            if dist <= 5.2:
                d.set(x, y, "6")
            if dist <= 3.8:
                d.set(x, y, "9")
            if dist <= 1.8:
                d.set(x, y, "1")
    # four little data pips around the core
    for (x, y) in ((7, 3), (8, 3), (12, 7), (12, 8), (7, 12), (8, 12), (3, 7), (3, 8)):
        d.set(x, y, "1" if frame == 0 else "5")
    d.set(5, 5, "1")
    d.set(6, 5, "1")
    for x, y in d.outline("f"):
        d.set(x, y, "f")
    # sparkle that moves between frames
    sx, sy = (13, 2) if frame == 0 else (2, 13)
    d.set(sx, sy, "5")
    d.set(sx - 1, sy, "5")
    d.set(sx + 1, sy, "5")
    d.set(sx, sy - 1, "5")
    d.set(sx, sy + 1, "5")
    return d


def tile_water(seed, kind):
    t = Img(16, 16)
    rnd = random.Random(seed)
    if kind == "bubbles":
        for _ in range(3):
            x, y = rnd.randint(1, 13), rnd.randint(1, 13)
            t.set(x, y, "9")
            t.set(x + 1, y, "9") if rnd.random() < 0.5 else None
            t.set(x, y + 1, "9")
        t.set(rnd.randint(2, 12), rnd.randint(2, 12), "1")
    elif kind == "ripples":
        y = rnd.randint(3, 12)
        x = rnd.randint(1, 8)
        for k in range(5):
            t.set(x + k, y + (1 if k in (1, 2, 3) else 0), "6")
        y2 = (y + 7) % 12 + 2
        x2 = rnd.randint(2, 9)
        for k in range(4):
            t.set(x2 + k, y2 + (1 if k in (1, 2) else 0), "6")
    elif kind == "plain":
        pass
    return t


def tile_rock(variant):
    t = Img(16, 16)
    t.rect(0, 0, 15, 15, "c")
    rnd = random.Random(variant)
    # lighter chunky highlights
    for _ in range(9):
        x, y = rnd.randint(0, 12), rnd.randint(0, 12)
        t.rect(x, y, x + 2, y + 1, "b")
    for _ in range(5):
        x, y = rnd.randint(0, 13), rnd.randint(0, 13)
        t.set(x, y, "d")
    for _ in range(7):
        x, y = rnd.randint(0, 14), rnd.randint(0, 14)
        t.set(x, y, "f")
    # coral / kelp accents
    if variant % 3 == 0:
        for y in range(2, 9):
            t.set(5 + (y // 2) % 2, y, "7")
    if variant % 3 == 1:
        t.rect(9, 4, 11, 5, "3")
        t.rect(10, 6, 10, 8, "4")
    return t


if __name__ == "__main__":
    items = [ship(), shard(0), shard(1)] + [tile_water(1, "bubbles"), tile_water(2, "ripples"), tile_water(3, "plain")] + [tile_rock(i) for i in range(3)]
    sheet(items, OUT + "/draft3.png", scale=10)
