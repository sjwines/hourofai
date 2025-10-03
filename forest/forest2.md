# Missing Data
### @explicitHints true

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

```blocks
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
`, SpriteKind.Player)
myShip.setPosition(20,100)
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

~hint Show me how! 🕵🏽

![Add the sprite block.](/static/skillmap/mole/add-sprite.gif "Add a sprite to your game.")

hint~

---

This sprite is different as it needs to be **labeled** as **Ship** instead of a **Player**. This will play an important role later as you will upload your data from the drone to the ship.

Click **Player**, Add a new kind, and change it to **Ship**.


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

```blocks
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

---

This custom block allows you to pick up a maximum amount of 3 data shards at a time.

## {Finale}
👏 **There you have it!**

---

When you're finished, click **Done** to
head to the next level and find out how to avoid the enemy sonar buoys!

```blockconfig.global
custom.placeDataRandomly()
custom.enableDataCollection()
```


```template
scene.setBackgroundColor(9)

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
controller.moveSprite(myDrone)
myDrone.setPosition(80,80)
scene.cameraFollowSprite(myDrone)
```

```package
winesAssets=github:sjwines/winesAssets
```

```customts
//% weight=100 color=#0fbc11 icon=""
namespace custom {
    // helpers: grab the first sprite of a kind (if it exists)
    function firstOf(kind: number): Sprite {
        const list = sprites.allOfKind(kind)
        return list.length ? list[0] : null
    }

    //% block="place data randomly"
    export function placeDataRandomly(): void {
        const data = firstOf(SpriteKind.Food)
        if (data) {
            data.setPosition(
                randint(16, scene.screenWidth() - 16),
                randint(16, scene.screenHeight() - 16)
            )
        }
    }

    //% block="enable data collection (max 3)"
    export function enableDataCollection(): void {
        let cargo = 0
        const CAP = 3

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function () {
            if (cargo >= CAP) {
                const drone = firstOf(SpriteKind.Player)
                if (drone) drone.sayText("Storage full!", 400)
                music.thump.play()
                return
            }
            cargo += 1
            music.baDing.play()
            custom.placeDataRandomly()
        })
    }
}
```
