// Operation Uplink: the shared game blocks.
// This is the ONE source for the code hidden inside every tutorial.
// After editing, run:  python tools/sync_custom.py
namespace SpriteKind {
    export const Ship = SpriteKind.create()
    export const HUD = SpriteKind.create()
}

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

    // Game state
    let cargo = 0
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

    const BUOY_IMG = img`
..................
........ddddd.....
........ddddd.....
..........dd......
..........dd......
..........bb......
..........bb......
.......b..bb.b....
.......bb.bb.bb...
.......bbbbbbbb...
....fc6444b44fc6..
....fc6444444fc6..
..ff4b62222224ef..
..ff4b64444444ef..
..ff4b64444444ef..
....fe46b4444ff...
....fe46bbbbbf....
........66666.....
`
    const PULSE_IMG = img`
. . 8 8 f f f f f f 8 8 . .
. 6 8 f f f f f f f f 8 6 .
6 8 f f c c c c c c f f 8 6
8 f f c 8 8 8 8 8 8 c f f 8
8 f f c 8 8 8 8 8 8 c f f 8
6 8 f f c c c c c c f f 8 6
. 6 8 f f f f f f f f 8 6 .
. . 8 8 f f f f f f 8 8 . .
`

    // ---------- helpers (hidden from students) ----------
    function arenaW(): number { return ARENA_W_TILES * TILE }
    function arenaH(): number { return ARENA_H_TILES * TILE }
    function firstOf(kind: number): Sprite {
        const l = sprites.allOfKind(kind)
        return l.length ? l[0] : null
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
        const b = sprites.create(BUOY_IMG, SpriteKind.Enemy)
        placeAtRandom(b, firstOf(SpriteKind.Player), 90)
        drift(b)
        b.setBounceOnWall(true)
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
                    t = 2
                    walls.setPixel(x, y, 1)
                } else if (randint(0, 9) == 0) {
                    t = 1
                }
                data.setUint8(4 + y * w + x, t)
            }
        }
        const water = image.create(TILE, TILE)
        const bubbles = image.create(TILE, TILE)
        bubbles.setPixel(3, 4, 9)
        bubbles.setPixel(4, 3, 9)
        bubbles.setPixel(4, 4, 9)
        bubbles.setPixel(11, 11, 9)
        bubbles.setPixel(12, 10, 9)
        bubbles.setPixel(11, 10, 9)
        const rock = image.create(TILE, TILE)
        rock.fill(12)
        rock.drawRect(0, 0, TILE, TILE, 11)
        rock.setPixel(4, 5, 11)
        rock.setPixel(10, 3, 11)
        rock.setPixel(7, 11, 11)
        rock.setPixel(12, 12, 11)
        tiles.setCurrentTilemap(tiles.createTilemap(data, walls, [water, bubbles, rock], TileScale.Sixteen))
        scene.setBackgroundColor(8)
        startedAt = game.runtime()
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
        for (const s of shards) placeAtRandom(s, d, 50)
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
            const pulse = sprites.createProjectileFromSprite(PULSE_IMG, drone, vx, vy)
            pulse.lifespan = 1000
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
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Ship, function (drone, ship) {
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
            hud = sprites.create(img`.`, SpriteKind.HUD)
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
                const s = firstOf(SpriteKind.Ship)
                if (s) { tx = s.x; ty = s.y }
            } else {
                const f = nearestTo(SpriteKind.Food, drone, false)
                if (f) { tx = f.x; ty = f.y }
            }
            const dx = tx - drone.x
            const dy = ty - drone.y
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
