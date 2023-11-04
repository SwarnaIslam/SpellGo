class BinarySearch extends Phaser.Scene {
  constructor() {
    super("binarySearch");
  }
  init() {
    this.midChosen = false;
    this.halfChosen = true;
    this.leftChosen = false;
    this.rightChosen = false;
    this.totalPaper = 200;
    this.leftPoint = 1;
    this.rightPoint = this.totalPaper;
    this.searchObj = "";
    this.steps = 0;
  }
  getOffset(numberOfpapers) {
    return config.width / 2 - (50 * numberOfpapers + 138) / 2;
  }
  createPapers() {
    this.papers = [];
    const potionNames = [
      "Elixirium",
      "Magikor",
      "Arcanite",
      "Enchantus",
      "Charmaze",
      "Mysticon",
      "Potentia",
      "Spellbloom",
      "Wizdor",
      "Hexalite",
      "Sorcera",
      "Alchimix",
    ];

    const potions = [];
    for (let i = 0; i < this.totalPaper; i++) {
      const ind = Math.floor(Math.random() * potionNames.length);
      this.searchObj = potionNames[ind];
      potions.push(potionNames[ind]);
    }
    potions.sort();

    let l = 0,
      r = this.totalPaper - 1;
    while (l < r) {
      const m = Math.floor((l + r) / 2);
      if (potions[m] >= this.searchObj) {
        r = m;
      } else {
        l = m + 1;
      }
      this.steps++;
    }
    const offset = this.getOffset(this.totalPaper);

    for (let i = 0; i < this.totalPaper; i++) {
      const page = this.add.image(
        0,
        0 /*offset+i*50,config.height/2*/,
        "paper"
      );
      page.setOrigin(0, 0.5);
      page.setScale(0.5);

      const pageHeight = page.displayHeight * 0.5;
      const paperWidth = page.displayWidth;
      const pageNo = this.add
        .text(paperWidth - 30, pageHeight - 40, i + 1, {
          font: "14px WizardFont",
          fill: "#b81004",
          align: "center",
        })
        .setName("page-number");

      const potionName = this.add
        .text(paperWidth / 2, -90, potions[i], {
          font: "20px WizardFont",
          fill: "#b81004",
          align: "center",
        })
        .setName("potion-name");

      potionName.setOrigin(0.5, 0);
      potionName.alpha = 0;

      const pageGroup = this.add.container(offset + i * 50, config.height / 2);

      pageGroup.add(page);
      pageGroup.add(pageNo);
      pageGroup.add(potionName);

      pageGroup.depth = this.totalPaper - i - 1;
      this.papers.push(pageGroup);
    }
  }
  rangeUpdation(start, end) {
    for (let i = start; i < end; i++) {
      this.tweens.add({
        targets: this.papers[i],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          if (i == end - 1) {
            const remaining = this.getRemainingPaper();
            const offset = this.getOffset(remaining);
            let ind = 0;
            for (let j = this.leftPoint - 1; j < this.rightPoint; j++) {
              this.tweens.add({
                targets: this.papers[j],
                x: offset + ind * 50,
                ease: "linear",
                duration: 500,
                onComplete: () => {
                  if (j == this.rightPoint - 1) {
                    this.midChosen = false;
                  }
                },
              });
              ind++;
            }
          }
        },
      });
    }
  }
  getRemainingPaper() {
    return this.rightPoint - this.leftPoint;
  }
  createLibrary() {
    this.background = this.add.image(0, 0, "library_interior");
    this.background.setOrigin(0, 0);

    this.widthRatio = config.width / this.background.width;
    this.heightRatio = config.height / this.background.height;

    this.background.setScale(this.heightRatio);
  }
  createButton(x, y, btnName) {
    const btn = this.add.image(x, y, btnName);
    btn.setScale(0.05);
    btn.setInteractive();
    btn.alpha = 1;
    btn.visible = true;
    return btn;
  }
  create() {
    this.createLibrary();
    this.event = new UserEventHandler({ ctx: this, fontColor: "#ffffff" });
    this.event.init();

    this.left = this.createButton(
      config.width / 2 - 25,
      config.height - 80,
      "left-btn"
    );
    this.right = this.createButton(
      this.left.x + this.left.displayWidth + 10,
      config.height - 80,
      "right-btn"
    );

    this.left.on("pointerover", () => {
      this.left.setTexture("selected-left-btn");
      this.right.setScale(0.04);
    });
    this.left.on("pointerout", () => {
      this.left.setTexture("left-btn");
      this.right.setScale(0.05);
    });

    this.right.on("pointerover", () => {
      this.right.setTexture("selected-right-btn");
      this.left.setScale(0.04);
    });
    this.right.on("pointerout", () => {
      this.right.setTexture("right-btn");
      this.left.setScale(0.05);
    });

    this.left.on("pointerdown", () => {
      if (this.halfChosen) return;
      this.halfChosen = true;
      const mid = this.getMid();

      if (this.papers[mid].getByName("potion-name").text < this.searchObj) {
        this.rewind.reduceLive();
        new MessageBox({ ctx: this }).startTyping(
          window.hints.binarySearch.pickRight
        );
        this.halfChosen = false;
        return;
      }

      this.tweens.add({
        targets: this.papers[mid],
        y: this.papers[mid].y + 90,
        duration: 500,
      });
      const pageNo = parseInt(this.papers[mid].getByName("page-number").text);

      const prevRight = this.rightPoint;
      this.rightPoint = pageNo;

      this.rangeUpdation(mid + 1, prevRight);
    });
    this.right.on("pointerdown", () => {
      if (this.halfChosen) return;
      this.halfChosen = true;
      const mid = this.getMid();

      if (this.papers[mid].getByName("potion-name").text >= this.searchObj) {
        this.rewind.reduceLive();
        new MessageBox({ ctx: this }).startTyping(
          window.hints.binarySearch.pickLeft
        );
        this.halfChosen = false;
        return;
      }

      this.tweens.add({
        targets: this.papers[mid],
        y: this.papers[mid].y + 90,
        duration: 500,
      });
      const pageNo = parseInt(this.papers[mid].getByName("page-number").text);

      const prevLeft = this.leftPoint;
      this.leftPoint = pageNo + 1;

      this.rangeUpdation(prevLeft - 1, pageNo);
    });
    this.createPapers();

    this.add
      .text(config.width / 2, 30, `First Page of "${this.searchObj}" Potion`, {
        font: "40px WizardFont",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.rewind = new Rewind({
      ctx: this,
      callback: () => {
        this.scene.start("game_over", { key: "binarySearch" });
      },
    });
    this.countdown = new CountdownController({
      ctx: this,
      duration: this.steps * 6000,
      callback: () => {
        this.scene.start("game_over", { key: "binarySearch" });
      },
    });
    this.countdown.start();
  }
  getMid() {
    return Math.floor((this.leftPoint + this.rightPoint) / 2) - 1;
  }
  update() {
    this.countdown.update();
    if (!this.midChosen) {
      this.countdown.pause();
      this.midChosen = true;
      const mid = this.getMid();
      if (
        !this.leftChosen &&
        this.papers[mid].getByName("potion-name").text >= this.searchObj
      ) {
        this.leftChosen = true;
        new MessageBox({ ctx: this }).startTyping(
          window.guidance.binarySearch.pickLeft
        );
      } else if (!this.rightChosen) {
        this.rightChosen = true;
        new MessageBox({ ctx: this }).startTyping(
          window.guidance.binarySearch.pickRight
        );
      }

      this.tweens.add({
        targets: this.papers[mid],
        y: this.papers[mid].y - 90,
        duration: 1000,
        onComplete: () => {
          this.tweens.add({
            targets: [this.papers[mid].getByName("potion-name")],
            alpha: 1,
            duration: 1000,
            onComplete: () => {
              if (this.leftPoint == this.rightPoint) {
                this.scene.pause();
                // pause the timer, player won!!!!!!
                this.reward = new Reward({ ctx: this, maxScore: 1000 });
                this.scene.start("gameSucceed", {
                  reward: this.reward,
                  todo: [
                    { text: "NEXT TASK: ", speed: window.speeds.slow },
                    {
                      text: "Take the recipe with you to the post office",
                      speed: window.speeds.normal,
                    },
                    { text: "...", speed: window.speeds.slow },
                    {
                      text: "See you until then!",
                      speed: window.speeds.normal,
                    },
                  ],
                  key: "binarySearch",
                });
              }
              this.halfChosen = false;
              this.countdown.resume();
            },
          });
        },
      });
    }
  }
}
