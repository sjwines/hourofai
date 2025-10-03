# Challenge Lab: Polish & Experiment
### @explicitHints true

## Welcome @showdialog

Time to tune, test, and tinker!

## Mini Challenges 

Pick a few mini-challenges below to make your game more interesting, harder, or just yours. 

---

**Pick as many as you would like:**
- Add or edit sprites
- Add more enemies by calling custom.spawnEnemyBuoy() more times.
- Change the carry limit
- Change the win goal
- Add a timer to add presure to collect the data shards with info.startCountDown(45)
- Make the drone faster or slower with controller.moveSprite(myDrone, 110, 110)
- Or any other idea you have! Have fun and the possiblities are endless!

## {Finale}
👏 Congratulations on successfully securing the stolen documents!

When you're finished, click **Done** to finish the activity.

```blockconfig.global
custom.placeDataRandomly()
custom.enableDataCollection()
custom.spawnEnemyBuoy()
custom.enableBuoyBump()
custom.enablePulse()
custom.enableUploadAtShip()
custom.setupAdvisorHUD()
custom.setMissionTuning(3, 3, 32)
custom.enableWinAtScore(15)
```

```template
scene.setBackgroundColor(9)
namespace SpriteKind { export const Ship = SpriteKind.create(); export const DronePulse = SpriteKind.create(); export const HUD = SpriteKind.create(); }

// DRONE
let myDrone = sprites.create(img`
....................
....................
....................
....................
....................
........f...........
........fcf.........
........fcc.........
....cf.f4444444f....
....fc54444ffc44f...
....fc44444fcff4....
....cc44444fcfff....
....cff4544fff4f....
.......fcf4444......
.......ff...........
....................
....................
....................
....................
....................
`, SpriteKind.Player)
controller.moveSprite(myDrone, 80, 80)
scene.cameraFollowSprite(myDrone)

// SHIP
let myShip = sprites.create(img`
    ..............................
    ..............................
    ..............................
    ..............................
    ..............................
    ..............................
    .............c................
    ...........ccc................
    .............c................
    ...........bbbccc.............
    ...........cccccc.............
    ..cccccccccbbbccc.............
    ..cbccbbbbbccccccccccccccccc..
    ....bbbbbbbbbbbbbbcccbbbcccc..
    ....ccccccccccccccccccccc.....
    ....cc2222222222222222222.....
    ..............................
    ..............................
    ..............................
    ..............................
`, SpriteKind.Ship)
myShip.setPosition(20, 100)

// DATA
let myData = sprites.create(img`
    . . . . . . 9 9 9 9 9 9 . . . . 
    . . . . 9 9 6 6 6 6 6 6 9 9 . . 
    . . . 9 6 8 1 1 1 1 1 1 8 6 9 . 
    . . 9 6 8 1 9 9 c c c 9 1 8 6 9 
    . 9 6 8 1 c . 9 9 9 9 . c 1 8 6 
    . 9 6 8 1 c . 9 d d 9 . c 1 8 6 
    . 9 6 8 1 c . 9 9 9 9 . c 1 8 6 
    . 9 6 8 1 9 9 c c c c 9 1 8 6 9 
    . . 9 6 8 1 1 1 1 1 1 1 8 6 9 . 
    . . . 9 6 8 8 8 8 8 8 8 8 6 9 . 
    . . . . 9 9 6 6 6 6 6 6 9 9 . . 
    . . . . . . 9 9 9 9 9 9 . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
`, SpriteKind.Food)
myData.setPosition(60, 60)
info.setScore(0)
```

```package
winesAssets=github:sjwines/winesAssets
```

