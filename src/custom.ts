// Operation Uplink: the shared game blocks.
// This is the ONE source for the code hidden inside every tutorial.
// After editing, run:  python tools/sync_custom.py
enum Advice {
    //% block="Collect"
    Collect,
    //% block="Upload"
    Upload,
    //% block="Avoid"
    Avoid
}

enum OceanMap {
    //% block="open water"
    OpenWater,
    //% block="shipwreck graveyard"
    Shipwrecks,
    //% block="caves"
    Caves,
    //% block="currents"
    Currents
}

//% weight=100 color=#0fbc11 icon=""
namespace custom {
    // Tunables: students change these with "set mission tuning"
    export let MAX_CARGO = 3
    export let UPLOAD_AT = 3
    export let DANGER_RADIUS = 32

    // World settings
    const TILE = 16
    const ARENA_W_TILES = 32
    const ARENA_H_TILES = 24
    const SHARD_COUNT = 4
    const MAX_BUOYS = 5
    const PULSE_COOLDOWN_MS = 3000

    // The HUD sprite gets its own kind. The ship's kind is made by students in level 2,
    // so the code below finds the ship by looking at sprites instead of naming its kind.
    const HUD_KIND = SpriteKind.create()

    // Game state
    let cargo = 0
    let noDataUntil = 0
    let pulseLook: Image = null
    let hitCooldown = false
    let hud: Sprite = null
    let adviceSet = false
    let currentAdvice = Advice.Collect
    let autopilotOn = false
    let adaptive = false
    let won = false
    let pulseReadyAt = 0
    let startedAt = 0
    let trips = 0
    let uploaded = 0
    let dataLost = 0
    let pulsesUsed = 0
    let autoMs = 0
    let autoDx = 0
    let facingRight = true

    // The ocean map: which tiles are solid rock, and where the currents flow
    const FX_KIND = SpriteKind.create()
    let oceanMap = OceanMap.OpenWater
    let mapSolid: boolean[] = []
    let mapTile: number[] = []
    let hasInteriorWalls = false
    let currentZones: number[][] = []
    let currentsStarted = false
    let faceStarted = false
    let pathDist: number[] = []
    let pathGoal = -1
    let pathReplanAt = 0

