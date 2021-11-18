class Game {
    constructor() {
        this.status = "";
        this.currentPlayer = undefined;
        this.players = [];
        this.turn;
        this.mainPack = new Pack()
        this.origPack = new Pack()
        this.playersPacks = []
        for (let i=0;i<4;i++) {
            this.playersPacks.push(new Pack())  
        }
        this.floor = new Pack()
        this.rules = {
            startingPlayerCards: 8
            , floorCards: 1
        }
        this.view = new View(this)
        this.changesCounts = {
            turn:true,
            status:true
        }
    }

    onTurn() {        
        db.on("/cardgame/turn",snapshot=>{
            this.turnChanged(snapshot)
        })
    }

    onStatus() {        
        db.on("/cardgame/game/status",snapshot=>{
            this.statusChanged(snapshot)
        })
    }

    turnChanged(e) {
        //esegue l'azione saltando il primo controllo di default
        if (this.changesCounts.turn) { this.changesCounts.turn=false}
        else {            
            console.log("turn changed",  e.val())
        }
    }

 

    statusChanged(e) {
        //esegue l'azione saltando il primo controllo di default
        if (this.changesCounts.status) { this.changesCounts.status=false}
        else {            
            console.log("status changed", e.val())
        }
    }

    start() {
                    //il mazzo viene creato fisicamente, mischiato
                    this.mainPack.generate()                    
                    //this.mainPack.shuffle()
                    //...e graficamente nel limbo
                        this.view.dropareas[2].update(
                            this.mainPack.cards
                            , 'generate'
                        );                        
                        db.write(`/cardgame/pack/cards`,this.mainPack.cards)
                        
                        //da una copia del mazzo originale creiamo gli event listeners
                        this.origPack.giveCards(this.mainPack.cards)
                        this.view.generateListeners(this.origPack.cards);

                        //dal mazzo vengono distribuite le carte ai giocatori 
                        for (let i in this.players) {
                            this.mainPack.transferCardsTo(
                                this.rules.startingPlayerCards
                                ,this.playersPacks[i]
                            )                        
                            db.write(`/cardgame/people/${i}/cards`,this.playersPacks[i].cards)
                        }
                        //viene aggiornata l'area giocatore
                        this.view.dropareas[1].update(
                            this.playersPacks[0].cards
                        );  
                        //viene aggiornata l'area floor
                        this.mainPack.transferCardsTo(
                                this.rules.floorCards
                                ,this.floor
                            )   
                        this.view.dropareas[0].update(
                            this.floor.cards
                        );  

                        //viene switchata la view tra loading e ready
                        this.view.showApp();
                        this.status = "playing";
                        //turno al primo giocatore, lo status di gioco passa a playing
                        this.turn = this.players[0].name;
                        console.log("status",this.status)
                        console.log("tocca a",this.turn)
                  
                
    }

    play() {
        console.log("now playing")
    }

    root() {           
        db.read("/cardgame/game/status",snapshot=>{
            this.status = snapshot.val()
            db.read("/cardgame/people",snapshot=>{
                this.players = snapshot.val()
                let current = this.players.filter(e=>{
                    if (e.name==localStorage.getItem("user")) {
                        return e
                    }
                })[0]
                this.currentPlayer = {
                    name: current.name
                    , role: current.role
                    , packId: 0
                }
                
                if (this.status=='starting' && this.currentPlayer.role=='admin') {
                    
                    /*                                   */
                    this.start() 
                    /*                                   */

                } else if (this.status=='playing') {
                     
                    /*                                   */
                    this.play() 
                    /*                                   */

                } else {
                    console.log("error if else")
                }
            })
            })    
        //inizia una nuova partita
        //prima mano
        //  carte ai giocatori
        //  carte a terra
        //primo turno
        //  attesa giocatore
        //  turno successivo
        
    }
    
}
