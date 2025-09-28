# Drone Command - Operation Uplink
### @explicitHints true

## Welcome @showdialog
**The Manta Ray**
![The Manta Ray](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/UUVMantaRay.png)
You’ll build a **UUV (Unmanned Underwater Vehicle/Drone)** like the one above in this mission and:
- **Collect data** pods underwater
- **Surface** at a buoy to **upload** and increase your score
- **Recharge** at a Naval ship
- Avoid **sonar buoys**
- Use a **coded AI advisor** that will suggest "Collect / Surface / Recharge" using simple rules you can **tune**
Ready to launch?

```template
scene.setBackgroundImage(wines_assets.oceanBackground)
let myDrone = sprites.create(wines_assets.drone2, SpriteKind.Player)
```

## {2. Set the Scene}
**🌊 Welcome to the Ocean**
Notice there are two blocks of code that have already been added to your program. 


~hint What's a sprite? 💡

---

In Arcade, each character or image that does something is called a **SPRITE**.
Sprites have properties that you can use and change — things like scale, position, and lifespan are all properties of sprites.
Our ocean and drone are actually sprites, too.

hint~

---

**Want a new background or drone?**

- :paper plane: From the ``||sprites:Sprites||`` category, grab another <br/>
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
```blocks
scene.setBackgroundImage(wines_assets.oceanBackground)
let myDrone = sprites.create(wines_assets.drone2, SpriteKind.Player)
```

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

Change from mySprite to myDrone so that you are referencing your drone sprite.

#### ~ tutorialhint
```blocks
scene.setBackgroundImage(wines_assets.oceanBackground)

let myDrone = sprites.create(wines_assets.drone2, SpriteKind.Player)

// @highlight
controller.moveSprite(myDrone)
```

## {5. Try It}

- :binoculars: Look at your project in the game window!


Your sprite should move around the ocean as you move the joypad.

_💡 You can also use the arrow keys on your keyboard!_


![Find the game window.](/static/skillmap/forest/game.png "The game window is in the lower corner.")

## Did You Know? @showdialog
![US Navy Triton](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/USNavyTriton.png)
As the world's first and only autonomous underwater and surface vehicle (AUSV), the **US Navy Triton** can operate in sailing mode or submarine mode with its interchangeable sail.
Sea drones like Triton are deployed in combat to **gather intelligence**, **conduct surveillance** and **reconnaissance**, **sweep mines**, and **protect critical underwater infrastructure**.
Drones also **protect** crewed vessels in the fleet like aircraft carriers and submarines, acting as a **first line of defense** in hostile territories.

## {7. Follow with Camera}

**😮 Ack!**<br/>
Your drone glides off-screen if you go too far.

---

- :tree:  To keep your sprite in sight, open the  ``||sprites:Sprites||`` category and drag <br/>

```blocks
scene.setBackgroundImage(wines_assets.oceanBackground)

let myDrone = sprites.create(wines_assets.drone2, SpriteKind.Player)
controller.moveSprite(myDrone)
myDrone.setStayInScreen(true)
```

to **the end** of the 
``||loops:on start||``
container that's already in the workspace. 

Change from mySprite to myDrone so that you are referencing your drone sprite.

## {8. Pilot Your Drone}

- :binoculars: Take a look in the game window! <br/><br/>
You should be able to pilot your drone all around the ocean and see the sights.



## {9. Finale}

**You've finished the first level!**<br/>
👏 👏 👏

---

When you're ready, click **Done** to return to the skillmap and go to the next level
where you'll add the 🔥🔥🔥.

```package
wines_assets=github:sjwines/wines_assets
```
