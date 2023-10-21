class BubbleSortController {
    constructor(ctx) {
        
        this.live= 3
        this.cutScenePlaying = true;
        this.ctx = ctx;
        this.errMessage="";
        this.swapDone=false;
        this.skipDone=false;
    }

    perform(callback) {
        this.cutScenePlaying = true;
        callback();
    }
    swapping(){
        this.swap();
        if(this.isSwapRight()){
            this.switching();
        }
    }
    swap() {
        return new Promise(resolve=>{
            let rect1 = this.ctx.stairs[this.ctx.currentLight];
            let rect2 = this.ctx.stairs[this.ctx.currentLight + 1];
            [this.ctx.stairs[this.ctx.currentLight], this.ctx.stairs[this.ctx.currentLight + 1]] = [this.ctx.stairs[this.ctx.currentLight + 1], this.ctx.stairs[this.ctx.currentLight]];
            let x1 = rect1.x;
            let x2 = rect2.x;
            this.hasSwapped=true;
            this.ctx.tweens.add({
                targets: rect2,
                x: x1,
                ease: "Linear",
                duration: 1000
            });
            this.ctx.tweens.add({
                targets: rect1,
                x: x2,
                ease: "Linear",
                duration: 1000,
                onComplete: () => {
                    resolve();
                }
            });
        })
    }
    switching() {
        if (!this.isSkipRight()) {
            return;
        }
        const prevLight = this.ctx.currentLight;
        this.ctx.light[prevLight].setTexture("lightOff");

        if (this.ctx.numberOfLights == 1) {
            this.ctx.scene.pause();
            // pause the timer, player won!!!!!!
            this.reward=new Reward({ctx:this.ctx,maxScore:1000});
            console.log(this.ctx.levelName)
            this.ctx.scene.start("gameSucceed",{
                    reward:this.reward,
                    todo:[
                        {text:"NEXT TASK: ", speed:window.speeds.slow},
                        {text:"Find the potion book in the library",speed:window.speeds.normal},
                        {text:"...",speed:window.speeds.slow},
                        {text:"See you until then!", speed:window.speeds.normal}
                    ],
                    key:"bubbleSort"
            })
            return;
        }

        this.ctx.currentLight = (prevLight + 1) % this.ctx.numberOfLights;
        this.ctx.light[this.ctx.currentLight].setTexture("lightOn");

        if (this.ctx.currentLight == 0)
            this.ctx.numberOfLights--;
        
        this.guiding();
    }

    getHeight(){
        const h1=this.ctx.stairs[this.ctx.currentLight].getAt(0).height;
        const h2=this.ctx.stairs[this.ctx.currentLight+1].getAt(0).height;

        return [h1,h2]
    }

    async guiding(){
        var [rect1H ,rect2H]=this.getHeight();

        if(rect1H>rect2H && !this.swapDone){
            this.swapDone=true;
            this.messageBox = new MessageBox({ctx:this.ctx});
            this.ctx.countdown.pause();
            await this.messageBox.startTyping(window.guidance.bubbleSort.swap);
            this.ctx.countdown.resume();
        }
        else if(rect1H<=rect2H && !this.skipDone){
            this.skipDone=true;
            this.messageBox = new MessageBox({ctx:this.ctx});
            await this.messageBox.startTyping(window.guidance.bubbleSort.skip);
        }
        this.cutScenePlaying=false;
    }
    
    isSkipRight(){
        var [rect1H ,rect2H]=this.getHeight();
        if(rect1H<=rect2H){
            return true;
        }
        else{
            this.errMessage=window.hints.bubbleSort.skipErr;
            this.skipRewind();
            return false;
        }
    }

    isSwapRight(){
        var [rect1H ,rect2H]=this.getHeight();
        if(rect1H<rect2H){
            this.switching();
            return true;
        }
        else{
            if(rect1H>rect2H)this.errMessage=window.hints.bubbleSort.swapErr;
            else this.errMessage=window.hints.bubbleSort.equalErr;
            this.swapRewind();
            return false;
        }
    }
    skipRewind(){
        this.rewind().then(()=>{this.cutScenePlaying=false})
    }
    swapRewind(){
        this.rewind().then(()=>{this.swap().then(()=>{this.cutScenePlaying=false})})
    }
    async rewind(){
        if(!this.ctx.rewind.reduceLive()){
            this.ctx.handleLevelCompletion();
        }
        let response = new MessageBox({ctx:this.ctx});
        await response.startTyping(this.errMessage);
    }
    
    
}