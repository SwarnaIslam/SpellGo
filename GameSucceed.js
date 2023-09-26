//game won page
//calculate score
//update unlock status

class GameSucceed extends Phaser.Scene{
    constructor(){
        super("gameSucceed");
    }
    init(data){
        this.coinAmount=data.reward.totalScore;
        this.todo=data.todo;
        this.scene.remove(data.key);
    }
    preload(){
        this.load.spritesheet("coin","images/coin.png",{
            frameWidth:64,
            frameHeight:64
        });
    }
    create(){

        this.cameras.main.setBackgroundColor('#000000');

        // this.exitBtn.on("pointerdown",()=>{
        //     console.log("dhukse");
        //     this.scene.setVisible(false, 'gameSucceed');
        // })
        this.add.text(config.width/2,120,"TASK COMPLETED!", {
            fontFamily: 'PressStart',
            fontSize:40,
            fill: "#ffffff",
            align: 'center',
            wordWrap: {
                width: 100
            }
        }).setOrigin(0.5);
        this.anims.create({
            key:"coin",
            frames: this.anims.generateFrameNumbers("coin"),
            frameRate: 7,
            repeat: -1
        });

        (new MessageBox({ctx:this, transparent:true,fontColor:"#ffffff", fontFamily:"PressStart", fontSize:15})).startTyping(this.todo);

        this.add.text(config.width/2,config.height/2-64,this.coinAmount+" coins collected!",{
            fontFamily: 'PressStart',
            fontSize:15,
            fill: "#ffffff",
            align: 'center',
        }).setOrigin(0.5);

        this.rotatingCoin=this.add.sprite(config.width/2, config.height/2,"coin").setOrigin(0.5);
        this.rotatingCoin.play("coin");

        this.rotatingCoin1=this.add.sprite(config.width/2-44, config.height/2,"coin").setOrigin(0.5);
        this.rotatingCoin1.flipX=true;
        this.rotatingCoin1.play("coin");

        this.rotatingCoin1=this.add.sprite(config.width/2+44, config.height/2,"coin").setOrigin(0.5);
        this.rotatingCoin1.flipX=true;
        this.rotatingCoin1.play("coin");

        this.input.enabled=true;
        this.exit=new Button({ctx:this, x:10,y:10,btnName:"EXIT",fontColor:"#ffffff",btnColor:0x000001}).createButtons();
        this.exit.getByName('btn').on("pointerdown",()=>{
            this.scene.setVisible(false, 'gameSucceed');

        })
    }
    
}