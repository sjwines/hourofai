import math
import sys

from pix import Img, sheet

OUT = sys.argv[1]


def drone():
    d = Img(30, 18)
    cx, cy, rx, ry = 15.0, 9.0, 12.5, 5.4
    for y in range(d.h):
        for x in range(d.w):
            taper = 0.62 + 0.38 / (1 + math.exp(-(x - 8) / 3.0))
            u, v = (x - cx) / rx, (y - cy) / (ry * taper)
            if u * u + v * v <= 1:
                if v < -0.58:
                    c = "5"
                elif v < -0.25:
                    c = "5" if (x + y) % 2 == 0 else "4"
                elif v < 0.30:
                    c = "4"
                elif v < 0.60:
                    c = "4" if (x + y) % 2 == 0 else "e"
                else:
                    c = "e"
                d.set(x, y, c)
    # panel line + rivets
    for x in range(7, 22):
        if d.get(x, 10) in "4e":
            d.set(x, 10, "e")
    for x in (9, 13, 17):
        d.set(x, 7, "e")
    # camera dome
    for y in range(d.h):
        for x in range(d.w):
            u, v = (x - 22.5) / 4.0, (y - 8.5) / 3.6
            if u * u + v * v <= 1:
                d.set(x, y, "9" if v < 0.30 else "6")
    d.rect(20, 6, 21, 6, "1")
    d.set(20, 7, "1")
    d.set(21, 7, "1")
    d.set(20, 8, "1")
    # rear thruster cone + prop
    d.rect(3, 7, 5, 11, "b")
    d.rect(3, 7, 5, 8, "d")
    d.rect(3, 10, 5, 11, "c")
    d.rect(1, 4, 1, 14, "d")
    d.rect(2, 5, 2, 13, "b")
    d.set(0, 8, "d")
    d.set(0, 9, "d")
    d.set(0, 10, "d")
    # lower wing
    d.set(12, 14, "e")
    d.rect(10, 15, 14, 15, "e")
    d.rect(9, 16, 12, 16, "c")
    # skid
    d.rect(15, 15, 22, 15, "c")
    # dorsal fin and antenna
    d.rect(10, 3, 13, 4, "4")
    d.rect(9, 4, 14, 4, "4")
    d.set(12, 2, "d")
    d.set(12, 1, "d")
    d.rect(12, 0, 13, 0, "2")
    # nose light
    d.set(27, 9, "5")
    for x, y in d.outline():
        d.set(x, y, "f")
    return d


def buoy(lit):
    b = Img(22, 24)
    cx, cy, r = 11.0, 13.5, 6.3
    # spikes (mine horns)
    for ang in range(0, 360, 45):
        a = math.radians(ang)
        for k in range(int(r) , int(r) + 4):
            x = round(cx + math.cos(a) * k)
            y = round(cy + math.sin(a) * k)
            b.set(x, y, "d" if k == int(r) + 3 else "c")
    # sphere with shading
    for y in range(b.h):
        for x in range(b.w):
            u, v = (x - cx) / r, (y - cy) / r
            if u * u + v * v <= 1:
                shade = u * 0.55 + v * 0.65
                c = "b" if shade < -0.5 else ("c" if shade < 0.3 else "c")
                if shade < -0.55:
                    c = "d"
                elif shade < 0.1:
                    c = "b"
                else:
                    c = "c"
                b.set(x, y, c)
    # warning eye
    b.rect(9, 12, 12, 15, "f")
    b.rect(10, 13, 11, 14, "2" if lit else "e")
    if lit:
        b.set(10, 13, "5")
    # antenna + beacon
    b.rect(10, 3, 11, 7, "d")
    b.rect(9, 0, 12, 2, "2" if lit else "e")
    if lit:
        b.set(10, 1, "5")
        b.set(11, 1, "5")
    # chain below
    for y in (21, 22, 23):
        b.set(10, y, "b")
        b.set(11, y, "c")
    for x, y in b.outline():
        b.set(x, y, "f")
    return b


def pulse_frame(rad, thick=2, dotted=False):
    s = 26
    r = Img(s, s)
    c0 = (s - 1) / 2
    for y in range(s):
        for x in range(s):
            dist = math.hypot(x - c0, y - c0)
            if rad - thick < dist <= rad:
                if dotted and (x + y) % 2:
                    continue
                r.set(x, y, "1" if dist > rad - 1 else "9")
            elif rad - thick - 1.5 < dist <= rad - thick and (x + y) % 2 == 0 and not dotted:
                r.set(x, y, "6")
    return r


if __name__ == "__main__":
    items = [drone(), buoy(True), buoy(False)] + [pulse_frame(4, 2), pulse_frame(7, 2), pulse_frame(10, 2), pulse_frame(12, 1, True)]
    sheet(items, OUT + "/draft2.png", scale=10)
    print(items[0].text())
