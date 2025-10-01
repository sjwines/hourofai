# Drone Command - Operation Uplink
* name: Drone Command - Operation Uplink
* description: A critical intel package had slipped into enemy hands, but upon delivery, was scattered across the ocean floor. Before the data gets into the enemy hands, your mission is to pilot a recon drone across hostile waters, recover the scattered data shards, and upload them back to the ship.
* infoUrl: skillmap/educator-info/forest-map-info
* bannerUrl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/FullGame.gif
* backgroundurl: https://raw.githubusercontent.com/sjwines/hourofai/master/assets/SkillMapBackgroundv2.png
* primarycolor: #002F5E
* secondarycolor: #6BA4D9
* tertiarycolor: #7A8B8C
* highlightcolor: #FFD700
* completednodecolor: #FFD700
* alternatesources: github:https://github.com/sjwines/hourofai/forest.md

## Drone Command - Operation Uplink
* name: Drone Command - Operation Uplink
* layout: manual

### forest1
* allowcodecarryover: false
* name: Prepare Your Drone
* type: tutorial
* description: Set up your drone to make sure you can get everywhere you need to be!
* url: https://github.com/sjwines/hourofai/forest/forest1
* imageUrl: /static/skillmap/forest/forest1.gif
* tags: easy, sprite, movement
* next: forest2
* position: 0 0

### forest2
* name: 🔥 Burning Issues 🔥
* type: tutorial
* description: Use loops to add random fires to your map!
* url: https://github.com/sjwines/hourofai/forest/forest2
* imageUrl: /static/skillmap/forest/forest2.gif
* tags: easy, loops, sprites
* next: forest3
* position: 1 0

### forest3
* name: Fire Fighting
* type: tutorial
* description: Add a water hose to your plane so you can keep your fires under control.
* url: https://github.com/sjwines/hourofai/forest/forest3
* imageUrl: /static/skillmap/forest/forest3.gif
* tags: easy, events, sprites
* next: forest4
* position: 1 1

### forest4
* name: Spreads Like Wildfire
* type: tutorial
* description: Lots of things affect how quickly fire spreads. In this activity, you'll add variables to change fire danger levels.
* url: https://github.com/sjwines/hourofai/forest/forest4
* imageUrl: /static/skillmap/forest/forest4.gif
* tags: easy, variables, overlaps
* next: forest5
* position: 2 1

### forest5
* name: Head's Up
* type: tutorial
* description: Computer science is more important to firefighting than ever before! Add some technology to keep your pilots updated!
* url: https://github.com/sjwines/hourofai/forest/forest5
* imageUrl: /static/skillmap/forest/forest5.gif
* tags: easy, custom
* next: forest-cert
* position: 2 2



### forest-cert
* name: Congrats!
* kind: completion
* type: certificate
* url: /static/skillmap/certificates/forest-cert.pdf
* imageUrl: /static/skillmap/certificates/forest-cert.png
* next: forest6
* position: 3 2
* rewards:
    * certificate:
        * url: /static/skillmap/certificates/forest-cert.pdf
        * preview: /static/skillmap/certificates/forest-cert.png
    * completion-badge:
        * image: /static/badges/badge-forest.png
        * name: Save the Forest
* actions:
    * map: [Try Jungle Jump](/skillmap/jungle)
    * map: [Try Space Explorer](/skillmap/space)
    * editor: [Edit Your Project with a Full Toolbox] (/)


### forest6
* name: Keep Going!
* type: tutorial
* description: Add sounds and animations to customize your game.
* url: https://github.com/sjwines/hourofai/forest/forest6
* imageUrl: /static/skillmap/forest/forest6.gif
* tags: custom, animation, sounds
* position: 4 2
