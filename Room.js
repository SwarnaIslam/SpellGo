class Room {
  constructor() {
    this.rooms = {
      greenhouse: {
        lowerSrc: "/images/greenhouse_inside.png",
        upperSrc: "/images/greenhouse_inside_upper.png",
        gameObjects: {
          hero: new Person({
            isPlayerControlled: true,
            x: utils.withGrid(34),
            y: utils.withGrid(29),
          }),
          tree: new GameObject({
            x: utils.withGrid(28),
            y: utils.withGrid(8.5),
            src: "images/tree_growing1.png",
            frameSize: 304,
            animations: {
              dead_tree: [[0, 0]],
              alive_tree: [[1, 0]],
            },
            currentAnimation: "alive_tree",
          }),
          lantern: utils.getLantern(26, 25),
        },
        playerStatic: "dynamic",
        collisions: { denotation: null, coordinates: [] },
        cutsceneSpaces: {
          [utils.asGridCoord(27, 27)]: [
            {
              events: [{ type: "level", name: "mergeSort" }],
            },
          ],
          [utils.asGridCoord(34, 31)]: [
            {
              events: [{ type: "changeMap", map: "DemoRoom" }],
            },
          ],
          [utils.asGridCoord(35, 31)]: [
            {
              events: [{ type: "changeMap", map: "DemoRoom" }],
            },
          ],
        },
      },
      postOffice: {
        lowerSrc: "/images/postOfficeInside.png",
        upperSrc: "/images/postOfficeInsideupper.png",
        gameObjects: {
          hero: new Person({
            isPlayerControlled: true,
            x: utils.withGrid(34.5),
            y: utils.withGrid(25),
          }),
          lantern: utils.getLantern(33.5, 8),
        },
        playerStatic: "dynamic",
        collisions: { denotation: null, coordinates: [] },
        cutsceneSpaces: {
          [utils.asGridCoord(34, 29)]: [
            {
              events: [
                { type: "changeMap", map: "DemoRoom" },
                // { who: "hero", type: "walk", direction: "down", time: 800 },
              ],
            },
          ],
          [utils.asGridCoord(34.5, 29)]: [
            {
              events: [
                { type: "changeMap", map: "DemoRoom" },
                // { who: "npcB", type: "walk", direction: "down", time: 800 },
              ],
            },
          ],
          [utils.asGridCoord(34.5, 10)]: [
            {
              events: [{ type: "level", name: "dijkstra" }],
            },
          ],
        },
      },
      library: {
        lowerSrc: "/images/library_inside.png",
        upperSrc: "/images/library_inside_upper.png",
        gameObjects: {
          hero: new Person({
            isPlayerControlled: true,
            x: utils.withGrid(34),
            y: utils.withGrid(29),
          }),
          npcB: new Person({
            x: utils.withGrid(26),
            y: utils.withGrid(29),
            src: "/images/characters/people/npc3.png",
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "You made it! Now find the recipe of a potion from this huge book. Good luck!",
                    faceHero: "npcB",
                  },
                ],
              },
            ],
            behaviorLoop: [
              { type: "walk", direction: "right", time: 800 },
              { type: "walk", direction: "up", time: 800 },
              { type: "walk", direction: "left", time: 1200 },
              { type: "walk", direction: "down", time: 300 },
            ],
          }),
          lantern: utils.getLantern(31, 29),
        },
        walls: [],
        collisions: { denotation: 3358, coordinates: libraryCollision },
        playerStatic: "dynamic",
        cutsceneSpaces: {
          [utils.asGridCoord(35, 33)]: [
            {
              events: [{ type: "changeMap", map: "DemoRoom" }],
            },
          ],
          [utils.asGridCoord(32, 31)]: [
            {
              events: [{ type: "level", name: "binarySearch" }],
            },
          ],
        },
      },
    };
  }
}
