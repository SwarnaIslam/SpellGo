class Reward{
    constructor(config){
        this.ctx=config.ctx;
        this.maxScore=config.maxScore;
        this.totalScore=this.getScore();
    }

    
    getScore(){
        const totalTime=this.ctx.countdown.duration;
        const totalLives=this.ctx.rewind.totalLives;
        const remainingLives=this.ctx.rewind.remainingLives;
        const remainingTime=this.ctx.countdown.remainingTime;

        const timeEfficiency=remainingTime/totalTime;
        const livesEfficiency=remainingLives/totalLives;

        const scoreEfficiency=(timeEfficiency*0.6)+(livesEfficiency*0.4);
        const totalScore=Math.ceil(scoreEfficiency*this.maxScore);
        
        return totalScore;
    }
}