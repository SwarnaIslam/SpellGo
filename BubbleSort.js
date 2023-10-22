class BubbleSort extends Phaser.Scene {
    constructor() {
        super("bubbleSort");
        this.stairColors = [0xed7f79,0xED6861,0xeb5e57, 0xeb534b, 0xed463e, 0xfc2b21, 0xed241a];
        this.restarted=false;
    }
   
    init(data){
        this.levelName=data.id;
    }
    createStair() {
        this.stairs = [];
        this.numberOfStairs = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
        // this.numberOfStairs=3;
        let stairOffset = 30;
        this.stairWidth = 80;
        let posOffset = (config.width - (this.numberOfStairs * this.stairWidth)) / 2;

        for (var i = 0; i < this.numberOfStairs; i++) {
            const stair=this.add.container(0,config.height * 0.70 - i * stairOffset);
            const rect = this.add.rectangle(0, 0, this.stairWidth, (i + 1) * stairOffset+60, this.stairColors[i]);
            rect.setOrigin(0, 0);
            stair.add(rect);
            this.stairs.push(stair);
        }
        utils.fisherYates(this.stairs);

        for (var i = 0; i < this.numberOfStairs; i++) {
            this.stairs[i].x = i * 80 + posOffset;
            const catNo="catFace"+(Math.floor(Math.random() * (2 - 1 + 1)) + 1);
            console.log(catNo)
            const catFace=this.add.sprite(-1,-1,catNo);
            const catPaw=this.add.image(-1,3,"catPaw");
            catFace.setOrigin(0)
            catFace.play(catNo)
            catPaw.setOrigin(0,1)
            // catPaw.setScale(1,(this.stairs[i].getAt(0).displayHeight-40)/catPaw.displayHeight)
            catPaw.setY(this.stairs[i].getAt(0).displayHeight);
            this.stairs[i].add(catPaw);
            this.stairs[i].add(catFace);
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
            const l = this.add.image(this.stairWidth  + this.stairs[i].x, 0, "lightOff");
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
        this.event.init()
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