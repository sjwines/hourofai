# Prepare Your Drone
### @explicitHints true

## Welcome @showdialog
**The Manta Ray**
![The Manta Ray](https://raw.githubusercontent.com/sjwines/hourofai/master/assets/UUVMantaRay.png)
A critical intel package had slipped into enemy hands, but upon delivery, was scattered across the ocean floor. Before the data gets into the enemy hands, your mission is to pilot a recon drone across hostile waters, recover the scattered data shards, and upload them back to the ship.

You’ll build a **UUV (Unmanned Underwater Vehicle/Drone)** like the one above in this mission and:
- **Collect data** pods underwater
- **Surface** at a buoy to **upload** and increase your score
- **Recharge** at a Naval ship
- Avoid **sonar buoys**
- Use a **coded AI advisor** that will suggest "Collect / Surface / Recharge" using simple rules you can **tune**

```template
scene.setBackgroundColor(9)
```

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

```block
let myDrone = sprites.create(img``, SpriteKind.Player)
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

## {4. Add The Ship Sprite}
**Create your Ship Sprite**
- :paper plane: From the ``||sprites:Sprites||`` category, grab another <br/>

```block
let myShip = sprites.create(img``, SpriteKind.Player)
```

and snap it into ``||loops:on start||`` <br/>
container already in the workspace.  <br/>

~hint Show me how! 🕵🏽

![Add the sprite block.](/static/skillmap/mole/add-sprite.gif "Add a sprite to your game.")

hint~

---

**Give Your Sprite an Important Name**

Click the name **mySprite** and change it to a name that represents the sprite, such as **myShip**.

## {5. Move your Sprites Locations}
Right now, your sprites at overlapping each other. Let's move your sprites to their starting locations at the start of the game.

- :paper plane: From the ``||sprites:Sprites||`` category, grab <br/>
```block
let myDrone = sprites.create(img``, SpriteKind.Player)
// @highlight
myDrone.setPosition(35,35)
let myShip= sprites.create(img``, SpriteKind.Player)
// @highlight
myShip.setPosition(15,20)
```

---

Set your drone's **x** position to **35** and <br/>
**y** position to **25**.

---

Set your ships's **x** position to **15** and <br/>
**y** position to **20**.

You can always change these numbers to what ever you like.

## {6. Learn to Glide}
**↔Get the Drone Moving**

- :game pad: From the ``||controller:Controller||`` category, drag <br/>

```block
controller.moveSprite(myDrone)
```

and snap it into **the end** of the <br/>
``||loops:on start||``
container that's already in the workspace. 

Click the name **mySprite** and change it to myDrone.

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
let myDrone = sprites.create(img``, SpriteKind.Player)
myDrone.setStayInScreen(true)
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


```package
winesAssets=github:sjwines/winesAssets
```
