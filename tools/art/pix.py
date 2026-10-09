"""Tiny pixel-art toolkit for MakeCode Arcade (16-colour palette).
Characters: . transparent, 1 white, 2 red, 3 pink, 4 orange, 5 yellow, 6 teal, 7 green,
8 blue, 9 cyan, a purple, b grey-mauve, c dark purple, d pale, e brown, f black
"""
import math
import os

from PIL import Image

PAL = {
    ".": None,
    "1": "#ffffff", "2": "#ff2121", "3": "#ff93c4", "4": "#ff8135", "5": "#fff609", "6": "#249ca3",
    "7": "#78dc52", "8": "#003fad", "9": "#87f2ff", "a": "#8e2ec4", "b": "#a4839f", "c": "#5c406c",
    "d": "#e5cdc4", "e": "#91463d", "f": "#000000",
}


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


class Img:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.p = [["."] * w for _ in range(h)]

    def set(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.p[y][x] = c

    def get(self, x, y):
        if 0 <= x < self.w and 0 <= y < self.h:
            return self.p[y][x]
        return "."

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.set(x, y, c)

    def ellipse(self, cx, cy, rx, ry, c):
        for y in range(self.h):
            for x in range(self.w):
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0:
                    self.set(x, y, c)

    def outline(self, c="f", skip=()):
        """Black edge around every opaque pixel that touches transparent space (drawn on transparent pixels)."""
        add = []
        for y in range(-1, self.h + 1):
            for x in range(-1, self.w + 1):
                if self.get(x, y) == ".":
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        if self.get(x + dx, y + dy) not in (".",) + tuple(skip):
                            add.append((x, y))
                            break
        return add

    def grow(self, pad=1):
        n = Img(self.w + 2 * pad, self.h + 2 * pad)
        for y in range(self.h):
            for x in range(self.w):
                n.p[y + pad][x + pad] = self.p[y][x]
        return n

    def text(self):
        return "\n".join("".join(r) for r in self.p)

    def png(self, path, scale=12, bg="#003fad"):
        im = Image.new("RGBA", (self.w * scale, self.h * scale), hex2rgb(bg) + (255,))
        px = im.load()
        for y in range(self.h):
            for x in range(self.w):
                c = PAL[self.p[y][x]]
                if c:
                    col = hex2rgb(c) + (255,)
                    for yy in range(scale):
                        for xx in range(scale):
                            px[x * scale + xx, y * scale + yy] = col
        os.makedirs(os.path.dirname(path), exist_ok=True)
        im.save(path)


def from_text(t):
    rows = [r for r in t.strip("\n").split("\n")]
    w = max(len(r) for r in rows)
    i = Img(w, len(rows))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            i.p[y][x] = ch
    return i


def sheet(items, path, scale=10, bg="#003fad", gap=3):
    """items: list of Img; laid out in a row for a quick preview."""
    W = sum(i.w for i in items) + gap * (len(items) + 1)
    H = max(i.h for i in items) + 2 * gap
    big = Img(W, H)
    x = gap
    for i in items:
        for yy in range(i.h):
            for xx in range(i.w):
                big.p[gap + yy][x + xx] = i.p[yy][xx]
        x += i.w + gap
    big.png(path, scale, bg)
