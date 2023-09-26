class Huffman2 {
    constructor(con) {
        this.ctx = con.ctx;
        this.tree = this.ctx.tree;
    }
    startPhaseTwo() {
        this.zero = new Button({ ctx: this.ctx, btnName: "Zero", x: 20, y: config.height / 2 }).createButtons();
        this.one = new Button({ ctx: this.ctx, btnName: "One", x: 20, y: config.height / 2 + 60 }).createButtons();
        this.node=this.tree[0];

        this.encoding=[];
        this.values=[];
        this.currentIndex=0;

        this.ctx.add.rectangle(config.width/2,(this.ctx.frequency.length*45)/2+10,200,this.ctx.frequency.length*45,0xffffff).setOrigin(0.5);

        for(let i=0;i<this.ctx.frequency.length;i++){
            const key = parseInt(Object.keys(this.ctx.frequency[i])[0]);
            const value=this.ctx.frequency[i][key];
            this.values.push(value);
            const encode=this.ctx.add.text(config.width/2-50,20+40*i,value+": ",{
                fontFamily:'PressStart',
                fontSize:'15px',
                color:'#000000',
                align:'center'
            }).setOrigin(0);
            this.encoding.push(encode);

        }

        this.encoding[0].setFontSize(20)
        this.encoding[0].setFill('#ff0000')
        const graphics = this.ctx.add.graphics();

        graphics.lineStyle(2, 0xffffff);

        const line = new Phaser.Geom.Line(0, 10, 50, 10);
        graphics.strokeLineShape(line);

        const updateLine = (newStartX, newStartY, newEndX, newEndY) => {
            line.setTo(newStartX, newStartY, newEndX, newEndY);
            graphics.clear();
            graphics.lineStyle(2, 0xffffff);
            graphics.strokeLineShape(line);
            this.node.container.add(graphics);
        };

        this.one.getByName("btn").on("pointerdown", () => {
            if(this.node.right){
                const pos=this.node.rightLine;
                updateLine(pos[0], pos[1], pos[2], pos[3]);
                console.log(this.node.right);
                this.setText(1);
                this.node=this.node.right;

                if(this.node.value && this.node.value==this.values[this.currentIndex]){
                    if(this.currentIndex<this.ctx.frequency.length){
                        setTimeout(()=>{
                            this.setCurrent();
                            graphics.clear();
                            if(this.currentIndex>=this.ctx.frequency.length){
                                this.reward = new Reward({ ctx: this.ctx, maxScore: 2000 });
                                this.ctx.scene.start("gameSucceed", {
                                    reward: this.reward,
                                    todo: [
                                        { text: "NEXT TASK: ", speed: window.speeds.slow },
                                        { text: "Enter into the post office", speed: window.speeds.normal },
                                        { text: "...", speed: window.speeds.slow },
                                        { text: "Go near the port!", speed: window.speeds.normal }
                                    ]
                                })
                            }
                        },500);

                    }
                    
                }
                else if(this.node.value && this.node.value!=this.values[this.currentIndex]){
                    setTimeout(()=>{
                        this.node=this.tree[0];
                        this.ctx.rewind.reduceLive();
                        (new MessageBox({ctx:this.ctx})).startTyping(window.hints.huffman.hint3);
                        this.encoding[this.currentIndex].setText(this.values[this.currentIndex]+": ");
                        graphics.clear();
                    },500);
                }
            }
            
        });
        this.zero.getByName("btn").on("pointerdown", () => {
            if(this.node.left){
                const pos=this.node.leftLine;
                updateLine(pos[0], pos[1], pos[2], pos[3]);
                console.log(this.node.left);
                this.setText(0);
                this.node=this.node.left;
                
                if(this.node.value && this.node.value==this.values[this.currentIndex]){
                    if(this.currentIndex<this.ctx.frequency.length){
                        setTimeout(()=>{
                            this.setCurrent();
                            graphics.clear();
                            if(this.currentIndex>=this.ctx.frequency.length){
                                this.reward = new Reward({ ctx: this.ctx, maxScore: 2000 });
                                this.ctx.scene.start("gameSucceed", {
                                    reward: this.reward,
                                    todo: [
                                        { text: "NEXT TASK: ", speed: window.speeds.slow },
                                        { text: "Enter into the post office", speed: window.speeds.normal },
                                        { text: "...", speed: window.speeds.slow },
                                        { text: "Go near the port!", speed: window.speeds.normal }
                                    ]
                                })
                            }
                        },500);

                    }
                }
                else if(this.node.value && this.node.value!=this.values[this.currentIndex]){
                    setTimeout(()=>{
                        this.node=this.tree[0];
                        this.ctx.rewind.reduceLive();
                        (new MessageBox({ctx:this.ctx})).startTyping(window.hints.huffman.hint3);
                        this.encoding[this.currentIndex].setText(this.values[this.currentIndex]+": ");
                        graphics.clear();
                    },500);
                }
            }
            
        });
    }
    setText(bit){
        const oldText=this.encoding[this.currentIndex].text;
        const newText=oldText+bit;

        this.encoding[this.currentIndex].setText(newText);
    }
    setCurrent(){
        this.encoding[this.currentIndex].setFontSize(15);
        this.encoding[this.currentIndex].setFill('#000000');

        this.currentIndex++;

        if(this.currentIndex<this.ctx.frequency.length){
            this.encoding[this.currentIndex].setFontSize(20);
            this.encoding[this.currentIndex].setFill('#ff0000');
            this.node=this.tree[0];
        }
    }
}