class Dijkstra extends Phaser.Scene{
    constructor(){
        super("dijkstra");
        this.map=[
            {
                parentCity:-1,
                name:"Enchantia",
                cost:0,
                state:"undefeated",
                adjacent:[1,2],
                bannerPos:[13,26]
            },
            {
                parentCity:-1,
                name:"Waverly",
                cost:Number.MAX_VALUE,
                state:"undefeated",
                adjacent:[0,3,4],
                bannerPos:[25,7]
            },
            {
                parentCity:-1,
                name:"SpellHaven",
                cost:Number.MAX_VALUE,
                state:"undefeated",
                adjacent:[0,3,5],
                bannerPos:[33,38]
            },
            {
                parentCity:-1,
                name:"Arcanum",
                cost:Number.MAX_VALUE,
                state:"undefeated",
                adjacent:[1,2,4],
                bannerPos:[35,22]
            },
            {
                parentCity:-1,
                name:"Charmvile",
                cost:Number.MAX_VALUE,
                state:"undefeated",
                adjacent:[1,3,5],
                bannerPos:[57,7]
            },
            {
                parentCity:-1,
                name:"Mystic Vale",
                cost:Number.MAX_VALUE,
                state:"undefeated",
                adjacent:[2,4],
                bannerPos:[56,33]
            },
        ];
        this.costs=[0];
        this.cutScenePlaying=false;

        this.bridgeMap={
            "0,1":{
                cost:2,
                bridgePos:[14,18],
                state:"vertical",
                wizPos:[17,20]
            },
            "0,2":{
                cost:4,
                bridgePos:[14,40],
                state:"horizontal",
                wizPos:[17,41]
            },
            "1,3":{
                cost:6,
                bridgePos:[34,14],
                state:"vertical",
                wizPos:[37,16]
            },
            "1,4":{
                cost:1,
                bridgePos:[42,9],
                state:"horizontal",
                wizPos:[45,10]
            },
            "3,4":{
                cost:1,
                bridgePos:[45,22],
                state:"horizontal",
                wizPos:[48,23]
            },
            "2,3":{
                cost:3,
                bridgePos:[37,31],
                state:"vertical",
                wizPos:[40,34]
            },
            "2,5":{
                cost:5,
                bridgePos:[42,37],
                state:"horizontal",
                wizPos:[45,38]
            },
            "4,5":{
                cost:4,
                bridgePos:[54,25],
                state:"vertical",
                wizPos:[57,27]
            }
        }
        this.sourceVillage=0;
        this.steps=22;
        this.adjacentChosen=false;
        this.cityDefeated=0;
    }
    
