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
    let overShip = false
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
            if (k == SpriteKind.Player || k == SpriteKind.Food || k == SpriteKind.Enemy || k == SpriteKind.Projectile || k == HUD_KIND) continue
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
    function placeAtRandom(s: Sprite, awayFrom: Sprite, minDist: number): void {
        for (let tries = 0; tries < 25; tries++) {
            s.setPosition(randint(2 * TILE, arenaW() - 2 * TILE), randint(2 * TILE, arenaH() - 2 * TILE))
            if (!awayFrom || dist(s, awayFrom) >= minDist) return
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
        if (adaptive) text += " Your advisor ended with a danger radius of " + DANGER_RADIUS + "."
        return text
    }

    // ---------- the ocean ----------
    //% block="build the ocean arena"
    export function buildOcean(): void {
        const w = ARENA_W_TILES
        const h = ARENA_H_TILES
        const data = control.createBuffer(4 + w * h)
        data.setNumber(NumberFormat.UInt16LE, 0, w)
        data.setNumber(NumberFormat.UInt16LE, 2, h)
        const walls = image.create(w, h)
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let t = 0
                if (x == 0 || y == 0 || x == w - 1 || y == h - 1) {
                    t = 7 + randint(0, 2)
                    walls.setPixel(x, y, 1)
                } else {
                    const roll = randint(0, 99)
                    if (roll < 5) t = 1 + randint(0, 1)
                    else if (roll < 17) t = 3 + randint(0, 1)
                    else if (roll < 20) t = 5
                    else if (roll < 22) t = 6
                }
                data.setUint8(4 + y * w + x, t)
            }
        }
        const water = image.create(TILE, TILE)
        tiles.setCurrentTilemap(tiles.createTilemap(data, walls, [water, T_BUBBLES_A, T_BUBBLES_B, T_RIPPLE_A, T_RIPPLE_B, T_KELP, T_CORAL, T_ROCK_A, T_ROCK_B, T_ROCK_C], TileScale.Sixteen))
        scene.setBackgroundImage(oceanBackdrop())
        startedAt = game.runtime()
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
            placeAtRandom(s, d, 50)
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
            placeAtRandom(food, drone, 60)
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
            const pulse = sprites.createProjectileFromSprite(PULSE_FRAMES[0], drone, vx, vy)
            pulse.lifespan = 1000
            animation.runImageAnimation(pulse, PULSE_FRAMES, 90, true)
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
    //% block="enable upload at ship"
    export function enableUploadAtShip(): void {
        game.onUpdate(function () {
            const drone = firstOf(SpriteKind.Player)
            const ship = findShip()
            if (!drone || !ship) return
            const touching = drone.overlapsWith(ship)
            if (touching && !overShip) {
                if (cargo > 0) {
                    const n = cargo
                    info.changeScoreBy(n)
                    trips += 1
                    uploaded += n
                    cargo = 0
                    music.powerUp.play()
                    if (adaptive) DANGER_RADIUS = Math.max(16, DANGER_RADIUS - 2)
                    if (sprites.allOfKind(SpriteKind.Enemy).length < MAX_BUOYS) {
                        spawnBuoy()
                        ship.sayText("Uploaded " + n + " - new buoy!", 700)
                    } else {
                        ship.sayText("Uploaded " + n, 600)
                    }
                } else {
                    ship.sayText("No data", 400)
                    music.thump.play()
                }
            }
            overShip = touching
        })
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
            const dx = tx - drone.x
            const dy = ty - drone.y
            autoDx = dx
            const m = Math.max(1, Math.sqrt(dx * dx + dy * dy))
            const step = Math.min(m, (info.score() >= 5 ? 120 : 100) * dt)
            drone.x = Math.max(TILE * 1.5, Math.min(arenaW() - TILE * 1.5, drone.x + dx / m * step))
            drone.y = Math.max(TILE * 1.5, Math.min(arenaH() - TILE * 1.5, drone.y + dy / m * step))
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
