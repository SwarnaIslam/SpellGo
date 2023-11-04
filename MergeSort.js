class MergeSort extends Phaser.Scene {
  constructor() {
    super("mergeSort");
  }
  createArray() {
    const num = Math.floor(Math.random() * (7 - 5 + 1)) + 5;
    for (let i = 0; i < num; i++) {
      const rand = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      this.array.push(rand);
    }
    this.maxHeight = Math.ceil(Math.log2(this.array.length));
  }
  createTrees() {
    this.treeType = ["dead-tree", "dead-tree2", "dead-tree3"];
    this.trees = [];
    for (let i = 0; i < 10; i++) {
      const ind = Math.floor(Math.random() * 3);
      let tree = this.add.sprite(i * 100 + 100, 250, this.treeType[ind]);
      tree.alpha = 0.7;
      this.trees.push(tree);
    }
  }
  createTimer() {
    this.countdown = new CountdownController({
      ctx: this,
      duration: this.steps * 5000,
    });
    this.countdown.start();
  }
  createTexts() {
    this.texts = [];
    for (let i = 0; i < this.array.length; i++) {
      let text = this.add.text(0, 0, this.array[i].toString(), {
        fontFamily: "CustomFont",
        fontSize: 30,
        color: "#000000",
        align: "center",
      });
      text.setOrigin(0, 0);
      this.texts.push(text);
    }
  }

  countSteps(left, right, val) {
    if (left >= right) return;
    this.steps += val;
    let mid = Math.floor((left + right) / 2);

    this.countSteps(left, mid, mid - left + 1);
    this.countSteps(mid + 1, right, right - mid);
  }
  init() {
    this.gapBetweenNodes = 0;
    this.nodeHeight = 50;
    this.perBranch = 50;
    this.array = [];
    this.startFrom = 100;
    this.steps = 0;
    this.divideDone = false;
    this.mergeDone = false;
  }
  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "forest"
    );
    this.background.setOrigin(0, 0);
    this.background.setScale(1, 1.5);

    // this.createTrees();
    this.ground = this.add.rectangle(
      0,
      370,
      config.width,
      config.height - 370,
      0x284e61
    );
    this.ground.setOrigin(0, 0);

    this.createArray();
    this.countSteps(0, this.array.length - 1, this.array.length);
    this.steps += this.array.length - 1;
    this.createTimer();
    this.rewind = new Rewind({
      ctx: this,
      callback: () => {
        this.scene.start("game_over",{ key: "mergeSort" });
      },
    });

    this.goLeft = new Button({
      ctx: this,
      x: config.width - 250,
      y: 300,
      btnName: "Choose Left",
      fontSize: 15,
    }).createButtons();
    this.goRight = new Button({
      ctx: this,
      x: config.width - 250,
      y: this.goLeft.y + 60,
      btnName: "Choose Right",
      fontSize: 15,
    }).createButtons();

    this.goLeft.visible = this.goRight.visible = false;

    this.divide = new Button({
      ctx: this,
      x: config.width - 250,
      y: 300,
      btnName: "Divide",
    }).createButtons();
    this.combine = new Button({
      ctx: this,
      x: config.width - 250,
      y: this.divide.y + 60,
      btnName: "Combine",
    }).createButtons();

    this.createTexts();
    this.add.image(
      config.width / 2 - 40,
      config.height - this.startFrom + this.nodeHeight - 10,
      "timber"
    );

    this.event = new UserEventHandler({ ctx: this, fontSize: "15px" });
    this.event.init();
    this.startSorting();
  }
  async startSorting() {
    let currentNode = this.make_tree(
      { x: config.width / 2, y: config.height - this.startFrom },
      "root",
      0,
      this.array.length - 1
    );
    await this.mergeSort(0, this.array.length - 1, currentNode, 0);
    this.reward = new Reward({ ctx: this, maxScore: 4000 });
    this.scene.start("gameSucceed", {
      reward: this.reward,
      todo: [
        { text: "NEXT TASK: ", speed: window.speeds.slow },
        { text: "Help out in the slime shop", speed: window.speeds.normal },
        { text: "...", speed: window.speeds.slow },
      ],
      key: "mergeSort",
    });
  }
  async mergeSort(begin, end, currentNode, currHeight) {
    if (!this.divideDone) {
      this.divideDone = true;
      await new MessageBox({ ctx: this }).startTyping(
        window.guidance.mergeSort.divide
      );
    }
    if (begin >= end) {
      return;
    }
    const mid = Math.floor(begin + (end - begin) / 2);

    await this.requestToDivide();
    let leftNode = this.make_tree(currentNode, "left", begin, mid);

    let rightNode = this.make_tree(currentNode, "right", mid + 1, end);

    await this.mergeSort(begin, mid, leftNode, currHeight + 1);
    await this.mergeSort(mid + 1, end, rightNode, currHeight + 1);

    if (!this.mergeDone) {
      this.mergeDone = true;
      await new MessageBox({ ctx: this }).startTyping(
        window.guidance.mergeSort.merge
      );
    }
    await this.requestToMerge();
    await this.merge(begin, mid, end, currHeight, currentNode);
    return Promise.resolve;
  }
  make_tree(parent, type, start, end) {
    let childNode = {};
    childNode.start = start;
    childNode.end = end;

    childNode.value = end - start + 1;
    childNode.width = childNode.value * this.perBranch;

    if (type === "right") {
      childNode.x = parent.x + parent.width - childNode.width / 2;
    } else childNode.x = parent.x - childNode.width / 2;

    childNode.y = parent.y - this.gapBetweenNodes - this.nodeHeight;

    let node = this.add.container(childNode.x, childNode.y);

    const graphics = this.add.graphics();

    graphics.fillStyle(0xe4004d, 1);
    graphics.fillRoundedRect(0, 0, childNode.width, this.nodeHeight, 10);

    let count = 0;
    node.add(graphics);
    for (let i = childNode.start; i <= childNode.end; i++) {
      this.texts[i].setPosition(count * this.perBranch + 10, 0);
      node.add(this.texts[i]);
      count++;
    }
    node.visible = true;

    return childNode;
  }
  async appendNumber(node, left, mid, right) {
    return new Promise((resolve) => {
      this.goRight.visible = true;
      this.goLeft.visible = true;
      let nodeInd = 0,
        leftInd = 0,
        rightInd = 0,
        mergeInd = left;
      let leftNode = [],
        rightNode = [];
      for (let i = left; i <= mid; i++) {
        leftNode.push(this.texts[i]);
      }
      for (let i = mid + 1; i <= right; i++) {
        rightNode.push(this.texts[i]);
      }
      this.goLeft.getByName("btn").on("pointerdown", () => {
        if (leftInd < mid - left + 1) {
          if (
            rightInd >= rightNode.length ||
            parseInt(leftNode[leftInd].text) <=
              parseInt(rightNode[rightInd].text)
          ) {
            this.texts[mergeInd] = leftNode[leftInd++];
            this.texts[mergeInd].setPosition(nodeInd * this.perBranch + 10, 0);
            node.add(this.texts[mergeInd++]);
            nodeInd++;
            if (nodeInd == rightNode.length + leftNode.length) {
              this.goLeft.visible = false;
              this.goRight.visible = false;
              this.divide.visible = true;
              this.combine.visible = true;
              resolve();
            }
          } else {
            new MessageBox({ ctx: this }).startTyping(
              window.hints.mergeSort.misstep3
            );
            this.rewind.reduceLive();
          }
        }
      });
      this.goRight.getByName("btn").on("pointerdown", () => {
        if (rightInd < right - mid) {
          if (
            leftInd >= leftNode.length ||
            parseInt(leftNode[leftInd].text) >=
              parseInt(rightNode[rightInd].text)
          ) {
            this.texts[mergeInd] = rightNode[rightInd++];
            this.texts[mergeInd].setPosition(nodeInd * this.perBranch + 10, 0);
            node.add(this.texts[mergeInd++]);
            nodeInd++;
            if (nodeInd == rightNode.length + leftNode.length) {
              this.goLeft.visible = false;
              this.goRight.visible = false;
              this.divide.visible = true;
              this.combine.visible = true;
              resolve();
            }
          } else {
            new MessageBox({ ctx: this }).startTyping(
              window.hints.mergeSort.misstep3
            );
            this.rewind.reduceLive();
          }
        }
      });
    });
  }
  async merge(left, mid, right, currHeight, currNode) {
    const newY =
      config.height -
      (2 * this.maxHeight - currHeight + 1) *
        (this.nodeHeight + this.gapBetweenNodes) -
      this.startFrom;

    let node = this.add.container(currNode.x, newY);
    const graphics = this.add.graphics();

    graphics.fillStyle(0xe4004d, 1);
    graphics.fillRoundedRect(0, 0, currNode.width, this.nodeHeight, 20);

    node.add(graphics);
    node.visible = true;

    await this.appendNumber(node, left, mid, right);
  }
  requestToDivide() {
    return new Promise((resolve) => {
      const combineClicked = () => {
        new MessageBox({ ctx: this }).startTyping(
          window.hints.mergeSort.misstep1
        );
        this.rewind.reduceLive();
      };
      this.combine.getByName("btn").on("pointerdown", combineClicked);
      this.divide.getByName("btn").on("pointerdown", () => {
        this.combine.getByName("btn").off("pointerdown", combineClicked);
        resolve();
      });
    });
  }
  requestToMerge() {
    return new Promise((resolve) => {
      const combineClicked = () => {
        this.divide.visible = false;
        this.combine.visible = false;
        this.divide.getByName("btn").off("pointerdown", divideClicked);
        this.combine.getByName("btn").off("pointerdown", combineClicked);
        resolve();
      };

      const divideClicked = () => {
        new MessageBox({ ctx: this }).startTyping(
          window.hints.mergeSort.misstep2
        );
        this.rewind.reduceLive();
      };
      this.divide.getByName("btn").on("pointerdown", divideClicked);
      this.combine.getByName("btn").on("pointerdown", combineClicked);
    });
  }
  update() {
    this.countdown.update();
  }
}
