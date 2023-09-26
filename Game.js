const canvas = document.getElementById('game-canvas');
const config = {
    type: Phaser.AUTO,
    parent: "container",
    width: 1120,
    height: 550,
    transparent:true,
    scene: {
        preload: preload,
        create: create
    }
};
const game = new Phaser.Game(config);
game.scene.add("gameSucceed",GameSucceed);
game.scene.add("gameOver",GameOver);

function preload(){
        
    this.load.setCORS('anonymous')
    this.load.spritesheet('button', 'https://examples.phaser.io/assets/buttons/button_sprite_sheet.png', { frameWidth: 193, frameHeight: 71 })
    this.load.atlas('buttonAtlas', 'https://examples.phaser.io/assets/buttons/button_texture_atlas.png', 'https://examples.phaser.io/assets/buttons/button_texture_atlas.json')
    this.load.image("lightOff", "images/lightOff.png");
    this.load.image("lightOn", "images/lightOn.png");
    this.load.image("paper","images/parchment_612x612.png");
    this.load.image("forest", "images/forest.jpg");
    this.load.image("dead-tree", "images/dead_tree.png");
    this.load.image("dead-tree2", "images/dead_tree2.png");
    this.load.image("dead-tree3", "images/dead_tree3.png");
    this.load.image("timber", "images/timber.png");
    this.load.image("left-btn","images/left.png");
    this.load.image("right-btn","images/right.png");
    this.load.image("selected-left-btn","images/SelectedLeft.png");
    this.load.image("selected-right-btn","images/selectedRight.png");
    this.load.image("redLid","images/redLid.png");
    this.load.image("blueLid","images/blueLid.png");
    this.load.spritesheet("lives","images/lives.png",{
        frameWidth:128,
        frameHeight:98
    });
    this.load.spritesheet("dummy","images/dummy.png",{
        frameWidth:328,
        frameHeight:260
    });
    this.load.spritesheet("badWizardAttack","images/badWizardAttack.png",{
        frameWidth:64,
        frameHeight:64
    });
    this.load.spritesheet("badWizardDead","images/badWizardDead.png",{
        frameWidth:64,
        frameHeight:64
    });
    this.load.spritesheet("fountain","images/fountain_slow.png",{
        frameWidth:32,
        frameHeight:32
    });
    this.load.spritesheet("wizardPointBar","images/wizardPointBar.png",{
        frameWidth:326.25,
        frameHeight:135
    });
    this.load.spritesheet("slimeYellow","images/slimeYellow.png",{
        frameWidth:160,
        frameHeight:160
    });
    this.load.spritesheet("slimeOrange","images/slimeOrange.png",{
        frameWidth:160,
        frameHeight:160
    });
    this.load.spritesheet("slimeLime","images/slimeLime.png",{
        frameWidth:160,
        frameHeight:160
    });
    this.load.bitmapFont("pixelFont", "/images/font/font.png", "images/font/font.xml");
    this.load.bitmapFont("pixelFont_black", "/images/font/font-black.png", "images/font/font.xml");
    this.load.image("wizard", "images/wizard.jpg");
    this.load.image("library_interior","images/library_inside.png");
    this.load.image("speech","images/speech_bubble.png");
    this.load.image("village_map","images/wizard_village_map.png");
    this.load.image("unselectedVillage","images/unSelectedBanner.png");
    this.load.image("selectedVillage","images/selectedBanner.png");
    this.load.image("VerticalBridge","images/verticalBridge.png");
    this.load.image("selectedVerticalBridge","images/selectedVerticalBridge.png");
    this.load.image("HorizontalBridge","images/horizontalBridge.png");
    this.load.image("selectedHorizontalBridge","images/selectedHorizontalBridge.png");
    this.load.image("VisitedVerticalBridge","images/visitedVerticalBridge.png");
    this.load.image("selectedVisitedVerticalBridge","images/selectedVisitedVerticalBridge.png");
    this.load.image("VisitedHorizontalBridge","images/visitedHorizontalBridge.png");
    this.load.image("selectedVisitedHorizontalBridge","images/selectedVisitedHorizontalBridge.png");
}
function create() {
    this.anims.create({
        key:"standingDummy",
        frames:this.anims.generateFrameNumbers("dummy"),
        frameRate:2,
        repeat:-1
    })
    this.anims.create({
        key:"ReduceLive",
        frames: this.anims.generateFrameNumbers("lives"),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key:"badWizardAttack",
        frames: this.anims.generateFrameNumbers("badWizardAttack"),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key:"badWizardDead",
        frames: this.anims.generateFrameNumbers("badWizardDead"),
        frameRate: 2,
        repeat: 0
    });
    this.anims.create({
        key:"fountain",
        frames: this.anims.generateFrameNumbers("fountain"),
        frameRate: 4,
        repeat: -1
    });
    this.anims.create({
        key:"wizardPointBar",
        frames: this.anims.generateFrameNumbers("wizardPointBar"),
        frameRate: 4,
        repeat: 0
    });
    
}