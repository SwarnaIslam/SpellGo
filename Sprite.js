class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    //Shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow || false;
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };
    //Reference the game object
    this.gameObject = config.gameObject;

    //Configure Animation & Initial State
    this.animations = this.gameObject.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-up": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };
    this.currentAnimation = this.gameObject.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    this.frameSize = this.gameObject.frameSize || 32;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x + utils.withGrid(33.5) - cameraPerson.x;
    const y = this.gameObject.y + utils.withGrid(27) - cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;
    this.isLoaded &&
      ctx.drawImage(
        this.image,
        frameX * this.frameSize,
        frameY * this.frameSize,
        this.frameSize,
        this.frameSize,
        x,
        y,
        this.gameObject.viewSize,
        this.gameObject.viewSize
      );
    ctx.strokeStyle = "red"; // set border color
    ctx.lineWidth = 2; // set border width
    ctx.strokeRect(32, 16, 64, 64);
    this.updateAnimationProgress();
  }
  drawDynamic(ctx) {
    const x = this.gameObject.x - utils.withGrid(0);
    const y = this.gameObject.y - utils.withGrid(0);

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;
    this.isLoaded &&
      ctx.drawImage(
        this.image,
        frameX * this.frameSize,
        frameY * this.frameSize,
        this.frameSize,
        this.frameSize,
        x,
        y,
        this.frameSize + (this.frameSize == 32 ? 16 : 0),
        this.frameSize + (this.frameSize == 32 ? 16 : 0)
      );
    // ctx.strokeStyle = "red"; // set border color
    // ctx.lineWidth = 2; // set border width
    // ctx.strokeRect(x, y, this.frameSize+(this.frameSize==32?16:0), this.frameSize+(this.frameSize==32?16:0));
    this.updateAnimationProgress();
  }
}
