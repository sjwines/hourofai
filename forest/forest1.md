# Prepare Your Drone
### @explicitHints true

## Welcome @showdialog
**The Manta Ray**
![The Manta Ray](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/UUVMantaRay.png)
A critical intel package has slipped into enemy hands, but upon delivery, it was scattered across the ocean floor. Before the data gets back into the enemy’s hands, your mission is to pilot a recon drone across hostile waters, recover the scattered data shards, and upload them back to the ship. Once all 15 data shards are collected, the game is over and you can leave enemy waters.

You’ll build a **UUV (Unmanned Underwater Vehicle/Drone)** like the one above in this mission and:
- **Collect data** pods underwater
- **Surface** at the ship to **upload** and increase your score
- Avoid the **sonar the buoy** that can steal the data
- Use a **coded AI advisor** that will suggest "Collect / Upload / Avoid" using simple rules you can **tune**

Ready to launch?

## {2. Set the Scene}
**🌊 Welcome to the Ocean**

The ship is getting ready to arrive and launch the drone into the water to collect the scattered data before it gets into enemy hands.

Let's get the code in there to make that happen!

~hint What's a sprite? 💡


---


In Arcade, each character or image that does something is called a **SPRITE**.
Sprites have properties that you can use and change — things like scale, position, and lifespan are all properties of sprites.
Our ocean and drone are actually sprites, too.
hint~


---

**Create Your Drone Sprite**
- :paper plane: From the ``||sprites:Sprites||`` category, grab <br/>

```blocks
let myDrone = sprites.create(img`
    ....................
    ....................
    ....................
    ....................
    .........cf.........
    .........ff.........
    .........ccf........
    ...fff.ffffffff.....
    ...cfc4444444f44....
    ...cfc444444fcf4....
    ...c.f444444fcf4....
    ...ccff44444444f....
    ...fff.ffffffff.....
    .......fc..ff.fff...
    ......ff...fc.......
    ...........ff.......
    ....................
    ....................
    ....................
    ....................
    `, SpriteKind.Player)
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

~hint Show me how! 🕵🏽

![Add the sprite block.](/static/skillmap/mole/add-sprite.gif "Add a sprite to your game.")

hint~

---

**Choose Your Sprite Picture & Give it an Important Name**

Click on the **gray box** and then either draw your own sprite, or click **Gallery** and pick from one of the 5 drones, then click **Done**. 

After, click the name **mySprite** and rename it to a name that represents the sprite, such as **myDrone**.
 
## Did You Know? @showdialog
![US Navy Robotic Warfare Specialists](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/NavyProfession1.jpg)
Robitic warfare specialists serve the U.S. Navy and are responsible for the operation, maintenance, and tactical employment of robotic and autonomous systems to achieve a hybrid manned-unmanned fleet.

## {5. Move your Sprites Locations}
Let's move your drone to their starting location at the start of the game.

- :paper plane: From the ``||sprites:Sprites||`` category, grab <br/>

```blocks
let myDrone = sprites.create(img`
    ....................
    ....................
    ....................
    ....................
    .........cf.........
    .........ff.........
    .........ccf........
    ...fff.ffffffff.....
    ...cfc4444444f44....
    ...cfc444444fcf4....
    ...c.f444444fcf4....
    ...ccff44444444f....
    ...fff.ffffffff.....
    .......fc..ff.fff...
    ......ff...fc.......
    ...........ff.......
    ....................
    ....................
    ....................
    ....................
    `, SpriteKind.Player)
// @highlight
myDrone.setPosition(80,80)
```

---

Set your drone's **x** position to **80** and <br/>
**y** position to **80**.

---

You can always change these numbers to whatever you like.

## {6. Learn to Glide}
**↔Get the Drone Moving**

- :game pad: From the ``||controller:Controller||`` category, drag <br/>

```blocks
let myDrone = sprites.create(img`
    ....................
    ....................
    ....................
    ....................
    .........cf.........
    .........ff.........
    .........ccf........
    ...fff.ffffffff.....
    ...cfc4444444f44....
    ...cfc444444fcf4....
    ...c.f444444fcf4....
    ...ccff44444444f....
    ...fff.ffffffff.....
    .......fc..ff.fff...
    ......ff...fc.......
    ...........ff.......
    ....................
    ....................
    ....................
    ....................
    `, SpriteKind.Player)
myDrone.setPosition(80,80)
// @highlight
controller.moveSprite(myDrone)
```

and snap it into **the end** of the <br/>
``||loops:on start||``
container that's already in the workspace. 

Click the name **mySprite** and change it to **myDrone**.

## {7. Try It}
- :binoculars: Look at your project in the game window!

Your sprite should move around the ocean as you move the joypad.

_💡 You can also use the arrow keys on your keyboard!_

![Find the game window.](/static/skillmap/forest/game.png "The game window is in the lower corner.")

## Did You Know? @showdialog
![US Navy Triton](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/USNavyTriton.png)
As the world's first and only autonomous underwater and surface vehicle (AUSV), the **US Navy Triton** can operate in sailing mode or submarine mode with its interchangeable sail.
Sea drones like Triton are deployed in combat to **gather intelligence**, **conduct surveillance** and **reconnaissance**, **sweep mines**, and **protect critical underwater infrastructure**.

Drones also **protect** crewed vessels in the fleet like aircraft carriers and submarines, acting as a **first line of defense** in hostile territories.

## {8. Follow with Camera}
**😮 Ack!** <br/>

Your drone glides off-screen if you go too far.

---

- :game pad: From the ``||sprites:Sprites||`` category, drag <br/>

```blocks
let myDrone = sprites.create(img`
    ....................
    ....................
    ....................
    ....................
    .........cf.........
    .........ff.........
    .........ccf........
    ...fff.ffffffff.....
    ...cfc4444444f44....
    ...cfc444444fcf4....
    ...c.f444444fcf4....
    ...ccff44444444f....
    ...fff.ffffffff.....
    .......fc..ff.fff...
    ......ff...fc.......
    ...........ff.......
    ....................
    ....................
    ....................
    ....................
    `, SpriteKind.Player)
controller.moveSprite(myDrone)
myDrone.setPosition(80,80)
// @highlight
scene.cameraFollowSprite(myDrone)
```

to **the end** of the 
``||loops:on start||``
container that's already in the workspace. 

Click the name **mySprite** and change it to **myDrone**.

## {8. Pilot Your Drone}
- :binoculars: Take a look in the game window! <br/><br/>
You should be able to pilot your drone all around the ocean and see the sights.

## {10. Finale}
**You've finished the first level!**<br/>
👏 👏 👏

---

When you're ready, click **Done** to return to the skillmap and go to the next level
where you'll add the 🔥🔥🔥.

```template
scene.setBackgroundColor(9)
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

    //% block="enable pulse (A) to disable buoy"
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
