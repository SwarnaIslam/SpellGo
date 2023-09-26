class Huffman1 extends Phaser.Scene {
    constructor() {
        super("huffman");
        this.frequency = [
            { 12: 'c' },
            { 13: 'b' },
            { 16: 'd' },
            { 14: 'e' },
            { 18: 'f' }
        ];
        this.pickedRight = false;
        this.pickedLeft = false;
        this.branchNeeded=true;

        this.rightInd=0;
        this.leftInd=0;

        this.disX = 60;
        this.disY = 70;


        this.minY = config.height - 60;
        this.container=null;
    }
    getOffset(){
        return config.width / this.tree.length;
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#9ffcfb');

        this.event=new UserEventHandler({ctx:this, fontSize:"15px"})
        this.event.createRestartBtn(160,10);
        this.offset = config.width / this.frequency.length;

        this.steps=22;
        this.rewind=new Rewind({ctx:this,callback: () => {
            this.scene.start("game_over")
        }});
        this.countdown = new CountdownController({
            ctx: this, duration: this.steps * 6000, callback: () => {
                this.scene.start("game_over")
            },
            fontColor:'#000001'
        });
        this.countdown.start();
        this.tree=[];
        this.tester=[];
        for (let i = 0; i < this.frequency.length; i++) {
            const node = this.add.rectangle(0, 0, 80, 30, 0xffffff).setOrigin(0.5);
            const key = parseInt(Object.keys(this.frequency[i])[0]);
            this.tester.push(key);

            const freq = this.add.text(0, 0, key + ": " + this.frequency[i][key], {
                color: "#000000"
            }).setOrigin(0.5);

            const container = this.add.container(this.offset * i + this.offset / 2, this.minY + 15);
            container.add(node);
            container.add(freq);
            const obj = {
                key,
                value:this.frequency[i][key],
                right: null,
                left: null,
                container,
                height:0
            }
            this.tree.push(obj)
        }
        
        this.btns=[];

        for(let i=0;i<this.frequency.length;i++){
            const btnWidth=this.offset;
            const btn=new Button({
                ctx:this,
                x:this.offset*i,
                y:config.height-30,
                btnName:i+1,
                borderThick:2,
                width:btnWidth,
                height:30,
                fontSize:15
            }).createButtons();

            btn.getByName("btn").on("pointerdown",()=>{
                if(!this.pickedLeft){
                    const test=Math.min(...this.tester);
                    const key=this.tree[i].key;

                    console.log(test+" "+key);
                    if(key!=test){
                        this.rewind.reduceLive();
                        (new MessageBox({ctx:this})).startTyping(window.hints.huffman.hint1);
                        return;
                    }

                    this.tester.sort();
                    this.tester.splice(0,1);

                    this.leftInd=i;
                    this.tweens.add({
                        targets: this.tree[i].container,
                        x: config.width / 2 - this.disX,
                        y: 90,
                        depth: 1,
                        ease: "linear",
                        duration: 500,
                        onComplete:()=>{
                            this.tree[i].container.x=-this.disX;
                            this.tree[i].container.y=70;
                            this.container.add(this.tree[i].container);
                            this.pickedLeft=true;
                        }
                    })
                }
                else if(!this.pickedRight){
                    const test=Math.min(...this.tester);
                    const key=this.tree[i].key;

                    console.log(test+" "+key);

                    if(key!=test){
                        this.rewind.reduceLive();
                        (new MessageBox({ctx:this})).startTyping(window.hints.huffman.hint2);
                        return;
                    }

                    this.tester.sort();
                    this.tester.splice(0,1);
                    
                    this.rightInd=i;
                    this.tweens.add({
                        targets: this.tree[i].container,
                        x: config.width / 2 + this.disX,
                        y: 90,
                        depth: 1,
                        ease: "linear",
                        duration: 500,
                        onComplete:()=>{
                            console.log(this.leftInd+" "+this.rightInd);
                            this.tree[i].container.x=this.disX;
                            this.tree[i].container.y=70;
                            this.container.add(this.tree[i].container);
                            this.pickedRight=true;

                            const leftNode=this.tree.slice(this.leftInd,this.leftInd+1)[0];
                            const rightNode=this.tree.slice(this.rightInd,this.rightInd+1)[0];
                            const height=Math.max(leftNode.height, rightNode.height)+1;

                            const ind1=Math.min(this.leftInd, this.rightInd), ind2=Math.max(this.leftInd, this.rightInd);

                            this.tree.splice(ind1,1);
                            this.tree.splice(ind2-1,1);

                            const key=leftNode.key+rightNode.key;
                            const sum=this.add.text(0, 0, key, {
                                color: "#000000"
                            }).setOrigin(0.5);
                            this.container.add(sum);
                            const newNode={
                                key,
                                container:this.container,
                                right:rightNode,
                                left:leftNode,
                                height,
                                leftLine: this.leftLine,
                                rightLine:this.rightLine
                            }

                            this.tester.push(key);
                            this.tree.push(newNode);
                            
                            this.offset=this.getOffset();

                            this.btns.pop().alpha=0;

                            for(let j=0;j<this.btns.length;j++){
                                this.tweens.add({
                                    targets:this.btns[j],
                                    x:this.offset*j+this.offset/2-btnWidth/2,
                                    duration:500
                                })
                            }

                            for(let j=0;j<this.tree.length;j++){
                                this.tweens.add({
                                    targets:this.tree[j].container,
                                    x:this.offset*j+this.offset/2,
                                    y:config.height-45-this.tree[j].height*70,
                                    duration:500,
                                    onComplete:()=>{
                                        if(j==this.tree.length-1){
                                            this.disX*=1.3;
                                            this.branchNeeded=true;
                                            this.pickedLeft=false;
                                            this.pickedRight=false;

                                            if(this.btns.length==1){
                                                this.btns.pop().alpha=0;
                                                this.phase2=new Huffman2({ctx:this}).startPhaseTwo();
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
            this.btns.push(btn);
        }

        (new MessageBox({ctx:this})).startTyping(window.guidance.huffman.guide1)
    }
    
    createBranch(){
        
        const node = this.add.rectangle(0, 0, 80, 30, 0xffffff).setOrigin(0.5);
        const rightNode = this.add.rectangle(this.disX, this.disY, 80, 30, 0xffffff).setOrigin(0.5);
        const leftNode = this.add.rectangle(-this.disX, this.disY, 80, 30, 0xffffff).setOrigin(0.5);
    
        const line = new Phaser.Geom.Line(node.x, node.height / 2, leftNode.x, leftNode.y - leftNode.height / 2);
        const line2 = new Phaser.Geom.Line(node.x, node.height / 2, rightNode.x, rightNode.y - rightNode.height / 2);
    
        this.leftLine=[node.x, node.height / 2, leftNode.x, leftNode.y - leftNode.height / 2];
        this.rightLine=[node.x, node.height / 2, rightNode.x, rightNode.y - rightNode.height / 2];
        // Render the line on the scene
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x000000); // Set line style
        graphics.strokeLineShape(line);
        graphics.strokeLineShape(line2);
    
        const container = this.add.container(config.width / 2, 20);
        container.add(node);
        container.add(leftNode);
        container.add(rightNode);
        container.add(graphics);

        return container;
    }
    update(){
        this.countdown.update();
        if(this.branchNeeded && this.tree.length>1){
            this.branchNeeded=false;
            this.container=this.createBranch();
        }
    }
}
