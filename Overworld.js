class Overworld {
  constructor(config) {
    this.element = config.element;
    this.element.height = window.innerHeight;
    this.canvas = this.element.querySelector(".game-canvas");
    // console.log(this.canvas);
    // this.canvas.addEventListener("mousedown", () => {
    //   console.log("lalalala");
    // });
    this.canvas.height = 550;
    this.canvas.width = 1120;
    this.ctx = this.canvas.getContext("2d");

    this.map = null;
  }

  startGameLoop() {
    const mapImage = new Image();
    mapImage.src = "images/location.png";

    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });
      if (this.map.playerStatic != "dynamic") {
        const cameraPerson = this.map.gameObjects.hero;

        this.map.drawLowerImage(this.ctx, cameraPerson);

        Object.values(this.map.gameObjects)
          .sort((a, b) => {
            return a.y + a.viewSize - (b.y + b.viewSize);
          })
          .forEach((object) => {
            object.sprite.draw(this.ctx, cameraPerson);
          });

        this.map.drawUpperImage(this.ctx, cameraPerson);

        this.ctx.drawImage(mapImage, utils.withGrid(2), utils.withGrid(1));
      } else {
        this.map.drawStaticLowerImage(this.ctx);
        Object.values(this.map.gameObjects)
          .sort((a, b) => {
            return a.y - b.y;
          })
          .forEach((object) => {
            object.sprite.drawDynamic(this.ctx);
          });
        this.map.drawStaticUpperImage(this.ctx);
      }

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { type: "changeMap", map: "DemoRoom"}
    //   // { type: "textMessage", text: "This is the very first message!"}
    // ])
  }
  clicked(e) {
    console.log("clicked");
    e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;

    if (x > 32 && x < 96 && y > 16 && y > 80) {
      //780 = 580+(200) <- image width
      alert("Hello");
    }
  }
}
