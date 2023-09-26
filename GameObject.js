class GameObject {
  constructor(config) {
    this.id = null;
    this.frameSize=config.frameSize
    this.viewSize=config.viewSize||this.frameSize;
    this.shouldMount=config.shouldMount||"mount";
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
  
    this.direction = config.direction || "down";
    this.animations=config.animations;
    this.currentAnimation=config.currentAnimation;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/people/hero.png",
    });
    

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
    this.collide=config.collide;


  }

  mount(map) {
      this.isMounted = true;
      map.addWall(this.x+16, this.y+32);

      //If we have a behavior, kick off after a short delay
      setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 10)
  }

  update() {
  }

  async doBehaviorEvent(map) { 

    //Don't do anything if there is a more important cutscene or I don't have config to do anything
    //anyway.
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
      return;
    }

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init(); 

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    } 

    //Do it again!
    this.doBehaviorEvent(map);
    

  }


}