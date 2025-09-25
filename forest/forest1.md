# Silent Seas- UUV Ops
### @explicitHints true

## Welcome @showdialog
You’ll build a **UUV (underwater drone)** mission:
- **Collect data** pods underwater
- **Surface** at a buoy to **upload** (score!)
- **Recharge** at a dock
- Avoid **sonar buoys**
- A **coded AI advisor** will suggest "Collect / Surface / Recharge" using simple rules you can **tune**
Ready to launch?

```template
scene.setBackgroundImage(tutorial_asset.ocean_background)

let myDrone = sprites.create(img`
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f c f 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f c c 0 0 0 0 0 0 0 0 0
    0 0 0 0 c f 0 f 4 4 4 4 4 4 4 f 0 0 0 0
    0 0 0 0 f c 5 4 4 4 4 f f c 4 4 f 0 0 0
    0 0 0 0 f c 4 4 4 4 4 f c f f 4 0 0 0 0
    0 0 0 0 c c 4 4 4 4 4 f c f f f 0 0 0 0
    0 0 0 0 c f f 4 5 4 4 f f f 4 f 0 0 0 0
    0 0 0 0 0 0 0 f c f 4 4 4 4 0 0 0 0 0 0
    0 0 0 0 0 0 0 f f 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `, SpriteKind.Player)
```

## {2. Set the Scene}
**🌊 Welcome to the Ocean**
Notice there is some code that has already been added to your program. 


~hint What's a sprite? 💡

---

In Arcade, each character or image that does something is called a **SPRITE**.
Sprites have properties that you can use and change — things like scale, position, and lifespan are all properties of sprites.
Our ocean and drone are actually sprites, too.

hint~

---

**Want a new background or drone?**

- :paper sprite: From the ``||sprites:Sprites||`` category, grab another <br/>
```block
let mySprite = sprites.create(img`
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `, SpriteKind.Player)
```
and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

~hint Show me how! 🕵🏽

![Add the sprite block.](/static/skillmap/mole/add-sprite.gif "Add a sprite to your game.")
hint~

---

## Want a different background or drone? @showdialog
Click on the image on either the background or sprite block and customize it how you like. <br/>

## {4. Learn to Glide}

**↔Get the sprite moving**

---

- :game pad: From the ``||controller:Controller||`` category, drag <br/>
```block
controller.moveSprite(myDrone)
```
and snap it into **the end** of the <br/>
``||loops:on start||``
container that's already in the workspace.

#### ~ tutorialhint
```blocks
scene.setBackgroundImage(tutorial_asset.ocean_background)
let myDrone = sprites.create(img`
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f c f 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f c c 0 0 0 0 0 0 0 0 0
    0 0 0 0 c f 0 f 4 4 4 4 4 4 4 f 0 0 0 0
    0 0 0 0 f c 5 4 4 4 4 f f c 4 4 f 0 0 0
    0 0 0 0 f c 4 4 4 4 4 f c f f 4 0 0 0 0
    0 0 0 0 c c 4 4 4 4 4 f c f f f 0 0 0 0
    0 0 0 0 c f f 4 5 4 4 f f f 4 f 0 0 0 0
    0 0 0 0 0 0 0 f c f 4 4 4 4 0 0 0 0 0 0
    0 0 0 0 0 0 0 f f 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `, SpriteKind.Player)

// @highlight
controller.moveSprite(myDrone)
```

## {5. Try It}

- :binoculars: Look at your project in the game window!


Your sprite should move around the ocean as you move the joypad.

_💡 You can also use the arrow keys on your keyboard!_


![Find the game window.](/static/skillmap/forest/game.png "The game window is in the lower corner.")

## {6. Follow with Camera}

**😮 Ack!**<br/>
Your drone glides off-screen if you go too far.

---

- :tree:  To keep your sprite in sight, open the  ``||sprites:Sprites||`` category and drag <br/>

```blocks
scene.setBackgroundImage(tutorial_asset.ocean_background)

let myDrone = sprites.create(img`
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f c f 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 f c c 0 0 0 0 0 0 0 0 0
    0 0 0 0 c f 0 f 4 4 4 4 4 4 4 f 0 0 0 0
    0 0 0 0 f c 5 4 4 4 4 f f c 4 4 f 0 0 0
    0 0 0 0 f c 4 4 4 4 4 f c f f 4 0 0 0 0
    0 0 0 0 c c 4 4 4 4 4 f c f f f 0 0 0 0
    0 0 0 0 c f f 4 5 4 4 f f f 4 f 0 0 0 0
    0 0 0 0 0 0 0 f c f 4 4 4 4 0 0 0 0 0 0
    0 0 0 0 0 0 0 f f 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `, SpriteKind.Player)
controller.moveSprite(myDrone)
myDrone.setStayInScreen(true)
```

to **the end** of the 
``||loops:on start||``
container that's already in the workspace.

## {7. Pilot Your Drone}

- :binoculars: Take a look in the game window! <br/><br/>
You should be able to pilot your drone all around the ocean and see the sights.



## {Finale}

**You've finished the first level!**<br/>
👏 👏 👏

---

When you're ready, click **Done** to return to the skillmap and go to the next level
where you'll add the 🔥🔥🔥.


```package
tutorial_asset=github:sjwines/tutorial_asset

```
