

const db = new Db()
db.init()
let pack;
db.read("cardgame/pack").then(
    snapshot=>{
        pack=new Pack(snapshot.val());
    }
)
db.read("cardgame/current").then(
    snapshot=>{
        if(snapshot.exists()) {
            console.log(snapshot.val())
        } else {
            console.log("no data")
            const game = new Game(pack)                
            game.create()
            console.log(
                pack.pickByName(4,'red')
            )
        }
    })



//per riprenderla si carica il mazzo, le carte dei giocatori e le carte a terra
//aggiornando cosi il mazzo

//si carica il turno corrente


