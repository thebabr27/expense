

const appContainer = document.getElementsByClassName('app-container')[0]
const loading = document.getElementById('loading')
const turn = document.getElementById("turn")
const droparea = document.getElementById('droparea')
const db = new Db()
const game = new Game()
let people = []
console.log("entered as ",localStorage.getItem("user"))

game.onTurn();
game.onStatus();
game.root()













function swapView(item1,item2) {
    item1.classList.remove("d-flex")
    item1.classList.add("d-none")
    item2.classList.remove("d-none")
    item2.classList.add("d-flex")
}