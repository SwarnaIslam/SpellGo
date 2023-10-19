class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.playerStatic=config.playerStatic;


    const collisionMap=[];
    
    const collision=config.collisions.coordinates||[];
    const denotation=config.collisions.denotation;
    const length=collision.length;
    for (let i = 0; i < length; i += 150) {
      const subset = collision.slice(i, i + 150);
      collisionMap.push(subset);
    }

    for(let i=0;i<collisionMap.length;i++){
      for(let j=0;j<collisionMap[i].length;j++){
        if(collisionMap[i][j]==denotation){
          config.walls[utils.asGridCoord(j,i)]=true;
        }
      }
    }
    
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(33.5) - cameraPerson.x, 
      utils.withGrid(27) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(33.5) - cameraPerson.x, 
      utils.withGrid(27) - cameraPerson.y
    )
  } 
  drawStaticLowerImage(ctx){
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(0), 
      utils.withGrid(0) 
    )
  }
  drawStaticUpperImage(ctx){
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(0), 
      utils.withGrid(0) 
    )
  }

  isSpaceTaken(currentX, currentY, direction) {
    if(this.isCutscenePlaying){
      return false;
    }
    
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      if(object.shouldMount=="mount"){
        object.mount(this);
      }
      else{
        if(object.collide){
          object.collide.forEach(point=>{
            this.addWall(point.x,point.y)
          })
        }
      }
    })
  }

  async startCutscene(events) {
    if(events==null)return;
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x+16},${hero.y+32}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}
window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/gameworld.png",
    upperSrc: "/images/gameworld_upper.png",
    bubbleSort:false,
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(62),
        y: utils.withGrid(80),
        viewSize:48
      }),
      npcA: new Person({
        x: utils.withGrid(60),
        y: utils.withGrid(78),
        src: "/images/characters/people/npc1.png",
        viewSize:48,
        talking: [
          {
            events: [
              { 
                type: "textMessage", 
                faceHero: "npcA",
                text:[
                  {
                    string: "Sort the stairs to go into the library!",
                    speed:window.speeds.fast
                  },
                  // {
                  //   string: "Sort the stairs to go into the library At elementum eu facilisis sed odio. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin gravida. Pellentesque diam volutpat commodo sed",
                  //   speed:window.speeds.fast
                  // }
                ]
              },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(97),
        y: utils.withGrid(62),
        src: "/images/characters/people/npc2.png",
        viewSize:48,
        introDone:"complete",
        talking:[
          introDone?
          {}:
          {
            events:[
              {type:"textMessage",text:"You have to zip your data. Nowadays much data cannot be transmittted into the portal.",faceHero:"npcB"},
            ]
          }
        ],
        
      }),
      villageGate:new GameObject({
        x:utils.withGrid(86),
        y:utils.withGrid(93),
        src: "images/VillageGate.png",
        shouldMount:"unmount",
        frameSize:64,
        animations:{
          "gate-close":[[0,0]],
          "gate-open":[[1,0]],
          "gate-opening":[[0,0],[1,0]]
        },
        currentAnimation:introDone? "gate-open":"gate-close",
        collide:introDone?null:[{x:utils.withGrid(35),y:utils.withGrid(92)},{x:utils.withGrid(36),y:utils.withGrid(92)}]
      }),
      libraryGate: new GameObject({
        x:utils.withGrid(64),
        y:utils.withGrid(73),
        src:"images/libraryGate.png",
        shouldMount:"unmount",
        frameSize:64,
        animations:{
          "gate-close":[[0,0]],
          "gate-open":[[1,0]],
          "gate-opening":[[0,0],[1,0]]
        },
        currentAnimation:"gate-close",
      }),
      greenhouseGate: new GameObject({
        x:utils.withGrid(69.5),
        y:utils.withGrid(46),
        src:"images/greenhouseGate.png",
        shouldMount:"unmount",
        frameSize:32,
        animations:{
          "gate-close":[[0,0]],
          "gate-open":[[1,0]],
          "gate-opening":[[0,0],[1,0]]
        },
        currentAnimation:"gate-close",
      }),
      bubbleSortLantern: utils.getLantern(62,78),
      huffmanLantern:utils.getLantern(99,62),
      kmpLantern:utils.getLantern(93,35)

    },
    collisions:{denotation:7946,coordinates:gameworldCollision},
    walls:[],
    cutsceneSpaces: {
      [utils.asGridCoord(63,80)]: [
        {
          events: [
            {type:"level",name:"bubbleSort"}
          ]
        }
      ],
      [utils.asGridCoord(100,64)]: [
        {
          events: [
            {type:"level",name:"huffman"}
          ]
        }
      ],
      [utils.asGridCoord(94,37)]: [
        {
          events: [
            {type:"level",name:"kmp"}
          ]
        }
      ],
      [utils.asGridCoord(65,75)]: [
        {
          events: [
            { type: "changeRoom", map: "library" }
          ]
        }
      ],
      [utils.asGridCoord(66,75)]: [
        {
          events: [
            { type: "changeRoom", map: "library" }
          ]
        }
      ],
      [utils.asGridCoord(70,47)]: [
        {
          events: [
            { type: "changeRoom", map: "greenhouse" }
          ]
        }
      ],
      [utils.asGridCoord(97,62)]: [
        {
          events: [
            { type: "changeRoom", map: "postOffice" }
          ]
        }
      ],
      [utils.asGridCoord(96,62)]: [
        {
          events: [
            { type: "changeRoom", map: "postOffice" }
          ]
        }
      ],
      [utils.asGridCoord(70,48)]:[
        {
          events:[
            {type:"gate", what:"open",which:"greenhouseGate"}
          ]
        }
      ],
      [utils.asGridCoord(65,76)]:[
        {
          events:[
            {type:"gate", what:"open",which:"libraryGate"}
          ]
        }
      ],
      [utils.asGridCoord(66,76)]:[
        {
          events:[
            {type:"gate", what:"open",which:"libraryGate"}
          ]
        }
      ],
      [utils.asGridCoord(64,76)]:[
        {
          events:[
            {type:"gate", what:"close",which:"libraryGate"}
          ]
        }
      ],
      [utils.asGridCoord(67,76)]:[
        {
          events:[
            {type:"gate", what:"close",which:"libraryGate"}
          ]
        }
      ],
      [utils.asGridCoord(65,77)]:[
        {
          events:[
            {type:"gate", what:"close",which:"libraryGate"}
          ]
        }
      ],
      [utils.asGridCoord(66,77)]:[
        {
          events:[
            {type:"gate", what:"close",which:"libraryGate"}
          ]
        }
      ],
    }
    
  },
  
}

