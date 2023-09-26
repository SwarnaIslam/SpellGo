class MessageBox {
  constructor(con) {
    const x=con.x||0;
    const y=con.y||config.height*0.78;
    const width=con.width||config.width;
    const height=con.height||config.height*0.22;

    this.ctx = con.ctx;
    this.messageDisplayed = false;
    this.text = '';

    this.messageBox = this.ctx.add.container(x, y);

    if(!con.transparent){
      const graphics = this.ctx.add.graphics();
      graphics.fillStyle(0xf1c27d, 1);
      graphics.fillRoundedRect(0, 0, width, height, 20);

      this.messageBox.add(graphics);

      this.image = this.ctx.add.image(10, 10, "wizard");
      this.image.setDisplaySize(height - 20, height - 20);
      this.image.setOrigin(0, 0);

      this.messageBox.add(this.image, 0, 0);
    }
    this.messageBox.visible = true;

    this.messageText = this.ctx.add.text(height, 22, '', {
      fontFamily: con.fontFamily||'CustomFont',
      fontSize: con.fontSize||20,
      color: con.fontColor||'#000000',
      wordWrap: {
        width: width - 150 
      }
    });
    this.messageText.setLineSpacing(10);
    this.messageText.setOrigin(0, 0);

    this.messageBox.add(this.messageText, 0, 0);

    this.ctx.input.keyboard.on('keydown-ENTER', () => {
      this.messageDisplayed = true;
    })
  }

  startTyping(message) {
    if(this.ctx.countdown){
      this.ctx.countdown.pause();
    }
    this.message = message;
    this.ctx.input.enabled=false;
    let line = [];

    for (let i = 0; i < this.message.length; i++) {

      let text = this.message[i].text;
      let delay = this.message[i].speed;
      text.split('').forEach(character => {
        if (character === ' ') {
          line.push({ character: ' ', delay: 0 });
        }
        else {
          line.push({ character, delay })
        }
      });
      if (i < this.message.length - 1) {
        line.push({ character: ' ', delay: 0 });
      }

    }
    return new Promise(resolve => {
      this.revealText(line, resolve);
    })

  }
  revealText(line, resolve) {
    let next = line.splice(0, 1)[0];
    this.text += next.character;
    
    this.messageText.setText(this.text);
    if (line.length === 0 || this.messageDisplayed) {
      for (let i = 0; i < line.length; i++)this.text += line[i].character;
      this.messageText.setText(this.text);
      if(this.ctx.countdown){
        this.ctx.countdown.resume();
      }
      this.ctx.input.keyboard.on("keydown", this.removeMessageBox.bind(this, resolve));
    }
    else {
      setTimeout(() => { this.revealText(line, resolve) }, next.delay);
    }
  }
  removeMessageBox(resolve, event) {
    if (event.code == "Enter") {
      this.messageBox.destroy();
      this.ctx.input.keyboard.off("keydown", this.removeMessageBox, this);
      this.ctx.input.enabled=true;
      resolve();
    }
  }
}