```customts
//% weight=100 color=#0fbc11 icon=""
namespace custom {
    // --- Tunables students can change later via a block ---
    export let MAX_CARGO = 3
    export let UPLOAD_AT = 3
    export let DANGER_RADIUS = 32

    // --- Private state for our helpers ---
    let cargo = 0
    let enemyBuoy: Sprite = null
    let hitCooldown = false
    let buoyDisabled = false
    let savedVX = 0
    let savedVY = 0
    let hud: Sprite = null

    function dist(a: Sprite, b: Sprite): number {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
    }

    //% block="place data randomly"
    export function placeDataRandomly(): void {
        if (typeof myData !== "undefined" && myData) {
            myData.setPosition(
                randint(16, scene.screenWidth() - 16),
                randint(16, scene.screenHeight() - 16)
            )
        }
    }

    //% block="enable data collection (max $capacity)"
    //% capacity.defl=3
    //% capacity.min=1 capacity.max=20
    export function enableDataCollection(capacity: number): void {
        // Let students’ choice drive the limit; fall back to current MAX_CARGO
        if (capacity && capacity > 0) {
            MAX_CARGO = capacity | 0
        }

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function () {
            if (cargo >= MAX_CARGO) {
                if (typeof myDrone !== "undefined" && myDrone) {
                    myDrone.sayText("Storage full!", 400)
                }
                music.thump.play()
                return
            }
            cargo += 1
            music.baDing.play()
            placeDataRandomly()
        })
    }


    //% block="spawn enemy buoy"
    export function spawnEnemyBuoy(): void {
        enemyBuoy = sprites.create(img`
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
        `, SpriteKind.Enemy)
        enemyBuoy.setPosition(120, 40)
        enemyBuoy.setVelocity(50, 35)
        enemyBuoy.setBounceOnWall(true)
    }

    //% block="enable buoy bump"
    export function enableBuoyBump(): void {
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (drone, buoy) {
            if (hitCooldown) return
            hitCooldown = true

            if (cargo > 0) {
                cargo = 0
                if (typeof myDrone !== "undefined" && myDrone) {
                    myDrone.sayText("Data lost!", 600)
                }
                music.zapped.play()
                scene.cameraShake(4, 200)
            } else {
                music.thump.play()
            }

            // light knockback
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

    //% block="set mission tuning max cargo $max upload at $uploadAt danger radius $radius"
    export function setMissionTuning(max: number, uploadAt: number, radius: number): void {
        MAX_CARGO = Math.max(1, max | 0)
        UPLOAD_AT = Math.max(1, uploadAt | 0)
        DANGER_RADIUS = Math.max(8, radius | 0)
    }

    //% block="setup advisor HUD"
    export function setupAdvisorHUD(): void {
        hud = sprites.create(img`.`, SpriteKind.HUD)
        hud.setFlag(SpriteFlag.RelativeToCamera, true)
        hud.setPosition(48, 25)

        game.onUpdateInterval(350, function () {
            let advice = "Collect"
            if (cargo >= MAX_CARGO) advice = "Upload (FULL)"
            else if (cargo >= UPLOAD_AT) advice = "Upload"
            if (
                enemyBuoy &&
                typeof myDrone !== "undefined" &&
                myDrone &&
                dist(myDrone, enemyBuoy) < DANGER_RADIUS
            ) {
                advice = "Avoid"
            }

            if (hud) {
                const suffix = cargo >= MAX_CARGO ? "FULL" : `${cargo}/${MAX_CARGO}`
                hud.sayText(`${advice}  | data ${suffix}`, 400)
            }
        })
    }

    //% block="enable upload at ship"
    export function enableUploadAtShip(): void {
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Ship, function () {
            if (cargo > 0) {
                info.changeScoreBy(cargo)
                if (typeof myShip !== "undefined" && myShip) {
                    myShip.sayText(`Uploaded ${cargo}`, 600)
                }
                music.powerUp.play()
                cargo = 0
            } else {
                if (typeof myShip !== "undefined" && myShip) {
                    myShip.sayText("No data", 400)
                }
                music.thump.play()
            }
        })
    }

    //% block="enable pulse to disable buoy"
    export function enablePulse(): void {
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            let vx = 0, vy = -120
            if (enemyBuoy && typeof myDrone !== "undefined" && myDrone) {
                vx = enemyBuoy.x - myDrone.x
                vy = enemyBuoy.y - myDrone.y
                const m = Math.max(1, Math.sqrt(vx * vx + vy * vy))
                vx = Math.round(120 * vx / m)
                vy = Math.round(120 * vy / m)
            }
            const pulse = sprites.createProjectileFromSprite(img`
                . . 8 8 f f f f f f 8 8 . .
                . 6 8 f f f f f f f f 8 6 .
                6 8 f f c c c c c c f f 8 6
                8 f f c 8 8 8 8 8 8 c f f 8
                8 f f c 8 8 8 8 8 8 c f f 8
                6 8 f f c c c c c c f f 8 6
                . 6 8 f f f f f f f f 8 6 .
                . . 8 8 f f f f f f 8 8 . .
            `, myDrone, vx, vy)
            pulse.lifespan = 1000
            music.pewPew.play()
        })

        sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (p, buoy) {
            p.destroy(effects.disintegrate, 100)
            if (buoyDisabled) return
            buoyDisabled = true
            savedVX = buoy.vx
            savedVY = buoy.vy
            buoy.setVelocity(0, 0)
            buoy.startEffect(effects.halo, 3000)
            music.zapped.play()
            control.runInParallel(function () {
                pause(3000)
                buoy.setVelocity(savedVX, savedVY)
                buoyDisabled = false
            })
        })
    }

    //% block="win when score ≥ $threshold"
    export function enableWinAtScore(threshold: number): void {
        game.onUpdate(function () {
            if (info.score() >= threshold) {
                game.over(true, effects.confetti)
            }
        })
    }
}
```