    // ---------- art (all drawn with the 16 MakeCode colours) ----------
    const BUOY_FRAMES = [
        img`
........f2222f........
........f2552f........
........f2222f........
.........fddf.........
.........fddf.........
.........fddf.........
.....f...fddf....f....
....fdf.ffddfff.fdf...
....fcffddddbbbffcf...
.....fcddddbbbbbcf....
.....fdddbbbbbbbbf....
.....fddbbbbbbbbcf....
....fddbbffffbccccf...
..fffdbbbf52fcccccfff.
.fdccbbbbf22fcccccccdf
..fffbbbbffffcccccfff.
.....fbbbbcccccccf....
.....fbbbccccccccf....
.....fcccccccccccf....
....fcffcccccccffcf...
....fdf.fffcfff.fdf...
.....f...fbcf....f....
.........fbcf.........
.........fbcf.........
`,
        img`
........feeeef........
........feeeef........
........feeeef........
.........fddf.........
.........fddf.........
.........fddf.........
.....f...fddf....f....
....fdf.ffddfff.fdf...
....fcffddddbbbffcf...
.....fcddddbbbbbcf....
.....fdddbbbbbbbbf....
.....fddbbbbbbbbcf....
....fddbbffffbccccf...
..fffdbbbfeefcccccfff.
.fdccbbbbfeefcccccccdf
..fffbbbbffffcccccfff.
.....fbbbbcccccccf....
.....fbbbccccccccf....
.....fcccccccccccf....
....fcffcccccccffcf...
....fdf.fffcfff.fdf...
.....f...fbcf....f....
.........fbcf.........
.........fbcf.........
`
    ]
    const PULSE_FRAMES = [
        img`
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
...........1111...........
..........199991..........
.........199.6991.........
.........19.6.691.........
.........196.6.91.........
.........1996.991.........
..........199991..........
...........1111...........
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
..........................
`,
        img`
..........................
..........................
..........................
..........................
..........................
..........................
..........111111..........
.........11999911.........
........199.6.6991........
.......196.6.6.6.91.......
......119.6.....6911......
......19.6.......691......
......196.......6.91......
......19.6.......691......
......196.......6.91......
......1196.....6.911......
.......19.6.6.6.691.......
........1996.6.991........
.........11999911.........
..........111111..........
..........................
..........................
..........................
..........................
..........................
..........................
`,
        img`
..........................
..........................
..........................
..........111111..........
........1199999911........
......1199.6.6.69911......
.....1196.6.6.6.6.911.....
.....196.6.......6.91.....
....196...........6.91....
....19.6...........691....
...19.6.............691...
...196.............6.91...
...19.6.............691...
...196.............6.91...
...19.6.............691...
...196.............6.91...
....196...........6.91....
....19.6...........691....
.....19.6.......6.691.....
.....119.6.6.6.6.6911.....
......11996.6.6.9911......
........1199999911........
..........111111..........
..........................
..........................
..........................
`,
        img`
..........................
...........1.1.1..........
........1.......1.1.......
...................1......
....................1.....
.....................1....
......................1...
.......................1..
..1.......................
.......................1..
........................1.
.1........................
........................1.
.1........................
........................1.
.1........................
..1.......................
.......................1..
..1.......................
...1......................
....1.....................
.....1....................
......1...................
.......1.1.......1........
..........1.1.1...........
..........................
`
    ]
    const SHARD_FRAMES = [
        img`
.......ff.......
....fff99fff.5..
...f99999999555.
..f99661166995..
.f996669966699f.
.f966119999669f.
.f966991199669f.
f99199111199199f
f99199111199199f
.f966991199669f.
.f966999999669f.
.f996669966699f.
..f9966116699f..
...f99999999f...
....fff99fff....
.......ff.......
`,
        img`
.......ff.......
....fff99fff....
...f99999999f...
..f9966556699f..
.f996669966699f.
.f966119999669f.
.f966991199669f.
f99599111199599f
f99599111199599f
.f966991199669f.
.f966999999669f.
.f996669966699f.
..59966556699f..
.55599999999f...
..5.fff99fff....
.......ff.......
`
    ]
    const T_BUBBLES_A = img`
................
................
.............99.
.............9..
................
................
................
................
............1...
................
...9............
...9............
................
........99......
........9.......
................
`
    const T_BUBBLES_B = img`
................
................
.9..............
.9....99........
......9.........
..........1.....
..9.............
..9.............
................
................
................
................
................
................
................
................
`
    const T_RIPPLE_A = img`
................
................
................
..6...6.........
...666..........
................
................
................
................
................
................
................
...6..6.........
....66..........
................
................
`
    const T_RIPPLE_B = img`
................
................
................
................
................
................
................
................
................
.......6..6.....
........66......
................
.....6...6......
......666.......
................
................
`
    const T_KELP = img`
................
................
................
................
.........7...7..
.........7...7..
........7...7...
...7....7...7...
....7....7...7..
....7....7...7..
...7....7...7...
...7....7...7...
....7....7...7..
....7....7...7..
...6....6...6...
...77...77..77..
`
    const T_CORAL = img`
................
.......5........
.......44.......
.......4..1.....
....1..4..33....
....33.44.3.....
....3..4..3.....
....3..4..3344..
....33.44.3.4...
....3..4..3.4...
....3..4..3344..
....33.44.3.4...
....3.e4ee3.4...
......eeee......
......eeee......
......eeee......
`
    const T_ROCK_A = img`
ccccccbbbccccccc
ccccfcbbbccfdccc
ccccbb7cbdbccccc
ccccbb7cbbbbcccc
ccccc7cccbbbbbbc
cfccc7fbbbfcbbbc
cccccc7bbbcccccc
cccccc7bbbcccccc
ccccd7bfcccccccc
ccccbbbccccccccc
cccccccccccccccc
cccccccccccccccc
ccccccbbbdcdcccc
ccccccbbbcccccfc
cccccccccccccccc
cccccccccccccccc
`
    const T_ROCK_B = img`
fccccfcbbbcccccc
cccbbbcbbbcccccc
cccbbbcccccccccc
cccccccccccccccc
cbbbcccdc333cccc
cbbbccccc333cccc
cccccccccc4ccdcc
cbbbcccccc4cbbbc
cbbbcccccc4cbbbc
ccbfbcdccccccccc
ccbbbccbbbcccccc
dccccccbbbcccccc
ccccccbbbccfdbbc
ccccccbbbcccbbbc
ffcccccccccccccc
cccccccccccccccc
`
    const T_ROCK_C = img`
cccccccccbbbcccc
bbbccccccbbbcccc
bbbccccccccccccc
cccccccccbbbcccc
ccccbbbccbbbcccc
fbbbbbbccccccccc
cbbbbcfcccdccccc
ccbbbccccccccccc
cccccdcdcccccdcc
cccccccccccccccc
cccccccccbbbbbbc
ccbbbccccbbbdbbc
ccbbbccccccccccc
fccccccccccccccc
ccccffcfccccccfc
cccccccccccccccc
`

