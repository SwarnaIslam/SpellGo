class Rewind{
    constructor(con){
        this.ctx=con.ctx;
        this.totalLives=Math.max(Math.ceil(this.ctx.steps*18/100),3)||3;
        this.remainingLives=this.totalLives;
        this.livesGroup = this.ctx.add.group();
        this.scale=con.scale||0.3;
        this.callback=con.callback;
        const livesWidth=128*this.scale*this.remainingLives;
        const liveWidth=128*this.scale;

        for(let i=0;i<this.remainingLives;i++){
            let life = this.livesGroup.create(config.width-livesWidth+i*liveWidth-10, 10, 'lives');
            life.setScale(this.scale);
            life.setOrigin(0,0)
        }
    }
    reduceLive(){
        if(this.remainingLives>0){
            this.livesGroup.children.entries[this.remainingLives-1].play("ReduceLive");
            this.remainingLives--;
            return true;
        }
        else if(this.callback){
            this.callback();
        }
        return false;
    }

}