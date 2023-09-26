class GameOver extends Phaser.Scene {
    constructor() {
      super({ key: 'game_over' });
    }
    init(data){
        this.scene.remove(data.key);
    }
    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.text=this.add.text(0,0,'GAME OVER',{
            fontFamily:'PressStart',
            fontSize:50,
            align:'center'
        });

        this.text.setOrigin(0.5,0.5);

        this.text.x = this.cameras.main.centerX;
        this.text.y = this.cameras.main.centerY;

        this.time.delayedCall(5000, () => {
            
            this.scene.setVisible(false, 'game_over');
        });
    }
  }
  