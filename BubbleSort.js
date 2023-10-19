class BubbleSort extends Phaser.Scene {
    constructor() {
        super("bubbleSort");
        this.stairColors = [0x61ed87, 0xedcf61, 0xed8e61, 0xed6861, 0xa561ed, 0x61edda, 0x61aced, 0xf5f542];
        this.restarted=false;
    }
   
    init(data){
        this.levelName=data.id;
    }
    createStair() {
        this.stairs = [];
        this.numberOfStairs = Math.floor(Math.random() * (7 - 5 + 1)) + 5;
        // this.numberOfStairs=3;
        let stairOffset = 30;
        let stairWidth = 80;
        let posOffset = (config.width - (this.numberOfStairs * stairWidth)) / 2;

        for (var i = 0; i < this.numberOfStairs; i++) {
            const rect = this.add.rectangle(0, config.height * 0.70 - i * stairOffset, stairWidth, (i + 1) * stairOffset, this.stairColors[i]);
            rect.setOrigin(0, 0);
            this.stairs.push(rect);
        }
        utils.fisherYates(this.stairs);

        for (var i = 0; i < this.numberOfStairs; i++) {
            this.stairs[i].x = i * this.stairs[i].width + posOffset;
        }
    }
    createLives(){
        this.steps=(this.numberOfLights * (this.numberOfLights + 1)) / 2;
        this.rewind=new Rewind({ctx:this,callback: () => {
            this.scene.start("game_over",{key:'bubbleSort'})
            }
        });
    }
    createLight() {
        this.light=[];
        this.currentLight = 0;
        this.numberOfLights = this.numberOfStairs - 1;
        for (var i = 0; i < this.numberOfLights; i++) {
            const l = this.add.image((this.stairs[i].width + this.stairs[i + 1].width) / 2 + this.stairs[i].x, 0, "lightOff");
            l.setOrigin(0, 0);
            l.x -= l.width / 2;
            this.light.push(l);
        }
        this.light[0].setTexture("lightOn");
    }
    
    createCountdownTimer() {
        let totalTime = (this.numberOfLights * (this.numberOfLights + 1)) / 2 * 5000;
        this.countdown = new CountdownController({
            ctx: this,
            duration: totalTime,
            callback: this.handleLevelCompletion.bind(this)
        })
        this.countdown.start()
    }
    
    handleLevelCompletion() {
        this.scene.start('game_over',{key:'bubbleSort'});
    }
    create() {
        this.cameras.main.setBackgroundColor('#000000'); 
        this.createStair();
        this.createLight();
        this.createLives();
        this.createCountdownTimer();

    
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.event=new UserEventHandler({ctx:this})
        this.event.createRestartBtn(config.width-70,config.height-40);
        this.controller = new BubbleSortController(this);
        this.controller.guiding();
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.controller.cutScenePlaying) {
            this.controller.perform(()=>{
                this.controller.switching();
            });
        }
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('s')) && !this.controller.cutScenePlaying) {
            this.controller.perform(()=>{
                this.controller.swap().then(()=>{
                    this.controller.isSwapRight();
                })
            });
        }
        this.countdown.update();
    }

}