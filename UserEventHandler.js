class UserEventHandler {
  constructor(con) {
    this.ctx = con.ctx;
    this.color = con.fontColor || "#000000";
    this.windowWidth = config.width;
    this.windowHeight = config.height;
  }
  getGeneralOption(x, y, name) {
    const option = this.ctx.add.text(x, y, name, {
      font: "20px CustomFont",
      fill: this.color,
      align: "center",
    });
    option.setOrigin(0.5);

    option.setInteractive({ useHandCursor: true });
    option.on("pointerover", () => {
      option.setFill("#ffffff");
      option.setFontSize(25);
    });
    option.on("pointerout", () => {
      option.setFill("#000000");
      option.setFontSize(20);
    });

    return option;
  }
  getRestartBtn(x, y) {
    const rst = this.getGeneralOption(x, y, "RESTART");
    rst.on("pointerdown", () => {
      this.ctx.scene.restart();
    });
    return rst;
  }
  getContinueBtn(x, y) {
    const con = this.getGeneralOption(x, y, "CONTINUE");

    con.on("pointerdown", () => {
      this.settingContainer.visible = false;
      if (this.ctx.countdown) {
        this.ctx.countdown.resume();
      }
      this.pauseIcon.visible = true;
    });

    return con;
  }
  getExitBtn(x, y) {
    const exit = this.getGeneralOption(x, y, "EXIT");

    exit.on("pointerdown", () => {
      this.ctx.scene.remove(this.ctx.key);
    });

    return exit;
  }
  init() {
    this.pauseIcon = this.ctx.add.image(40, 40, "pause");
    this.pauseIcon.setScale(0.75);
    this.pauseIcon.setInteractive({ cursor: "pointer" });

    const settingWindow = this.ctx.add.rectangle(
      0,
      0,
      this.windowWidth,
      this.windowHeight,
      0xffffff,
      0.75
    );
    settingWindow.setOrigin(0, 0);

    this.settingContainer = this.ctx.add.container(0, 0);

    const restart = this.getRestartBtn(
      this.windowWidth / 2,
      this.windowHeight / 2 - 40
    );
    const continuation = this.getContinueBtn(
      this.windowWidth / 2,
      this.windowHeight / 2
    );
    const exit = this.getExitBtn(
      this.windowWidth / 2,
      this.windowHeight / 2 + 40
    );

    this.settingContainer.add(settingWindow);
    this.settingContainer.add(restart);
    this.settingContainer.add(continuation);
    this.settingContainer.add(exit);

    this.settingContainer.visible = false;

    this.pauseIcon.on("pointerdown", () => {
      this.settingContainer.visible = true;

      if (this.ctx.countdown) {
        this.ctx.countdown.pause();
      }

      this.pauseIcon.visible = false;
    });
  }
}
