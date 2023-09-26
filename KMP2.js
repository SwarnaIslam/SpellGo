class KMP2{
    constructor(con){
        this.ctx=con.ctx;
        this.i=0;
        this.j=0;
        this.patternLen=this.ctx.pt.length;
        this.num=0;
        this.matchingDone=false;
    }
    createText(){
        this.text=["Yellow", "Yellow","Orange","Yellow","Yellow", "Yellow","Lime","Yellow", "Yellow","Orange","Yellow","Yellow", "Yellow","Orange"];
        this.offset=50;
        const graphics=this.ctx.add.graphics();
        graphics.fillStyle(0x008483); // Fill color
        graphics.fillRect(-this.ctx.lpsBar.x+this.patternLen*100, config.height/2-240, 100, 150);

        this.numText=this.ctx.add.text(config.width/2,20,"0",{
            fontFamily:"PressStart",
            fontSize:"30px",
            color:'#000000'
        }).setOrigin(0.5);
        this.ctx.lpsBar.add(graphics);

        this.textContainer=this.ctx.add.container(0,0);
        for(let i=0;i<this.text.length;i++){
            const x=i*100+this.offset;
            const y=config.height/2-100;
            const slime=this.ctx.add.sprite(x,y,"slime"+this.text[i]);
            slime.setOrigin(0.5);
            const frameNo=Math.floor(Math.random()*6);
            const frameSequence=[];

            for(let j=0;j<6;j++){
                frameSequence.push((frameNo+j)%6);
            }

            const l= this.ctx.add.text(x,config.height/2-140, i, {
                font: '20px PressStart',
                fill: '#000000',
                align: 'center'
            }).setOrigin(0.5);

            this.ctx.anims.create({
                key:"slime"+this.text[i]+i,

                frames: this.ctx.anims.generateFrameNumbers("slime"+this.text[i],{frames:frameSequence}),
                frameRate: 5,
                repeat: -1
            });
            slime.play("slime"+this.text[i]+i);
            this.textContainer.add(slime);
            this.textContainer.add(l);
        }
    }
    createButtons(){
        this.btnContainer=this.ctx.add.container(-this.ctx.offset+50,config.height/2);
        for(let i=0;i<this.patternLen;i++){
            const btn=new Button({ctx:this.ctx,x:105*i+this.ctx.offset2-55,y:config.height/2-90,btnName:"Set", width:105,height:40}).createButtons();

            btn.getByName("btn").on("pointerdown",()=>{
                const pre=this.getPrevious();
                const prevJ=this.j;
                console.log(prevJ+" "+i+" "+this.j);

                if(i!=pre){
                    (new MessageBox({ctx:this.ctx,fontSize:15})).startTyping(window.hints.kmp.hint4);
                    return;
                }

                if(this.j==this.patternLen && pre==i){
                    this.j=i;
                    this.ctx.tweens.add({
                        targets:this.textContainer,
                        x:this.textContainer.x-(prevJ-this.j)*100,
                        duration:500,
                        ease:"liner"
                    })
                    this.ctx.tweens.add({
                        targets:this.match,
                        x:this.match.x-(prevJ-this.j)*100,
                        duration:500,
                        ease:"liner"
                    })
                }
                if(i==pre && this.ctx.pt[i]!=this.text[this.i] && this.j>0){
                    this.j=i;

                    this.ctx.tweens.add({
                        targets:this.textContainer,
                        x:this.textContainer.x-(prevJ-this.j)*100,
                        duration:500,
                        ease:"liner"
                    })
                    this.ctx.tweens.add({
                        targets:this.match,
                        x:this.match.x-(prevJ-this.j)*100,
                        duration:500,
                        ease:"liner"
                    })
                }
            });
            this.btnContainer.add(btn);
        }
        const btn=new Button({ctx:this.ctx,x:105*this.patternLen+this.ctx.offset2-55,y:config.height/2-90,btnName:"Reset", width:105,height:40}).createButtons();
        btn.getByName("btn").on("pointerdown",()=>{
            if(this.j==0){
                this.ctx.tweens.add({
                    targets:this.textContainer,
                    x:this.textContainer.x-100,
                    duration:500,
                    ease:"liner",
                    onComplete:()=>{
                        this.btnContainer.visible=false;
                        this.prevBtn.visible=true;

                    }
                })
                this.i++;
                if(this.i==this.text.length){
                    this.reward = new Reward({ ctx: this.ctx, maxScore: 1000 });
                        this.ctx.scene.start("gameSucceed", {
                            reward: this.reward,
                            todo: [
                                { text: "You have done very well!", speed: window.speeds.normal }
                            ]
                    })
                }
            }
        });
        this.btnContainer.add(btn);

        this.btnContainer.visible=false;
    }
    startPhaseTwo(){
        this.createText();
        this.createButtons();
        
        this.match=this.ctx.add.image(0,config.height/2-170,"blueLid").setOrigin(0);
        this.match.displayHeight=200;
        const btnWidth=400;
        const btnX=config.width/2-btnWidth/2;
        const btnY=config.height-60;

        this.prevBtn=(new Button({ctx:this.ctx,x:btnX,y:btnY, btnName:"MisMatch"})).createButtons();

        this.forwardBtn=(new Button({ctx:this.ctx,x:btnX+btnWidth/2,y:btnY, btnName:"Match"})).createButtons();

        (new MessageBox({ctx:this.ctx, fontSize:15})).startTyping(window.guidance.kmp.guide4);
        this.forwardBtn.getByName("btn").on("pointerdown",()=>{
            if(this.ctx.pt[this.j]==this.text[this.i]){
                this.ctx.tweens.add({
                    targets:this.match,
                    x:100*(this.j+1),
                    duration:500,
                    onComplete:()=>{
                        console.log(this.ctx.pt[this.j]+" "+this.text[this.i]);
                        this.i++;
                        this.j++;
                        if(this.i==this.text.length){
                            this.matchingDone=true;
                            this.reward = new Reward({ ctx: this.ctx, maxScore: 1000 });
                            this.ctx.scene.start("gameSucceed", {
                                    reward: this.reward,
                                    todo: [
                                        { text: "You have done very well!", speed: window.speeds.normal }
                                    ],
                                    key:"kmp"
                            })
                        }
                        else if(this.j==this.patternLen){
                            if(!this.matchingDone){
                                this.matchingDone=true;
                                (new MessageBox({ctx:this.ctx,fontSize:15})).startTyping(window.guidance.kmp.guide5);
                            }
                            this.prevBtn.visible=false;
                            this.btnContainer.visible=true;
                            this.num++;
                            this.numText.setText(this.num)
                        }
                    }
                })
            }
            else{
                (new MessageBox({ctx:this.ctx,fontSize:15})).startTyping(window.hints.kmp.hint6);
            }
            
        })

        this.prevBtn.getByName("btn").on("pointerdown",()=>{
            if(this.text[this.i]==this.ctx.pt[this.j]){
                (new MessageBox({ctx:this.ctx,fontSize:15})).startTyping(window.hints.kmp.hint5);
                return;
            }
            this.btnContainer.visible=true;
            this.prevBtn.visible=false;
        });
    }
    getPrevious(){
        return parseInt( this.ctx.lps.getChildren()[this.j-1].text);
    }
    
}