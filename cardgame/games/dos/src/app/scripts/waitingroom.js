const appContainer = document.getElementsByClassName('app-container')[0]
const waitingRoomButton = document.getElementById('waitingRoomButton')
const loading = document.getElementById('loading')
const waitingRoom = document.getElementById('waitingRoom').querySelector('.card-body')
const db = new Db()
let people = []
db.read('/cardgame/people',snapshot=>{
    swapView(loading,appContainer)
    let data = snapshot.val()
    for (let i in data) {
        people.push(data[i])
    }
    for (let i in people) {
        
    waitingRoom.innerHTML+=`
        <div onclick="setUser('${people[i].name}')" class="card-body py-2">${people[i].name}</div>
    `
}
})
waitingRoomButton.addEventListener("click",e=>{
    setTimeout(e=>{
        window.location.href = "./play.html"
    },500)
})
function setUser(name) {
    localStorage.setItem("user",name)
}

function swapView(item1,item2) {
    item1.classList.remove("d-flex")
    item1.classList.add("d-none")
    item2.classList.remove("d-none")
    item2.classList.add("d-flex")
}