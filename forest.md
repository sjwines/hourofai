# Drone Command - Operation Uplink
* name: Drone Command - Operation Uplink
* description: A critical intel package has slipped into enemy hands, but upon delivery, it was scattered across the ocean floor. Before the data gets back into the enemy's hands, your mission is to pilot a recon drone across hostile waters, recover the scattered data shards, and upload them back to the ship.
* bannerUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/FullGame.gif
* backgroundurl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/SkillMapBackgroundv2.png
* primarycolor: #002F5E
* secondarycolor: #6BA4D9
* tertiarycolor: #7A8B8C
* highlightcolor: #FFD700
* completednodecolor: #FFD700
* alternatesources: github: https://github.com/sjwines/hourofai/forest.md

## Drone Command - Operation Uplink
* name: Drone Command - Operation Uplink
* layout: manual

### forest1
* allowcodecarryover: false
* name: Prepare Your Drone
* type: tutorial
* description: Set up your drone to make sure you can get everywhere you need to be!
* url: https://github.com/sjwines/hourofai/forest/forest1
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/Tile1Gif.gif
* tags: easy, sprite, movement
* next: forest2
* position: 0 0

### forest2
* name: Incoming Ship
* type: tutorial
* description: Build your other sprites and learn about custom blocks!
* url: https://github.com/sjwines/hourofai/forest/forest2
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/Tile2Gif.gif
* tags: easy, functions, sprites, sprite interactions
* next: forest3
* position: 1 0

### forest3
* name: Enemy Waters
* type: tutorial
* description: Prepare to face your enemy!
* url: https://github.com/sjwines/hourofai/forest/forest3
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/Tile3Gif.gif
* tags: easy, events, sprites
* next: forest4
* position: 1 1

### forest4
* name: Upload Complete
* type: tutorial
* description: Data collection is key. Collect the data and upload it at the ship!
* url: https://github.com/sjwines/hourofai/forest/forest4
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/Tile4Gif.gif
* tags: easy, variables, overlaps, if/else
* next: forest5
* position: 2 1

### forest5
* name: Build Your Advisor
* type: tutorial
* description: Write the if/else rules that tell your drone when to Collect, Upload, or Avoid.
* url: https://github.com/sjwines/hourofai/forest/forest5
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/FullGame.gif
* tags: if/else, logic, sensors
* next: forest-cert
* position: 2 2

### forest6
* name: Fly With Your Advisor
* type: tutorial
* description: Switch on the autopilot, fly the mission, and read your Mission Report.
* url: https://github.com/sjwines/hourofai/forest/forest6
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/FullGame.gif
* tags: autonomy, tuning, testing
* next: forest7
* position: 4 2

### forest-cert
* name: Congrats!
* kind: completion
* type: certificate
* url: /static/skillmap/certificates/forest-cert.pdf
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/SeaworthySTEMChallengeCertificate.png
* next: forest6
* position: 3 2
* rewards:
    * certificate:
        * url: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/SeaworthySTEMChallengeCertificate.pdf
        * preview: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/SeaworthySTEMChallengeCertificate.png
* actions:
    * editor: [Edit Your Project with a Full Toolbox] (/)


### forest7
* name: Challenge Lab
* type: tutorial
* description: Pick a Bronze, Silver, or Gold challenge to push your advisor even further!
* url: https://github.com/sjwines/hourofai/forest/forest7
* imageUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/FullGame.gif
* tags: custom, strategy, animation, sounds
* position: 4 1
