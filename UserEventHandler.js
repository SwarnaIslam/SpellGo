class UserEventHandler {
    constructor(con) {
        this.ctx = con.ctx;
        this.color=con.fontColor||"#000000";
    }
    createRestartBtn(x, y) {
        this.rst = this.ctx.add.text(x, y, 'Restart', {
            font: '20px CustomFont',
            fill: this.color,
            align: 'center'
        });
        this.rst.setOrigin(0); 

        this.rst.setInteractive({ useHandCursor: true });
        this.rst.on('pointerover', () => {
            this.rst.setFill('#ffffff')
            this.rst.setFontSize(25)
        });
        this.rst.on('pointerout', () => {
            this.rst.setFill('#000000')
            this.rst.setFontSize(20)
        });

        this.rst.on('pointerdown',()=>{
                this.ctx.scene.restart();
            
        });
    }
    createContinueBtn() {

    }
    createExitBtn() {

    }
}