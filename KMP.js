class KMP extends Phaser.Scene {
  constructor() {
    super("kmp");
    // this.pt=["Yellow", "Yellow"];
  }
  init() {
    this.len = 0;
    this.i = 0;
    this.backwardDone = false;
    this.ignoreDone = false;
    this.updateDone = false;
    this.pt = [
      "Yellow",
      "Yellow",
      "Orange",
      "Yellow",
      "Yellow",
      "Yellow",
      "Orange",
    ];
  }
  preload() {
    this.pattern = this.add.group();

    this.offset = config.width / 2 - (100 * (this.pt.length - 1)) / 2;

    this.lpsBar = this.add.container(0, 0);
    this.slimes = this.add.container(0, 0);

    this.offset2 = config.width / 2 - ((this.pt.length - 1) * 105) / 2;
    const graphics = this.add
      .rectangle(
        this.offset2 - 55,
        config.height / 2 - 240,
        105 * this.pt.length,
        150,
        0x008483
      )
      .setOrigin(0);

    this.lpsBar.add(graphics);

    for (let i = 0; i < this.pt.length; i++) {
      const x = i * 100 + this.offset;
      const y = config.height / 2;
      const slime = this.add.sprite(x, y, "slime" + this.pt[i]);
      slime.setOrigin(0.5);
      const frameNo = Math.floor(Math.random() * 6);
      const frameSequence = [];

      for (let j = 0; j < 6; j++) {
        frameSequence.push((frameNo + j) % 6);
      }

      const l = this.add
        .text(x, config.height / 2 - 120, i, {
          font: "20px PressStart",
          fill: "#ffffff",
          align: "center",
        })
        .setOrigin(0.5);

      this.lpsBar.add(l);

      this.anims.create({
        key: "slime" + this.pt[i] + i,

        frames: this.anims.generateFrameNumbers("slime" + this.pt[i], {
          frames: frameSequence,
        }),
        frameRate: 5,
        repeat: -1,
      });
      slime.play("slime" + this.pt[i] + i);
      this.slimes.add(slime);
    }
  }
  createText(x, y, text, color, fontSize, fontFamily = "PressStart") {
    return this.add
      .text(x, y, text, {
        font: `${fontSize}px ${fontFamily}`,
        fill: color,
        align: "center",
        wordWrap: {
          width: 100,
        },
      })
      .setOrigin(0.5);
  }
  createButtons() {
    const btnWidth = 400;
    const btnX = config.width / 2 - btnWidth / 2;
    const btnY = config.height - config.height / 5;

    this.ignoreBtn = new Button({
      ctx: this,
      x: btnX,
      y: btnY,
      btnName: "Forward!",
    }).createButtons();
    this.ignoreBtn.getByName("btn").on("pointerdown", () => {
      if (
        this.len > 0 ||
        (this.pt[this.len] == this.pt[this.i] && this.i != this.len)
      ) {
        new MessageBox({ ctx: this }).startTyping(window.hints.kmp.hint3);
        return;
      }
      this.lps.getChildren()[this.i].setText(0);
      this.updatePrefix();
      this.increment();
      this.decreaseSuffix();
    });

    this.updateBtn = new Button({
      ctx: this,
      x: btnX,
      y: btnY - 55,
      btnName: "Update!",
      width: btnWidth,
    }).createButtons();
    this.updateBtn.getByName("btn").on("pointerdown", () => {
      if (this.i == 0 || this.pt[this.len] != this.pt[this.i]) {
        new MessageBox({ ctx: this }).startTyping(window.hints.kmp.hint2);
        return;
      }
      this.len++;
      this.updatePrefix();
      this.lps.getChildren()[this.i].setText(this.len);
      this.increment();
      this.increaseSuffix();
    });

    this.backBtn = new Button({
      ctx: this,
      x: btnX + btnWidth / 2,
      y: btnY,
      btnName: "Backward!",
    }).createButtons();
    this.backBtn.getByName("btn").on("pointerdown", () => {
      if (this.len == 0 || this.pt[this.len] == this.pt[this.i]) {
        new MessageBox({ ctx: this }).startTyping(window.hints.kmp.hint1);
        return;
      }
      this.len = parseInt(this.lps.getChildren()[this.len - 1].text);
      this.updatePrefix();
      this.decreaseSuffix();
      this.tweens.add({
        targets: this.lengthBar,
        x: this.offset - 50 + 100 * this.len,
        ease: "Linear",
        duration: 300,
      });
    });
  }
  updatePrefix() {
    this.tweens.add({
      targets: this.prefix,
      displayWidth: 100 * this.len,
      ease: "Linear",
      duration: 300,
      onComplete: () => {
        if (this.prefix.displayWidth > 0) {
          this.preText.visible = true;
          this.tweens.add({
            targets: this.preText,
            x: this.offset - 50 + this.prefix.displayWidth / 2,
            ease: "Linear",
            duration: 300,
          });
        } else {
          this.preText.visible = false;
        }
      },
    });
  }
  placeSuffText() {
    if (this.suffix.displayWidth > 0) {
      this.suffText.visible = true;
      this.tweens.add({
        targets: this.suffText,
        x: this.suffix.x + this.suffix.displayWidth / 2,
        ease: "Linear",
        duration: 300,
      });
    } else {
      this.suffText.visible = false;
    }
  }
  increaseSuffix() {
    this.tweens.add({
      targets: this.suffix,
      duration: 300,
      ease: "Linear",
      displayWidth: this.suffix.displayWidth + 100,
      x: (this.i - this.len) * 100 + this.offset - 50,
      onComplete: () => {
        this.placeSuffText();
      },
    });
  }
  decreaseSuffix() {
    this.tweens.add({
      targets: this.suffix,
      duration: 300,
      ease: "Linear",
      displayWidth: this.len * 100,
      x: (this.i - 1) * 100 + this.offset - 50,
      onComplete: () => {
        this.placeSuffText();
      },
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#86CF74");

    this.event = new UserEventHandler({ ctx: this, fontSize: "15px" });
    this.event.init();

    this.steps = 20;
    this.rewind = new Rewind({
      ctx: this,
      callback: () => {
        this.scene.start("game_over", { key: "kmp" });
      },
    });
    this.countdown = new CountdownController({
      ctx: this,
      duration: this.steps * 7000,
    });
    this.countdown.start();
    this.lps = this.add.group();

    this.preText = this.createText(
      0,
      config.height / 2 - 60,
      "Longest Prefix",
      "#ffffff",
      10
    );
    this.preText.visible = false;

    this.suffText = this.createText(
      0,
      config.height / 2 - 60,
      "Also Suffix",
      "#015453",
      10
    );
    this.suffText.visible = false;

    this.prefix = this.add
      .image(this.offset - 50, config.height / 2 - 50, "redLid")
      .setOrigin(0);
    this.suffix = this.add
      .image(0, config.height / 2 - 50, "blueLid")
      .setOrigin(0);
    this.prefix.displayWidth = 0;
    this.suffix.displayWidth = 0;

    const graphics = this.add.graphics();

    const x = 100;
    const y = config.height / 2 - 230;
    const width = 100;
    const height = 80;
    const borderWidth = 7;
    const borderColor = 0x008483;

    graphics.fillStyle(0x015453); // Fill color
    graphics.lineStyle(borderWidth, borderColor); // Border color and width

    this.lpsBar.add(graphics);
    for (let i = 0; i < this.pt.length; i++) {
      const l = this.createText(
        this.offset + i * width,
        y + 40,
        "?",
        "#ffffff",
        40
      );
      this.lps.add(l);

      this.lpsBar.add(l);
      graphics.fillRect(i * width + this.offset - 50, y, width - 10, height);
    }

    graphics.fillStyle(0x02dbda);
    graphics.fillRoundedRect(
      this.offset - 50,
      config.height / 2 + 35,
      100 * this.pt.length,
      8,
      5
    );

    this.lengthBar = this.getBar(
      this.offset - 50,
      config.height / 2 + 35,
      "Potential Match!",
      0xff1a4b
    );
    this.lengthBar.visible = false;
    this.indexBar = this.getBar(
      this.offset - 50,
      config.height / 2 + 35,
      "To be Matched",
      0x015453
    );

    this.createButtons();

    new MessageBox({ ctx: this }).startTyping(window.guidance.kmp.guide1);
  }
  decimalToHex(decimalColor) {
    const hexColor = decimalColor.toString(16).padStart(6, "0");
    return `#${hexColor}`;
  }
  getBar(x, y, name, color = 0xffffff) {
    const barGraphics = this.add.graphics();
    barGraphics.fillStyle(color);
    barGraphics.fillRoundedRect(0, 0, 100, 8, 5);

    const l = this.createText(
      50,
      30,
      name,
      this.decimalToHex(color),
      20,
      "CustomFont"
    );
    const lenBar = this.add.container(x, y);
    lenBar.add(barGraphics);
    lenBar.add(l);
    return lenBar;
  }
  increment() {
    this.i++;
    if (this.i < this.pt.length) {
      this.tweens.add({
        targets: this.indexBar,
        x: this.indexBar.x + 100,
        ease: "Linear",
        duration: 300,
        onComplete: () => {
          this.lengthBar.visible = true;
        },
      });
      this.tweens.add({
        targets: this.lengthBar,
        x: this.offset - 50 + 100 * this.len,
        ease: "Linear",
        duration: 300,
        onComplete: () => {
          this.lengthBar.visible = true;
        },
      });
    } else {
      setTimeout(() => {
        this.lengthBar.visible = false;
        this.indexBar.visible = false;

        this.updateBtn.visible = false;
        this.ignoreBtn.visible = false;
        this.backBtn.visible = false;
        this.preText.visible = false;
        this.suffText.visible = false;
        this.prefix.visible = false;
        this.suffix.visible = false;
        this.tweens.add({
          targets: this.lpsBar,
          y: config.height / 2,
          ease: "linear",
          duration: 1000,
          onComplete: () => {
            this.tweens.add({
              targets: [this.slimes, this.lpsBar],
              x: -this.offset + 50,
              ease: "linear",
              duration: 1000,
              onComplete: () => {
                new KMP2({ ctx: this }).startPhaseTwo();
              },
            });
          },
        });
      }, 500);
    }
  }
  update() {
    this.countdown.update();
    if (
      !this.backwardDone &&
      this.i > 0 &&
      this.len < this.pt.length &&
      this.pt[this.len] != this.pt[this.i]
    ) {
      this.backwardDone = true;
      new MessageBox({ ctx: this, fontSize: 15 }).startTyping(
        window.guidance.kmp.guide3
      );
    }

    if (
      !this.updateDone &&
      this.i > 0 &&
      this.pt[this.len] == this.pt[this.i]
    ) {
      this.updateDone = true;
      new MessageBox({ ctx: this }).startTyping(window.guidance.kmp.guide2);
    }
  }
}