    // ---------- helpers (hidden from students) ----------
    function arenaW(): number { return ARENA_W_TILES * TILE }
    function arenaH(): number { return ARENA_H_TILES * TILE }
    function firstOf(kind: number): Sprite {
        const l = sprites.allOfKind(kind)
        return l.length ? l[0] : null
    }
    function findShip(): Sprite {
        for (const s of game.currentScene().allSprites) {
            const sp = s as Sprite
            if (!sp || !sp.image) continue
            const k = sp.kind()
            if (k == SpriteKind.Player || k == SpriteKind.Food || k == SpriteKind.Enemy || k == SpriteKind.Projectile || k == HUD_KIND || k == FX_KIND) continue
            return sp
        }
        return null
    }
    function dist(a: Sprite, b: Sprite): number {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
    }
    function isFrozen(s: Sprite): boolean {
        return !!(s.data && s.data["frozen"])
    }
    function nearestTo(kind: number, from: Sprite, skipFrozen: boolean): Sprite {
        if (!from) return null
        let best: Sprite = null
        let bestD = 99999
        for (const s of sprites.allOfKind(kind)) {
            if (skipFrozen && isFrozen(s)) continue
            const d = dist(s, from)
            if (d < bestD) { best = s; bestD = d }
        }
        return best
    }
    // ---------- map helpers (hidden from students) ----------
    // true for rock the drone must fly around (the outer border does not count)
    function rockAt(tx: number, ty: number): boolean {
        if (tx < 1 || ty < 1 || tx > ARENA_W_TILES - 2 || ty > ARENA_H_TILES - 2) return false
        return !!mapSolid[ty * ARENA_W_TILES + tx]
    }
    function solidAt(tx: number, ty: number): boolean {
        if (tx < 0 || ty < 0 || tx >= ARENA_W_TILES || ty >= ARENA_H_TILES) return true
        return !!mapSolid[ty * ARENA_W_TILES + tx]
    }
    // open water with a tile of room around it (the drone is about two tiles wide)
    function passable(tx: number, ty: number): boolean {
        if (solidAt(tx, ty)) return false
        if (!hasInteriorWalls) return true
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (rockAt(tx + dx, ty + dy)) return false
            }
        }
        return true
    }
    function spotFree(x: number, y: number): boolean {
        return passable(Math.floor(x / TILE), Math.floor(y / TILE))
    }
    // could the drone sit here without touching rock?
    function rectFree(x: number, y: number): boolean {
        const x0 = Math.floor((x - 11) / TILE)
        const x1 = Math.floor((x + 11) / TILE)
        const y0 = Math.floor((y - 8) / TILE)
        const y1 = Math.floor((y + 8) / TILE)
        return !rockAt(x0, y0) && !rockAt(x1, y0) && !rockAt(x0, y1) && !rockAt(x1, y1)
    }
    function lineClear(x0: number, y0: number, x1: number, y1: number): boolean {
        const dx = x1 - x0
        const dy = y1 - y0
        const n = Math.max(1, Math.ceil(Math.sqrt(dx * dx + dy * dy) / 5))
        for (let i = 1; i <= n; i++) {
            if (!rectFree(x0 + dx * i / n, y0 + dy * i / n)) return false
        }
        return true
    }
    // a map of how many tiles each open tile is from the goal (breadth-first search)
    function planPath(gx: number, gy: number): void {
        const w = ARENA_W_TILES
        const h = ARENA_H_TILES
        pathDist = []
        for (let i = 0; i < w * h; i++) pathDist.push(-1)
        let best = -1
        let bestD = 999999
        for (let ty = 1; ty < h - 1; ty++) {
            for (let tx = 1; tx < w - 1; tx++) {
                if (!passable(tx, ty)) continue
                const d = (tx - gx) * (tx - gx) + (ty - gy) * (ty - gy)
                if (d < bestD) { bestD = d; best = ty * w + tx }
            }
        }
        if (best < 0) return
        const queue = [best]
        pathDist[best] = 0
        let head = 0
        while (head < queue.length) {
            const c = queue[head]
            head += 1
            const cx = c % w
            const cy = Math.floor(c / w)
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx == 0 && dy == 0) continue
                    const nx = cx + dx
                    const ny = cy + dy
                    if (nx < 1 || ny < 1 || nx > w - 2 || ny > h - 2) continue
                    if (pathDist[ny * w + nx] >= 0 || !passable(nx, ny)) continue
                    if (dx != 0 && dy != 0 && (!passable(cx + dx, cy) || !passable(cx, cy + dy))) continue
                    pathDist[ny * w + nx] = pathDist[c] + 1
                    queue.push(ny * w + nx)
                }
            }
        }
    }
    function moveToward(d: Sprite, tx: number, ty: number, stepLen: number): void {
        const dx = tx - d.x
        const dy = ty - d.y
        autoDx = dx
        const m = Math.max(1, Math.sqrt(dx * dx + dy * dy))
        const step = Math.min(m, stepLen)
        d.x = Math.max(TILE * 1.5, Math.min(arenaW() - TILE * 1.5, d.x + dx / m * step))
        d.y = Math.max(TILE * 1.5, Math.min(arenaH() - TILE * 1.5, d.y + dy / m * step))
    }
    // moving away from a buoy: slide along rock instead of pushing into it
    function slideStep(d: Sprite, tx: number, ty: number, stepLen: number): void {
        const dx = tx - d.x
        const dy = ty - d.y
        autoDx = dx
        const m = Math.max(1, Math.sqrt(dx * dx + dy * dy))
        const step = Math.min(m, stepLen)
        const nx = Math.max(TILE * 1.5, Math.min(arenaW() - TILE * 1.5, d.x + dx / m * step))
        const ny = Math.max(TILE * 1.5, Math.min(arenaH() - TILE * 1.5, d.y + dy / m * step))
        if (rectFree(nx, ny)) { d.x = nx; d.y = ny }
        else if (rectFree(nx, d.y)) d.x = nx
        else if (rectFree(d.x, ny)) d.y = ny
    }
    // fly to (tx, ty) around any rock in the way
    function followPath(d: Sprite, tx: number, ty: number, stepLen: number): void {
        const w = ARENA_W_TILES
        const h = ARENA_H_TILES
        const gx = Math.floor(tx / TILE)
        const gy = Math.floor(ty / TILE)
        const goal = gy * w + gx
        if (goal != pathGoal || game.runtime() > pathReplanAt) {
            planPath(gx, gy)
            pathGoal = goal
            pathReplanAt = game.runtime() + 500
        }
        let cx = Math.floor(d.x / TILE)
        let cy = Math.floor(d.y / TILE)
        let cur = (cx >= 0 && cy >= 0 && cx < w && cy < h) ? pathDist[cy * w + cx] : -1
        if (cur < 0) {
            // off the plotted route (for example pushed by a current): head for the closest plotted tile
            let bd = 999999
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx = Math.floor(d.x / TILE) + dx
                    const ny = Math.floor(d.y / TILE) + dy
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
                    if (pathDist[ny * w + nx] >= 0 && dx * dx + dy * dy < bd) { bd = dx * dx + dy * dy; cx = nx; cy = ny; cur = pathDist[ny * w + nx] }
                }
            }
            if (cur < 0) { moveToward(d, tx, ty, stepLen); return }
            moveToward(d, cx * TILE + TILE / 2, cy * TILE + TILE / 2, stepLen)
            return
        }
        if (cur == 0) { moveToward(d, tx, ty, stepLen); return }
        let bx = cx
        let by = cy
        let bv = cur
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx == 0 && dy == 0) continue
                const nx = cx + dx
                const ny = cy + dy
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
                const v = pathDist[ny * w + nx]
                if (v < 0 || v >= bv) continue
                if (dx != 0 && dy != 0 && (!passable(cx + dx, cy) || !passable(cx, cy + dy))) continue
                bv = v
                bx = nx
                by = ny
            }
        }
        moveToward(d, bx * TILE + TILE / 2, by * TILE + TILE / 2, stepLen)
    }
    function mapName(): string {
        if (oceanMap == OceanMap.Shipwrecks) return "Shipwreck graveyard"
        if (oceanMap == OceanMap.Caves) return "Caves"
        if (oceanMap == OceanMap.Currents) return "Currents"
        return "Open water"
    }

    function placeAtRandom(s: Sprite, awayFrom: Sprite, minDist: number): void {
        for (let tries = 0; tries < 60; tries++) {
            s.setPosition(randint(2 * TILE, arenaW() - 2 * TILE), randint(2 * TILE, arenaH() - 2 * TILE))
            if (spotFree(s.x, s.y) && (!awayFrom || dist(s, awayFrom) >= minDist)) return
        }
    }
    // data pods never appear on top of the ship or right next to the drone
    function placePod(s: Sprite, drone: Sprite): void {
        const ship = findShip()
        for (let tries = 0; tries < 60; tries++) {
            s.setPosition(randint(2 * TILE, arenaW() - 2 * TILE), randint(2 * TILE, arenaH() - 2 * TILE))
            if (spotFree(s.x, s.y) && (!drone || dist(s, drone) >= 60) && (!ship || dist(s, ship) >= 48)) return
        }
    }
    function drift(b: Sprite): void {
        b.setVelocity(randint(-40, 40), randint(-40, 40))
    }
    function spawnBuoy(): void {
        const b = sprites.create(BUOY_FRAMES[0], SpriteKind.Enemy)
        placeAtRandom(b, firstOf(SpriteKind.Player), 90)
        drift(b)
        b.setBounceOnWall(true)
        animation.runImageAnimation(b, BUOY_FRAMES, 500, true)
    }
    function adviceLabel(): string {
        if (!adviceSet) return "Advisor offline"
        if (currentAdvice == Advice.Avoid) return "Avoid"
        if (currentAdvice == Advice.Upload) return "Upload"
        return "Collect"
    }
    function clock(ms: number): string {
        const secs = Math.floor(ms / 1000)
        const s = secs % 60
        return Math.floor(secs / 60) + ":" + (s < 10 ? "0" : "") + s
    }
    function missionReport(): string {
        const total = Math.max(1, game.runtime() - startedAt)
        let text = "MISSION COMPLETE! Time " + clock(total) + ". Trips: " + trips + ". Data uploaded: " + uploaded + ". Data lost: " + dataLost + ". Pulses used: " + pulsesUsed + ". Autopilot flew " + Math.round(100 * autoMs / total) + "% of the mission."
        text += " Map: " + mapName() + "."
        if (adaptive) text += " Your advisor ended with a danger radius of " + DANGER_RADIUS + "."
        return text
    }

    // ---------- the ocean ----------
    function plankTile(seed: number): Image {
        const im = image.create(TILE, TILE)
        im.fill(14)
        for (let y = 0; y < TILE; y++) {
            if (y % 5 == 4) {
                for (let x = 0; x < TILE; x++) im.setPixel(x, y, 12)
            } else {
                im.setPixel((seed * 5 + Math.floor(y / 5) * 7 + 3) % TILE, y, 12)
            }
        }
        im.setPixel((seed * 3 + 2) % TILE, 1, 7)
        im.setPixel((seed * 7 + 9) % TILE, 7, 7)
        im.setPixel((seed * 5 + 11) % TILE, 12, 6)
        im.setPixel((seed * 2 + 5) % TILE, 2, 13)
        im.setPixel((seed * 4 + 1) % TILE, 8, 13)
        return im
    }
    // a faint arrow that shows which way a current flows (0 right, 1 left, 2 down, 3 up)
    function flowTile(dir: number): Image {
        const im = image.create(TILE, TILE)
        for (let i = 0; i < 5; i++) {
            const a = 6 + i
            const b1 = 3 + i
            const b2 = 12 - i
            if (dir == 0) { im.setPixel(a, b1, 9); im.setPixel(a, b2, 9) }
            else if (dir == 1) { im.setPixel(15 - a, b1, 9); im.setPixel(15 - a, b2, 9) }
            else if (dir == 2) { im.setPixel(b1, a, 9); im.setPixel(b2, a, 9) }
            else { im.setPixel(b1, 15 - a, 9); im.setPixel(b2, 15 - a, 9) }
        }
        return im
    }
    // solid rock (kind 0) or wreck planks (kind 1) from tile (x0, y0) to (x1, y1)
    function fillSolid(x0: number, y0: number, x1: number, y1: number, kind: number): void {
        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                if (x < 1 || y < 1 || x > ARENA_W_TILES - 2 || y > ARENA_H_TILES - 2) continue
                if (x <= 11 && y <= 8) continue
                mapSolid[y * ARENA_W_TILES + x] = true
                mapTile[y * ARENA_W_TILES + x] = kind == 1 ? 10 + randint(0, 1) : 7 + randint(0, 2)
                hasInteriorWalls = true
            }
        }
    }
    // a band of current: tiles (x0, y0) to (x1, y1) push the drone by (vx, vy) pixels per second
    function addCurrent(x0: number, y0: number, x1: number, y1: number, vx: number, vy: number): void {
        currentZones.push([x0, y0, x1, y1, vx, vy])
        const arrow = vx > 0 ? 12 : (vx < 0 ? 13 : (vy > 0 ? 14 : 15))
        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                if ((x + y * 2) % 4 == 0 && !mapSolid[y * ARENA_W_TILES + x]) mapTile[y * ARENA_W_TILES + x] = arrow
            }
        }
    }
    function startCurrents(): void {
        if (currentsStarted) return
        currentsStarted = true
        game.onUpdate(function () {
            if (!currentZones.length) return
            const d = firstOf(SpriteKind.Player)
            if (!d) return
            const dt = game.eventContext().deltaTime
            const tx = Math.floor(d.x / TILE)
            const ty = Math.floor(d.y / TILE)
            for (const z of currentZones) {
                if (tx >= z[0] && tx <= z[2] && ty >= z[1] && ty <= z[3]) {
                    d.x += z[4] * dt
                    d.y += z[5] * dt
                }
            }
        })
        // light streaks drifting along the currents
        game.onUpdateInterval(110, function () {
            if (!currentZones.length) return
            const z = currentZones[randint(0, currentZones.length - 1)]
            const flat = z[4] != 0
            const streak = flat ? image.create(7, 1) : image.create(1, 7)
            streak.fill(9)
            const s = sprites.create(streak, FX_KIND)
            s.setFlag(SpriteFlag.Ghost, true)
            s.setPosition(randint(z[0], z[2]) * TILE + randint(0, TILE - 1), randint(z[1], z[3]) * TILE + randint(0, TILE - 1))
            s.setVelocity(z[4] * 2, z[5] * 2)
            s.lifespan = 800
        })
    }
    function buildTiles(map: OceanMap): void {
        const w = ARENA_W_TILES
        const h = ARENA_H_TILES
        mapSolid = []
        mapTile = []
        currentZones = []
        hasInteriorWalls = false
        oceanMap = map
        pathGoal = -1
        for (let i = 0; i < w * h; i++) {
            mapSolid.push(false)
            mapTile.push(0)
        }
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (x == 0 || y == 0 || x == w - 1 || y == h - 1) {
                    mapSolid[y * w + x] = true
                    mapTile[y * w + x] = 7 + randint(0, 2)
                }
            }
        }
        if (map == OceanMap.Shipwrecks) {
            // three old wrecks and a few rock piles to fly around
            fillSolid(15, 6, 20, 6, 1)
            fillSolid(14, 7, 21, 7, 1)
            fillSolid(15, 8, 20, 8, 1)
            fillSolid(17, 4, 17, 5, 1)
            fillSolid(24, 11, 25, 14, 1)
            fillSolid(25, 15, 26, 18, 1)
            fillSolid(6, 14, 10, 14, 1)
            fillSolid(5, 15, 11, 15, 1)
            fillSolid(6, 16, 10, 16, 1)
            fillSolid(18, 16, 19, 17, 0)
            fillSolid(13, 20, 14, 20, 0)
            fillSolid(28, 5, 29, 6, 0)
            fillSolid(3, 10, 3, 10, 0)
        } else if (map == OceanMap.Caves) {
            fillSolid(8, 11, 20, 12, 0)
            fillSolid(8, 17, 20, 18, 0)
            fillSolid(24, 1, 25, 14, 0)
            fillSolid(28, 17, 29, 19, 0)
        } else if (map == OceanMap.Currents) {
            addCurrent(3, 9, 28, 13, 40, 0)
            addCurrent(22, 14, 29, 22, 0, -40)
            addCurrent(2, 15, 11, 21, -35, 0)
        }
        // sea life on the open tiles that have nothing else on them
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                if (mapSolid[y * w + x] || mapTile[y * w + x] != 0) continue
                const roll = randint(0, 99)
                let t = 0
                if (roll < 5) t = 1 + randint(0, 1)
                else if (roll < 17) t = 3 + randint(0, 1)
                else if (roll < 20) t = 5
                else if (roll < 22) t = 6
                mapTile[y * w + x] = t
            }
        }
        const data = control.createBuffer(4 + w * h)
        data.setNumber(NumberFormat.UInt16LE, 0, w)
        data.setNumber(NumberFormat.UInt16LE, 2, h)
        const walls = image.create(w, h)
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                data.setUint8(4 + y * w + x, mapTile[y * w + x])
                if (mapSolid[y * w + x]) walls.setPixel(x, y, 1)
            }
        }
        const water = image.create(TILE, TILE)
        tiles.setCurrentTilemap(tiles.createTilemap(data, walls, [water, T_BUBBLES_A, T_BUBBLES_B, T_RIPPLE_A, T_RIPPLE_B, T_KELP, T_CORAL, T_ROCK_A, T_ROCK_B, T_ROCK_C, plankTile(1), plankTile(3), flowTile(0), flowTile(1), flowTile(2), flowTile(3)], TileScale.Sixteen))
        scene.setBackgroundImage(oceanBackdrop())
        if (currentZones.length) startCurrents()
    }

    //% block="build the ocean arena"
    export function buildOcean(): void {
        buildTiles(OceanMap.OpenWater)
        startedAt = game.runtime()
        if (faceStarted) return
        faceStarted = true
        // the drone turns to face the way it is travelling
        game.onUpdate(function () {
            const d = firstOf(SpriteKind.Player)
            if (!d) return
            let dir = 0
            if (autopilotOn && autoDx != 0) dir = autoDx
            else if (d.vx > 5) dir = 1
            else if (d.vx < -5) dir = -1
            if (dir > 0 && !facingRight) { d.image.flipX(); facingRight = true }
            else if (dir < 0 && facingRight) { d.image.flipX(); facingRight = false }
        })
    }

    //% block="choose ocean map $map"
    export function chooseOceanMap(map: OceanMap): void {
        buildTiles(map)
    }

    // light shafts near the top, deeper and darker toward the bottom of the screen
    function oceanBackdrop(): Image {
        const bg = image.create(160, 120)
        bg.fill(8)
        for (let y = 0; y < 70; y++) {
            for (let x = 0; x < 160; x++) {
                const band = (x + y * 2) % 48
                if (band < 7 && (x + y) % 2 == 0 && y < 62 - band * 3) bg.setPixel(x, y, 6)
            }
        }
        for (let y = 104; y < 120; y++) {
            for (let x = 0; x < 160; x++) {
                if ((y > 112 && (x + y) % 3 == 0) || (x % 6 == 0 && y % 4 == 0)) bg.setPixel(x, y, 15)
            }
        }
        return bg
    }

    // ---------- data ----------
    //% block="place data randomly"
    export function placeDataRandomly(): void {
        const shards: Sprite[] = []
        for (const s of sprites.allOfKind(SpriteKind.Food)) shards.push(s)
        if (!shards.length) return
        const model = shards[0]
        while (shards.length < SHARD_COUNT) {
            shards.push(sprites.create(model.image.clone(), SpriteKind.Food))
        }
        const d = firstOf(SpriteKind.Player)
        for (const s of shards) {
            placePod(s, d)
            if (s.image.equals(SHARD_FRAMES[0])) animation.runImageAnimation(s, SHARD_FRAMES, 450, true)
        }
    }

    //% block="enable data collection (max $capacity)"
    //% capacity.defl=3 capacity.min=1 capacity.max=20
    export function enableDataCollection(capacity: number = 3): void {
        if (capacity && capacity > 0) {
            MAX_CARGO = capacity | 0
        }
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (drone, food) {
            if (cargo >= MAX_CARGO) {
                drone.sayText("Storage full!", 400)
                music.thump.play()
                return
            }
            cargo += 1
            music.baDing.play()
            placePod(food, drone)
        })
    }

    // ---------- buoys ----------
    //% block="spawn enemy buoys (count %count)"
    //% count.defl=1 count.min=1 count.max=5
    export function spawnEnemyBuoys(count: number): void {
        count = Math.floor(Math.max(1, Math.min(MAX_BUOYS, count)))
        for (let i = 0; i < count; i++) spawnBuoy()
    }

    //% block="enable buoy bump"
    export function enableBuoyBump(): void {
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (drone, buoy) {
            if (hitCooldown || isFrozen(buoy)) return
            hitCooldown = true
            if (cargo > 0) {
                dataLost += cargo
                cargo = 0
                drone.sayText("Data lost!", 600)
                music.zapped.play()
                scene.cameraShake(4, 200)
                if (adaptive) DANGER_RADIUS = Math.min(80, DANGER_RADIUS + 6)
            } else {
                music.thump.play()
            }
            const kx = drone.x - buoy.x
            const ky = drone.y - buoy.y
            const L = Math.max(1, Math.sqrt(kx * kx + ky * ky))
            drone.x += (kx / L) * 8
            drone.y += (ky / L) * 8
            control.runInParallel(function () {
                pause(800)
                hitCooldown = false
            })
        })
    }

    //% block="set pulse picture to $look"
    //% look.shadow=screen_image_picker
    export function setPulseLook(look: Image): void {
        pulseLook = look
    }

    //% block="enable pulse to disable buoy"
    export function enablePulse(): void {
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            const drone = firstOf(SpriteKind.Player)
            if (!drone) return
            const now = game.runtime()
            if (now < pulseReadyAt) {
                drone.sayText("Recharging...", 400)
                return
            }
            pulseReadyAt = now + PULSE_COOLDOWN_MS
            pulsesUsed += 1
            let vx = 0
            let vy = -120
            const target = nearestTo(SpriteKind.Enemy, drone, false)
            if (target) {
                const dx = target.x - drone.x
                const dy = target.y - drone.y
                const m = Math.max(1, Math.sqrt(dx * dx + dy * dy))
                vx = Math.round(120 * dx / m)
                vy = Math.round(120 * dy / m)
            }
            const pulse = sprites.createProjectileFromSprite(pulseLook ? pulseLook.clone() : PULSE_FRAMES[0], drone, vx, vy)
            pulse.lifespan = 1000
            if (!pulseLook) animation.runImageAnimation(pulse, PULSE_FRAMES, 90, true)
            music.pewPew.play()
            // Active sonar gives away your position: buoys swing toward you for a moment.
            for (const b of sprites.allOfKind(SpriteKind.Enemy)) {
                if (isFrozen(b)) continue
                const dx = drone.x - b.x
                const dy = drone.y - b.y
                const m = Math.max(1, Math.sqrt(dx * dx + dy * dy))
                b.setVelocity(Math.round(55 * dx / m), Math.round(55 * dy / m))
            }
            control.runInParallel(function () {
                pause(1500)
                for (const b of sprites.allOfKind(SpriteKind.Enemy)) {
                    if (!isFrozen(b)) drift(b)
                }
            })
        })
        sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (p, buoy) {
            p.destroy(effects.disintegrate, 100)
            if (isFrozen(buoy)) return
            if (!buoy.data) buoy.data = {}
            buoy.data["frozen"] = true
            buoy.setVelocity(0, 0)
            buoy.startEffect(effects.halo, 3000)
            music.zapped.play()
            control.runInParallel(function () {
                pause(3000)
                buoy.data["frozen"] = false
                drift(buoy)
            })
        })
    }

    // ---------- the ship ----------
    // Students build the "when the drone touches the ship" rule themselves:
    //   on overlap (Player, Ship): change score by data carried, then complete the upload.
    // The overlap event fires on every frame while the drone sits on the ship,
    // so an upload can never be missed (even if the cargo fills up while touching it).
    //% block="complete the upload"
    export function completeUpload(): void {
        const ship = findShip()
        if (cargo > 0) {
            const n = cargo
            trips += 1
            uploaded += n
            cargo = 0
            music.powerUp.play()
            if (adaptive) DANGER_RADIUS = Math.max(16, DANGER_RADIUS - 2)
            if (sprites.allOfKind(SpriteKind.Enemy).length < MAX_BUOYS) {
                spawnBuoy()
                if (ship) ship.sayText("Uploaded " + n + " - new buoy!", 700)
            } else {
                if (ship) ship.sayText("Uploaded " + n, 600)
            }
        } else if (game.runtime() > noDataUntil) {
            noDataUntil = game.runtime() + 1500
            if (ship) ship.sayText("No data", 400)
            music.thump.play()
        }
    }

    // ---------- the advisor ----------
    //% block="set mission tuning max cargo $max upload at $uploadAt danger radius $radius"
    export function setMissionTuning(max: number, uploadAt: number, radius: number): void {
        MAX_CARGO = Math.max(1, max | 0)
        UPLOAD_AT = Math.max(1, uploadAt | 0)
        DANGER_RADIUS = Math.max(8, radius | 0)
    }

    //% block="setup advisor HUD"
    export function setupAdvisorHUD(): void {
        if (!hud) {
            hud = sprites.create(img`.`, HUD_KIND)
            hud.setFlag(SpriteFlag.RelativeToCamera, true)
            hud.setPosition(48, 25)
        }
        game.onUpdateInterval(350, function () {
            const suffix = cargo >= MAX_CARGO ? "FULL" : cargo + "/" + MAX_CARGO
            hud.sayText(adviceLabel() + " | data " + suffix + (autopilotOn ? " | AUTO" : ""), 400)
        })
    }

    //% block="set advice to $advice"
    export function setAdvice(advice: Advice): void {
        currentAdvice = advice
        adviceSet = true
    }

    //% block="distance to nearest buoy"
    export function distanceToNearestBuoy(): number {
        const drone = firstOf(SpriteKind.Player)
        const b = nearestTo(SpriteKind.Enemy, drone, true)
        return (drone && b) ? Math.round(dist(drone, b)) : 999
    }

    //% block="data carried"
    export function dataCarried(): number {
        return cargo
    }

    //% block="danger radius"
    export function dangerRadius(): number {
        return DANGER_RADIUS
    }

    //% block="upload at"
    export function uploadAt(): number {
        return UPLOAD_AT
    }

    // ---------- autopilot, learning, and the win ----------
    //% block="enable autopilot (press B to switch)"
    export function enableAutopilot(): void {
        controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
            const drone = firstOf(SpriteKind.Player)
            if (!drone) return
            if (!adviceSet) {
                drone.sayText("Build your advisor first!", 1200)
                return
            }
            autopilotOn = !autopilotOn
            autoDx = 0
            drone.sayText(autopilotOn ? "Autopilot ON" : "Autopilot OFF", 800)
        })
        game.onUpdate(function () {
            if (!autopilotOn || !adviceSet) return
            const drone = firstOf(SpriteKind.Player)
            if (!drone) return
            const dt = game.eventContext().deltaTime
            autoMs += Math.round(dt * 1000)
            let tx = drone.x
            let ty = drone.y
            if (currentAdvice == Advice.Avoid) {
                const b = nearestTo(SpriteKind.Enemy, drone, true)
                if (b) { tx = drone.x + (drone.x - b.x); ty = drone.y + (drone.y - b.y) }
            } else if (currentAdvice == Advice.Upload) {
                const s = findShip()
                if (s) { tx = s.x; ty = s.y }
            } else {
                const f = nearestTo(SpriteKind.Food, drone, false)
                if (f) { tx = f.x; ty = f.y }
            }
            const stepLen = (info.score() >= 5 ? 120 : 100) * dt
            if (!hasInteriorWalls) {
                moveToward(drone, tx, ty, stepLen)
            } else if (currentAdvice == Advice.Avoid) {
                slideStep(drone, tx, ty, stepLen)
            } else if (lineClear(drone.x, drone.y, tx, ty)) {
                moveToward(drone, tx, ty, stepLen)
            } else {
                followPath(drone, tx, ty, stepLen)
            }
        })
    }

    //% block="let the advisor learn from mistakes"
    export function enableAdaptiveAdvisor(): void {
        adaptive = true
    }

    //% block="win when score ≥ $threshold"
    export function enableWinAtScore(threshold: number): void {
        game.onUpdate(function () {
            if (won) return
            if (info.score() >= threshold) {
                won = true
                control.runInParallel(function () {
                    game.showLongText(missionReport(), DialogLayout.Center)
                    game.over(true, effects.confetti)
                })
            }
        })
    }
}