    createMap(){
        this.background=this.add.image(0,0,"village_map");
        this.background.setOrigin(0,0);

        this.widthRatio=config.width/this.background.width;
        this.heightRatio=config.height/this.background.height;
        
        this.background.setScale(this.widthRatio,this.heightRatio);
        this.add.sprite(this.widthRatio*26*16,this.heightRatio*11*16,"fountain").play("fountain");
    }
    createWizards(){

        for(let i in this.bridgeMap){
            let shouldMirror=Math.floor(Math.random()*2);
            let wizX=this.bridgeMap[i].wizPos[0];
            let wizY=this.bridgeMap[i].wizPos[1];
            let wizard;
            if(shouldMirror==0){
                wizard=this.add.sprite(this.widthRatio*wizX*16,this.heightRatio*wizY*16,"badWizardAttack");
            }
            else{
                wizard=this.add.sprite(this.widthRatio*(wizX-2) *16,this.heightRatio*wizY*16,"badWizardAttack");
                wizard.flipX=true;
            }
            
            wizard.play("badWizardAttack");

            this.bridgeMap[i].wizard=wizard;

            const bar=this.add.sprite(wizard.x,this.heightRatio*(wizY-4)*16,"wizardPointBar");

            bar.setScale(0.3,0.3);
            // bar.visible=false;
            const text = this.add.text(wizard.x-35,wizard.y-40, " Wizard Point: "+this.bridgeMap[i].cost, {
                font: '9px CustomFont',
                fill: '#000000',
                align: 'center',
                resolution:2
            });

            const barGroup=this.add.group();
            barGroup.add(bar);
            barGroup.add(text);
            barGroup.setVisible(false);

            this.bridgeMap[i].bar=barGroup;
        }
    } 
    async checkMin(i){
        if(this.map[i].state==="defeated"){
            await (new MessageBox({ctx:this})).startTyping(window.hints.dijkstra.minErr);
            this.rewind.reduceLive();
            return false;
        }
        let minimumCost=Math.min(...this.costs);

        if(this.map[i].cost>minimumCost){
            await (new MessageBox({ctx:this})).startTyping(window.hints.dijkstra.naErr);
            this.rewind.reduceLive();
            return false;
        }
        return true;
    }
    getBridgeInfo(sourceVillage,destinationVillage){
        let name=Math.min(sourceVillage,destinationVillage) +","+Math.max(sourceVillage,destinationVillage);

        const destinationCost=this.map[destinationVillage].cost;
        const sourceCost=this.map[sourceVillage].cost;
        const bridgeCost=this.bridgeMap[name].cost;

        return {name,destinationCost,sourceCost,bridgeCost}
    }
    async updateBtnAction(destinationVillage){

        let key=this.getBridgeInfo(this.sourceVillage,destinationVillage);

        if(key.destinationCost>key.sourceCost+key.bridgeCost){
            const prevParent=this.map[destinationVillage].parentCity;
            
            this.map[destinationVillage].cost=key.sourceCost+key.bridgeCost;
            this.map[destinationVillage].parentCity=this.sourceVillage;

            this.costs.push(this.map[destinationVillage].cost);

            this.map[destinationVillage].banner.getChildren()[1].setText(this.map[destinationVillage].name+" "+this.map[destinationVillage].cost);

            const upBridge=this.bridgeMap[key.name].bridge.texture.key.replace("selected","selectedVisited");
            this.bridgeMap[key.name].bridge.setTexture(upBridge);

            if(prevParent!=-1){
                const prevBridge=this.getBridgeInfo(prevParent,destinationVillage);

                const removeBridge=this.bridgeMap[prevBridge.name].bridge.texture.key.replace("Visited","");

                this.bridgeMap[prevBridge.name].bridge.setTexture(removeBridge);

            }
        }
        else{
            await (new MessageBox({ctx:this})).startTyping([{text:"You will have to spend much wizard point then before if you go through city "+this.map[this.sourceVillage].name+" to city "+this.map[destinationVillage].name+"!",speed:window.speeds.fast}]);
            this.rewind.reduceLive();
            return;
        }
        this.operationDone(destinationVillage,key);

    }
    async ignoreBtnAction(destinationVillage){
        let key=this.getBridgeInfo(this.sourceVillage,destinationVillage);

        if(key.destinationCost>key.sourceCost+key.bridgeCost){
            await (new MessageBox({ctx:this})).startTyping([{text:"You will have to spend less wizard point then before if you go through the city "+this.map[this.sourceVillage].name+" to the city "+this.map[destinationVillage].name+"!",speed:window.speeds.fast}]);
            this.rewind.reduceLive();
            return;
        }
        this.operationDone(destinationVillage,key);
    }
    operationDone(destinationVillage,key){
        this.map[destinationVillage].updateBtn.visible=false;
        this.map[destinationVillage].ignoreBtn.visible=false;
        this.bridgeMap[key.name].bar.setVisible(false);

        this.map[this.sourceVillage].adjTracked++;

        if(this.map[this.sourceVillage].adjTracked==this.map[this.sourceVillage].adjacent.length){
            this.map[this.sourceVillage].state="defeated";
            this.map[this.sourceVillage].banner.getChildren()[0].setTint(0x00FFFF);
            this.map[this.sourceVillage].banner.getChildren()[0].alpha=1;

            const srcParent=this.map[this.sourceVillage].parentCity;
            if(srcParent!=-1){
                const confirmedBridge=this.getBridgeInfo(srcParent,this.sourceVillage);
                this.bridgeMap[confirmedBridge.name].wizard.setTexture("badWizardDead");
                this.bridgeMap[confirmedBridge.name].wizard.play("badWizardDead");

                this.bridgeMap[confirmedBridge.name].bar.setVisible(true);
                this.bridgeMap[confirmedBridge.name].bar.getChildren()[0].play("wizardPointBar");

                this.bridgeMap[confirmedBridge.name].bar.getChildren()[0].on('animationcomplete', () => {
                    this.bridgeMap[confirmedBridge.name].bar.setVisible(false);
                });
            }

            const ind=this.costs.indexOf(this.map[this.sourceVillage].cost);
            if(ind!=-1){
                this.costs.splice(ind,1);
            }

            this.map[this.sourceVillage].adjTracked=0;
            this.setDefault();
            this.cityDefeated++;
            this.cutScenePlaying=false;
        }
    }
    defineAdjacentResponsibility(villageNo,x,y){
        let updateBtn=this.createButtons(x,y,"Update");
        let ignoreBtn=this.createButtons(x+65,y,"Ignore");
        updateBtn.visible=false;
        ignoreBtn.visible=false;

        updateBtn.getByName("btn").on("pointerdown",this.updateBtnAction.bind(this,villageNo));
        ignoreBtn.getByName("btn").on("pointerdown",this.ignoreBtnAction.bind(this,villageNo));
        this.map[villageNo].updateBtn=updateBtn;
        this.map[villageNo].ignoreBtn=ignoreBtn;
    }
    async defineResposibility(villageNo){
        if(!this.adjacentChosen){
            this.adjacentChosen=true;
            (new MessageBox({ctx:this})).startTyping(window.guidance.dijkstra.minAdj)
        }
        if(this.cutScenePlaying){
            return;
        }
        this.cutScenePlaying=true;
        const flag=await this.checkMin(villageNo);
        if(!flag){
            this.cutScenePlaying=false;
            return;
        }

        this.map[villageNo].banner.getChildren()[0].setTexture("selectedVillage");
        this.map[villageNo].banner.getChildren()[0].setTint(0xffffff);

        this.map[villageNo].banner.getChildren()[0].alpha=0.5;
        this.sourceVillage=villageNo;
        for(let j=0;j<this.map[villageNo].adjacent.length;j++){

            let adjVillageNo=this.map[villageNo].adjacent[j];
            let adjVillage=this.map[adjVillageNo].banner.getChildren()[0];

            if(this.map[adjVillageNo].state=="undefeated"){
                adjVillage.setTint(0xffffff);
                adjVillage.alpha=0.5;
                adjVillage.setTexture("selectedVillage");
            }

            const bridgeNo=this.getBridgeInfo(villageNo,adjVillageNo).name;
            const texture="selected"+this.bridgeMap[bridgeNo].bridge.texture.key;
            this.bridgeMap[bridgeNo].bridge.setTexture(texture);
            this.bridgeMap[bridgeNo].bar.setVisible(true);


            this.map[adjVillageNo].updateBtn.visible=true;
            this.map[adjVillageNo].ignoreBtn.visible=true;
        }
    }
    setDefault(){
        if(this.map[this.sourceVillage].state=="undefeated"){
            this.map[this.sourceVillage].banner.getChildren()[0].setTint(0x000000);
            this.map[this.sourceVillage].banner.getChildren()[0].alpha=0.3;
        }


        for(let i=0;i<this.map[this.sourceVillage].adjacent.length;i++){
            let j=this.map[this.sourceVillage].adjacent[i];

            if(this.map[j].state=="undefeated"){
                this.map[j].banner.getChildren()[0].setTint(0x000000);
                this.map[j].banner.getChildren()[0].alpha=0.3;
            }
            const bridgeNo=Math.min(this.sourceVillage,j) +","+Math.max(this.sourceVillage,j);
            const defaultBridge=this.bridgeMap[bridgeNo].bridge.texture.key.replace("selected","");
            this.bridgeMap[bridgeNo].bridge.setTexture(defaultBridge);

        }
    }
    createBanners(){
        for(let i=0;i<this.map.length;i++){
            let bannerX=this.map[i].bannerPos[0];
            let bannerY=this.map[i].bannerPos[1];
            let banner=this.add.image(this.widthRatio*bannerX*16,this.heightRatio*bannerY*16,'unselectedVillage');
            banner.setScale(0.3,0.4);
            
            banner.setTint(0x000000);
            banner.alpha = 0.3;

            banner.setInteractive();
            this.defineAdjacentResponsibility(i,banner.x-30, banner.y+banner.height*0.4);
            banner.on("pointerdown",this.defineResposibility.bind(this,i));

            const text = this.add.text(this.widthRatio*bannerX*16,this.heightRatio*bannerY*16 , this.map[i].name+" "+(this.map[i].cost==Number.MAX_VALUE?"inf":this.map[i].cost), {
                font: '13px CustomFont',
                fill: '#ffffff',
                align: 'center'
            });
            text.setOrigin(0.5, 1);

            const bannerGroup=this.add.group();
            bannerGroup.add(banner);
            bannerGroup.add(text);

            this.map[i].banner=bannerGroup;
            this.map[i].adjTracked=0;
        }
    }
    createBridges(){
        for(let bridgeKey in this.bridgeMap){
            let bridgeX=this.bridgeMap[bridgeKey].bridgePos[0];
            let bridgeY=this.bridgeMap[bridgeKey].bridgePos[1];
            let state=this.bridgeMap[bridgeKey].state;

            let bridge=this.add.image(this.widthRatio* bridgeX*16,this.heightRatio*16* bridgeY,(state=="vertical"?"VerticalBridge":"HorizontalBridge")) 
            bridge.setScale(this.widthRatio,this.heightRatio);
            bridge.setOrigin(0,0);

            this.bridgeMap[bridgeKey].bridge=bridge;
        }
    }
    createButtons(x, y, btnName) {
        const btnContainer=this.add.container(x,y);
        const btnBg=this.add.rectangle(0,0,60,30,0xC3DC56,0.5)
        const mask=this.add.rectangle(0,0,60,30,0xC3DC56,0).setName("btn")
        const text = this.add.text(0, 0, btnName, {
            font: '15px CustomFont',
            fill: '#ffffff',
            align: 'center'
        });
        text.setOrigin(0.5, 0.5); 

        btnContainer.add(btnBg);
        btnContainer.add(text);
        btnContainer.add(mask);
        
        btnContainer.visible=true;
        mask.setInteractive();
        return btnContainer;
    }
    create(){

        this.createMap();
        
        this.createBridges();
        this.createWizards();
        this.createBanners();
        (new MessageBox({ ctx: this })).startTyping(window.guidance.dijkstra.minSrc);

        this.countdown=new CountdownController({ctx:this,duration:75000,callback: () => {
            this.scene.start('game_over',{key:'dijkstra'});
        }});
        this.countdown.start();

        this.rewind=new Rewind({ctx:this,callback: () => {
                this.scene.start("game_over")
            }
        });
        this.event=new UserEventHandler({ctx:this, fontSize:"15px"})
        this.event.init();

        (new MessageBox({ctx:this})).startTyping(window.guidance.dijkstra.minSrc);
        
    }
    update(){
        if(this.cityDefeated==this.map.length){
            this.scene.pause();
            // pause the timer, player won!!!!!!
            this.reward = new Reward({ ctx: this, maxScore: 3000 });
            this.scene.start("gameSucceed", {
                reward: this.reward,
                todo: [
                    { text: "NEXT TASK: ", speed: window.speeds.slow },
                    { text: "MergeSort", speed: window.speeds.normal },
                    { text: "...", speed: window.speeds.slow }
                ],
                key:"dijkstra"
            })            
        }
        this.countdown.update();
    }
}