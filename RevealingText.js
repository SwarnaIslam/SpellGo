class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0,1)[0];
    next.span.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list)
      }, next.delayAfter)
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span").forEach(s => {
      s.classList.add("revealed");
    })
  }

  init() {
    let characters = [];

    for(let i=0;i<this.text.length;i++){
      this.text[i]["string"].split("").forEach(character => {

        //Create each span, add to element in DOM
        let span = document.createElement("span");
        span.textContent = character;
        this.element.appendChild(span);
  
        //Add this span to our internal state Array
        characters.push({
          span,
          delayAfter: character === " " ? 0 : this.text[i]["speed"]       
        })
      })
    }

    this.revealOneCharacter(characters);

  }

}