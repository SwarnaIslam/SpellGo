class CountdownController {

	constructor(config) {
		this.ctx = config.ctx
		this.duration = config.duration
		this.callback = config.callback||=()=>{}
		this.remainingTime=this.duration;
		this.fontColor=config.fontColor||'#ffffff';
	}

	start() {
		this.stop()
		this.label = this.ctx.add.text(10, 10, "" + this.duration, {
            fontFamily:"CustomFont",
			color:this.fontColor,
            fontSize:20
        });

		this.timerEvent = this.ctx.time.addEvent({
			delay: this.duration,
			callback: () => {
				this.label.text = '0'
				this.callback();
			},
			onComplete: this.stop
		})
	}
	pause(){
		this.timerEvent.paused=true;
	}
	resume(){
		this.timerEvent.paused=false;
	}
	stop() {
		if (this.timerEvent) {
			this.timerEvent.remove()
			this.timerEvent = undefined
		}
	}

	update() {
		if (!this.timerEvent || this.duration <= 0) {
			return
		}

		const elapsed = this.timerEvent.getElapsed();
		this.remainingTime = this.duration - elapsed;

		const minutes = Math.floor(this.remainingTime / 60000);
		const seconds = Math.floor((this.remainingTime % 60000) / 1000);

		const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		this.label.text = "Time " + formattedTime;
	}
}