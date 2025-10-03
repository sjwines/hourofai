# Missing Data

### @explicitHints true

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
```

## Welcome @showdialog
**The SPURV**
![The SPURV](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/SPURV.png)
The first underwater vehicles were developed in the 1950s and used to collect oceanographic data in Arctic waters.
In this section, you will program your drone to collect the missing data in enemy territory.

## {2. Set the Scene}
- :binoculars: Look at your project in the game window!
Your drone should move in the direction you press the arrow keys.

---

_Can you remember which lines of code create each action?_

---

~hint My game doesn't work ⚠️

---

If your code isn't working and you can't figure out why, click
<br/>"Replace my code"<br/>
to replace the blocks in your workspace with new starter code.
hint~

## {3. Add The Ship Sprite}
**Create Your Ship Sprite**
- :paper plane: From the ``||sprites:Sprites||`` category, grab another <br/>

```block
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
myShip.setPosition(20,100)
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

~hint Show me how! 🕵🏽

![Add the sprite block.](/static/skillmap/mole/add-sprite.gif "Add a sprite to your game.")

hint~

---

Notice this sprite is different as it needs to be **labeled** as **Ship** instead of a **Player**. This will play an important role later as you will upload your data from the drone to the ship.

Click **Player** and change it to **Ship**.


---

**Give Your Sprite an Important Name**
Click the name **mySprite** and change it to a name that represents the sprite, such as **myShip**.

---

Set your ship's **x** position to **20** and <br/>
**y** position to **100**.

---

You can always change these numbers to whatever you like.

## {4. Creating the Data Sprite}
**Create Your Data Sprite**
- :paper plane: From the ``||sprites:Sprites||`` category, grab <br/>

```block
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
myData.setPosition(60,60)
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

---

Notice this sprite is different as it needs to be **labeled** as **Food** instead of a **pPlayer** because your drone will be collecting it. 

Click **Player** and change it to **Food**.

---

Give it an important name, such as **myData** & select the **data sprite** from the **Gallery** or create your own!

---

Set your data's **x** position to **60** and <br/>
**y** position to **60**.

---

You can always change these numbers to whatever you like.

## Why Custom Green Blocks @showdialog

When your program starts to grow, you’ll see the same ideas repeat: “put the data somewhere new,” “spawn a buoy that bounces,” “give advice.”
Instead of rewriting long code each time, we bundle it into a **custom block**. 

This is called **abstraction**: hiding the **messy details** behind a simple, easy-to-use command.

You’ve already used abstraction:

```blocks
controller.moveSprite(myDrone) 
```

You don’t see the math inside how the controls work; you know that if you move the arrow keys, the drone will move.

Now we’ll use more that are already made for us!

## Check for Overlap
If the drone touches the data, then we want the data to randomly appear in a new location on the map and increase our score. 

We will practice abstraction here with a custom block, but inside of it, hidden is a programming concept called if/then conditionals!

---

~hint Tell me about if/then conditionals! 💡

---

In programming, an if/then (a conditional) lets your code make a decision.
You give it a condition that can be true or false.
If the condition is true, then the code inside runs. If it’s false, it skips that code.
In this program our if/then is this block:

---

```block
if (true){
}

```
hint~

You will not need to drag out an if/then block; instead, drag out the custom block:

- :paper plane: From the ``||custom:Custom||`` category, grab <br/>

```blocks
custom.placeDataRandomly()
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

---

Run the program several times. 

Notice how the data sprite's location is random on each run.

## How a Custom Block Works 

Hidden inside a custom block consists 4 main parts:
- a name (what shows up as the block text),
- inputs/parameters (what you can change),
- body (the steps it runs),
- and sometimes a result (a return value).

---

The placeDataRandomly() block at the start of your program runs and places your data sprite at a random location on the map.
```blocks
custom.placeDataRandomly()
```

---

**What's hidden inside?**
```blocks
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
myData.setPosition(randint(16, scene.screenWidth() - 16), randint(16, scene.screenHeight() - 16))
```

## Data collection

The final part of this activity is enabling your drone to collect the data:

- :paper plane: From the ``||custom:Custom||`` category, grab <br/>

```blocks
custom.enableDataCollection()
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

This custom block allows you to pick up a maximum amount of data that can be picked up at a time.

By default, it is 3, but for example, you can change the number. 

For fun, let's add a random block from the ``||math:Math||`` so that each time you play the game, the amount you can collect changes.

```blocks
custom.enableDataCollection(randint(3,5))
```

The random block acts as a range; the first number is the lowest number, and the second number is the highest. In this example, each time the program runs, it will randomly pick a number between 3 and 5 inclusive. 

## {Finale}
👏 **There you have it!**

---

When you're finished, click **Done** to
head to the next level and find out how to avoid the enemy sonar buoys!

```blockconfig.global

custom.placeDataRandomly()
custom.enableDataCollection()
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
