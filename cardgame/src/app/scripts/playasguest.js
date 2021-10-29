const navbar = document.getElementsByClassName("navbar")[0]
const date = new Date();
let pack = [];
let origPack = [];
let cards = [];
let turn;
let people = [];
let allowTouch=false;
let userIndex = -1;
let gameStatus;
var firebaseConfig = {
    apiKey: "AIzaSyAyPpwYB1X-e5VnUkUgJ2orPcDr9ybDHEU",
    authDomain: "draggable-9f92b.firebaseapp.com",
    databaseURL: "https://draggable-9f92b.firebaseio.com",
    projectId: "draggable-9f92b",
    storageBucket: "draggable-9f92b.appspot.com",
    messagingSenderId: "1010593277055",
    appId: "1:1010593277055:web:1b729dc7368b8f6f",
  };
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  const messages = document.getElementById("messages");
  const sendMsgButton = document.getElementById("sendMsgButton");
  const msgInput = document.getElementById("msgInput");
  const dropArea = document.getElementById("dropArea")
  const dropArea2 = document.getElementById("dropArea2")
  const pickCardButton = document.getElementById("pickCardButton")
  const nextTurnButton = document.getElementById("nextTurnButton")
  const unoButton = document.getElementById("unoButton")
  const startGameButton = document.getElementById("startGameButton")
  const uno = document.getElementById("uno!")
  let items=[];


gameRotation();


function removeSpinners() {
    if (dropArea.querySelectorAll(".spinner-border").length>0) {
        dropArea.querySelectorAll(".spinner-border")[0].remove()
    }
    if (dropArea2.querySelectorAll(".spinner-border").length>0) {
        dropArea2.querySelectorAll(".spinner-border")[0].remove()
    }
}
function gameRotation() {
    getOrigPack();
    getPack();
    getPeople();
    updateNavbar();
    onMessages();
    onCards();   
    getGameStatus();
}
function startGame() {
    /* generatePack() */
    pack = shufflePack()
    console.log(pack)
    for (let i in people) {
        sendCards(5,'cardgame/pack','cardgame/people/'+i+'/cards')
    }
    sendCards(1,'cardgame/pack','cardgame/game/cards')
    updateAreas(localStorage.getItem("user"))
}
function shufflePack() {    
    pack.sort(() => Math.random() - 0.5)
    return pack.sort(() => Math.random() - 0.5)
}
startGameButton.addEventListener("click",e=>{
    startGame()
})
msgInput.addEventListener("keyup",e=>{
    if (e.key=='Enter') {
        sendMsgButton.click()
    }
})
nextTurnButton.addEventListener("click",e=>{
    nextTurn(false)
})
pickCardButton.addEventListener("click",e=>{
    pickCards(1,'cardgame/people/'+userIndex+'/cards');
})
sendMsgButton.addEventListener("click",e=>{
      if (!items) {items=[]}
      items.push({
          author: localStorage.getItem("user")
          , text: msgInput.value
      })
      sendMessage(items)
      msgInput.value=""
})
unoButton.addEventListener("click",e=>{
    uno.classList.remove("d-none")
    setTimeout(e=>{
        uno.classList.add("d-none")
    },1000)
})
function getPeople() {
    firebase.database().ref('cardgame/people/').once('value').then(
        snapshot=>{
            try {
                people = snapshot.val()
                console.log(people)
            }
            catch(err) { console.log(err) }
        })
}
function setGameStatus() {
    firebase.database().ref("cardgame/game/status").set('playing')  
    gameStatus = 'playing'
}
function getGameStatus() {
    firebase.database().ref("cardgame/game/status").once('value').then(function(snapshot) {
        try {
            if (snapshot.val()=='playing') {
                updateAreas(localStorage.getItem("user"))
            } else {
                console.log('game is starting')
            }
        }
        catch(err) {
    
        }
    })
}
function getPack() {
    firebase.database().ref("cardgame/pack/").once('value').then(function(snapshot) {
        try {
            pack = snapshot.val()      
        }
        catch(err) {
    
        }
    })
}
function getOrigPack() {
    firebase.database().ref("cardgame/game/pack/").once('value').then(function(snapshot) {
        try {
            origPack = snapshot.val()     
        }
        catch(err) {
    
        }
    })
}

function onMyCards() {
    firebase.database().ref('cardgame/people/').once('value').then(
        snapshot=>{
            try {
                let index = snapshot.val().findIndex(e=>{
                    if (e.name==userIndex) {
                        return e
                    }
                })
                userIndex=index;
                firebase.database().ref('cardgame/people/'+index+'/cards/').once('value').then(
                  snapshot=>{
                      try {
                        removeSpinners()
                          if (itsMyTurn()) {
                            console.log("my turn")
                          } else {
                              console.log("NOT my turn")
                              generateCards(snapshot.val(),dropArea2)
                          }
                          
                      }
                      catch(err) {
                  
                      }
                  })   
            }
            catch(err) {
          
            }
          })
    }
function onCards() {
    firebase.database().ref("cardgame/game/cards").on('value',snapshot=>{
        try {
            console.log("cards changed")
            dropArea.innerHTML=""
            firebase.database().ref("cardgame/game/cards").once('value').then(
              snapshot=>{
                  try {
                    removeSpinners()
                      if (dropArea.childNodes.length<1) {
                          cards = snapshot.val()
                          generateCards(snapshot.val(),dropArea)
                      }
                      if (itsMyTurn()) {
                        console.log("my turn")
                      } else {
                          console.log("NOT my turn")
                      }
                      
                  }
                  catch(err) {
              
                  }
              })   
        }
        catch(err) {
      
        }
      })
}
function onMessages() {
    firebase.database().ref("cardgame/messages").on('value',snapshot=>{
        updateMessages()
    }) 
}
function updateAreas(name) {
    firebase.database().ref('cardgame/people/').once('value').then(
            snapshot=>{
                try {
                    let index = snapshot.val().findIndex(e=>{
                        if (e.name==name) {
                            return e
                        }
                    })
                    userIndex=index;
                    firebase.database().ref('cardgame/people/'+index+'/cards/').once('value').then(
                        snapshot=>{
                            try {
                                    generateCards(snapshot.val(),dropArea2)                           
                            } 
                            catch(err) {
                    
                            }
                        }
                    )
                } 
                catch(err) {
        
                }
            }
        )
}     
function generateCards(cards,area) {
    let button;
    for (let i in cards) {
        button = document.createElement("button")
        button.setAttribute("draggable","true")
        if(area.id=='dropArea') {
            button.setAttribute("class","game-button position-absolute  btn p-0  rounded")
        } else {
            button.setAttribute("class","game-button position-relative  btn p-0 shadow rounded")
        }
        button.setAttribute("id",`card_${cards[i].id}`)
        button.setAttribute("style","margin-left:-30px")
        let html = "";
        html=`
            <div id="card_${cards[i].id}Slider" value="${cards[i].value}" style="z-index:1000" class="w-100 h-100 position-absolute"></div>     
            <div class="card game-card ${cards[i].icon} p-1">
            <div class="game-card-wrapper">
            <div class="game-card-header"><i></i></div>  
            <div class="game-card-body"><i></i></div>  
            <div class="game-card-footer"><i></i></div>
            </div>
        </div>   
        `
        button.innerHTML=html;
        area.appendChild(button)
        
        document.getElementById(`card_${cards[i].id}Slider`).addEventListener("touchmove",(e)=>{            
            if (allowTouch) {
                e.preventDefault()
                touched(e) }
        })
        document.getElementById(`card_${cards[i].id}Slider`).addEventListener("touchend",(e)=>{            
            if (allowTouch) {
                e.preventDefault()
                touchEnd(e) }
        })
    }
}
function highlightDropArea(area) {
    area.classList.add("shadow-lg")
    area.classList.add("border")
}
function hideItem(e) {
    let eid = e.target.id.replace("Slider","");
    document.getElementById(eid).classList.add("disabled")
}
function nextTurn(reverse) {
    let index = (people.findIndex(e=>{
        if (e.name==turn) {
        return e }
    }))
    if (!reverse) {
            index++;
            if (index>=people.length) { index = 0 }        
    } else {
        index--;
        if (index<=-1) { index = people.length }   
    }
    firebase.database().ref("cardgame/turn").set(
        people[index].name
    )  
}
function updateMessages() {
    firebase.database().ref("cardgame/messages").once('value').then(function(snapshot) {
        try {
            items = snapshot.val();
            let html=""; for (let i in items) {
                if (items[i].author==localStorage.getItem("user")) {
                    if (i>=items.length-1) {
                        html+=`<div class="w-100 d-flex text-light justify-content-end"><b>Tu:&nbsp;</b>${items[i].text}<br></div>`
                    } else {
                        html+=`<div class="w-100 d-flex justify-content-end"><b>Tu:&nbsp;</b>${items[i].text}<br></div>`
                    }
                } else {
                    if (i>=items.length-1) {
                        html+=`<div class="w-100 text-light "><b>${items[i].author}:&nbsp;</b>${items[i].text}<br></div>`
                    } else {
                        html+=`<div class="w-100"><b>${items[i].author}:&nbsp;</b>${items[i].text}<br></div>`
                    }
                }
            }
            messages.innerHTML = html;
            messages.scrollTop= messages.scrollHeight
        }
        catch(err) {

        }
    })
}
function sendMessage(arr) {
    firebase.database().ref("cardgame/messages/").set(arr)  
    updateMessages()
}
function showItem(e) {
    let eid = e.target.id.replace("Slider","");
    document.getElementById(eid).classList.remove("disabled")
}
function showDragged(e) {
    let eid = e.target.id.replace("Slider","");
    let newEl = document.getElementById(eid)
    document.getElementById("only").innerHTML = newEl.innerHTML;
    document.getElementById("only").classList.remove("d-none")
    document.getElementById("only")
    .setAttribute("style",`
    position:absolute;
    margin-top: calc(${e.touches[0].clientY}px - 50vh);
    margin-left: calc(-50vw + ${e.touches[0].clientX}px);
    `)
}
function updateCards(op,card,thatCards,path) {
    switch (op) {
        case 'add':
            thatCards.push(card)    
            firebase.database().ref(path).set(thatCards)  
            break;
        case 'remove':
            thatCards.splice(thatCards.findIndex(e=>{
                if (e.id==card.id) {
                    return e
                }
            }),1)            
            firebase.database().ref(path).set(thatCards)  
            break;
        default: console.log("do nothing")
    }
}
function pickCards(cardsNum,path) {
    let newArr=[];   
    let num; for (let i=0;i<cardsNum;i++)  {
        num =  Math.floor(Math.random() * pack.length) 
        generateCards([pack[num]],dropArea2)  
        newArr.push(pack[num])
    } 
    firebase.database().ref(path).once('value').then(
        snapshot=>{
            try {
                let arr = snapshot.val()  
                if (arr==null) {arr=[]}
                firebase.database().ref(path).set(arr.concat(newArr))  
            } catch(err) { console.log(err) }

        })
}
function sendCards(howMany,sourcePath,destPath) { 
    firebase.database().ref(sourcePath).once('value').then(
        snapshot=>{
            try {
                let pack1 = snapshot.val()
                let pack2 = []   
                for (let i=0; i<howMany; i++) {
                    num =  Math.floor(Math.random() * pack1.length);
                    idSelected = pack1[num].id;
                    pack2.push(pack1[num])
                    index = pack1.findIndex(e=>{
                        if (e.id==idSelected) {
                            return e
                        }
                    })
                    pack1.splice(index,1)
                }
                console.log(pack1)                
                firebase.database().ref(sourcePath).set(pack1)  
                console.log(pack2)
                firebase.database().ref(destPath).set(pack2)  
            }
            catch(err) {console.log(err)}
        })
}
function sendCard(card) {   
 
                let index = people.findIndex(e=>{
                    if (e.name==localStorage.getItem("user")) {
                        return e
                    }
                })
                firebase.database().ref('cardgame/people/'+index+'/cards/').once('value').then(
                    snapshot=>{
                        try {
                            //console.log(dropArea2)
                            let mycards=snapshot.val()
                            if (turn!=localStorage.getItem("user")) {
                                console.log("sending card and it's NOT my turn")
                                
                            } else {
                                /* generateCards(snapshot.val(),dropArea2) */
                                console.log("sending card and it's my turn")
                                
                                updateCards('add',card,cards,"cardgame/game/cards/")
                                updateCards('remove',card,mycards,'cardgame/people/'+index+'/cards/')
                                nextTurn(false)
                            }
                        } 
                        catch(err) {
                
                        }
                    }
                )
}
function touched(e) {
    let cardIndex= e.target.id.replace("Slider","").split("_")[1]
    if (e.touches[0]) {        
        let x0 = e.touches[0].clientX
        , y0 = e.touches[0].clientY
        , dx1 = dropArea.clientLeft
        , dx2 = dropArea.clientWidth
        , dy1 = dropArea.clientTop
        , dy2 = dropArea.clientHeight
        , d2x1 = dropArea2.clientLeft
        , d2x2 = dropArea2.clientWidth
        , d2y1 = dropArea.clientHeight
        , d2y2 = dropArea.clientHeight*2
        if (x0<dx2 && x0>dx1
            &&y0<dy2 && y0>dy1) {
                //console.log("entered d1")
                dropping=true
                dropWhere="d1"
                unHighlightDropArea([dropArea2])
                highlightDropArea(dropArea)
        } else if (x0<d2x2 && x0>d2x1
            &&y0<d2y2 && y0>d2y1) {
                dropping=true
                dropWhere="d2"
                unHighlightDropArea([dropArea])
                highlightDropArea(dropArea2)
                //console.log("entered d2")
        } else {
            dropping=false
            dropWhere=""
            unHighlightDropArea([dropArea, dropArea2])
        }
        hideItem(e)
        showDragged(e)
    }
}
function enableToolbar() {
    document.getElementById("toolbar").setAttribute
        ("style","pointer-events:auto;opacity:1")
}
function disableToolbar() {
    document.getElementById("toolbar").setAttribute
        ("style","pointer-events:none;opacity:.5")
}
function touchEnd(e) {
    //console.log(dropWhere)
    let eid = e.target.id.replace("Slider","");
    if (dropping && dropWhere=='d1') {
        let card1 = origPack.filter(e=>{
            if (e.id==eid.split("_")[1]) {
                return e
            }            
        })[0]
        let card2 = cards[cards.length-1]
        
            if (matchCards(card1,card2)) {
                document.getElementById(eid).classList.remove("position-relative")
                document.getElementById(eid).classList.add("position-absolute") 
                sendCard(card1)
                dropArea.appendChild(
                    document.getElementById(eid)
                )
            } else {
                document.getElementById(eid).classList.remove("position-absolute")
                document.getElementById(eid).classList.add("position-relative") 
            }    
    } else if (dropping && dropWhere=='d2') {     
        document.getElementById(eid).classList.remove("position-absolute")
        document.getElementById(eid).classList.add("position-relative") 
        /* dropArea2.appendChild(document.getElementById(
            e.target.id.replace("Slider",""))
        ) */
    }
    document.getElementById(eid).classList.remove("d-none")
    document.getElementById("only").classList.add("d-none")
    unHighlightDropArea([dropArea, dropArea2])
    showItem(e)
}
function matchCards(card1,card2) {
    console.log("1",card1,"2",card2)
    if (card1.suit==card2.suit
        || card1.value==card2.value
        || card1.suit=='black'
        || card2.suit=='black') {
            console.log("match")
            return true
        }        
        console.log("not match")
        return false
}
function unHighlightDropArea(areas) {
    for (let i in areas) {        
        areas[i].classList.remove("shadow-lg")
        areas[i].classList.remove("border")
    }
}
function updateNavbar() {
    console.log("user",localStorage.getItem("user"))
    firebase.database().ref("cardgame/turn").on('value',snapshot=>{
        try {
            console.log("turn changed")
            turn = snapshot.val()
            if (turn==localStorage.getItem("user")) {
                document.getElementById("turn").innerHTML = "Tocca a te"
            } else {
                document.getElementById("turn").innerHTML = "Tocca a "+turn+
                `<div class="ml-2 spinner-grow spinner-grow-sm text-warning" role="status">
                    <span class="sr-only">Loading...</span>
                </div>`
            }
            if(itsMyTurn()) {
                allowTouch=true
                enableToolbar()
            } else {
                allowTouch=false
                disableToolbar()
            }
        }
        catch(err) {
    
        }
    })
    navbar.innerHTML = `<div class="navbar-brand d-flex justify-content-between text-light">
    <div class="user"></div>
    <div class="ml-2">${localStorage.getItem("user")}</div>
    </div>
    <div id="turn" class="mr-2">...</div>
    `
}
function itsMyTurn() {
    return turn==localStorage.getItem("user")
}

function generatePack() {
    firebase.database().ref("cardgame/pack/").set([
        {
            id: 1
            , icon: "red-card one-white"
            , value: 1
            , text: 1
            , suit: "red"
        },{
            id: 2
            , icon: "red-card two-white"
            , value: 2
            , text: 2
            , suit: "red"
        },{
            id: 3
            , icon: "red-card three-white"
            , value: 3
            , text: 3
            , suit: "red"
        },{
            id: 4
            , icon: "red-card four-white"
            , value: 4
            , text: 4
            , suit: "red"
        },{
            id: 5
            , icon: "red-card five-white"
            , value: 5
            , text: 5
            , suit: "red"
        },{
            id: 6
            , icon: "red-card six-white"
            , value: 6
            , text: 6
            , suit: "red"
        },{
            id: 7
            , icon: "red-card seven-white"
            , value: 7
            , text: 7
            , suit: "red"
        },{
            id: 8
            , icon: "red-card eight-white"
            , value: 8
            , text: 8
            , suit: "red"
        },{
            id: 9
            , icon: "red-card nine-white"
            , value: 9
            , text: 9
            , suit: "red"
        },{
            id: 10
            , icon: "red-card zero-white"
            , value: 0
            , text: 0
            , suit: "red"
        },{
            id: 11
            , icon: "blue-card one-white"
            , value: 1
            , text: 1
            , suit: "blue"
        },{
            id: 12
            , icon: "blue-card two-white"
            , value: 2
            , text: 2
            , suit: "blue"
        },{
            id: 13
            , icon: "blue-card three-white"
            , value: 3
            , text: 3
            , suit: "blue"
        },{
            id: 14
            , icon: "blue-card four-white"
            , value: 4
            , text: 4
            , suit: "blue"
        },{
            id: 15
            , icon: "blue-card five-white"
            , value: 5
            , text: 5
            , suit: "blue"
        },{
            id: 16
            , icon: "blue-card six-white"
            , value: 6
            , text: 6
            , suit: "blue"
        },{
            id: 17
            , icon: "blue-card seven-white"
            , value: 7
            , text: 7
            , suit: "blue"
        },{
            id: 18
            , icon: "blue-card eight-white"
            , value: 8
            , text: 8
            , suit: "blue"
        },{
            id: 19
            , icon: "blue-card nine-white"
            , value: 9
            , text: 9
            , suit: "blue"
        },{
            id: 20
            , icon: "blue-card zero-white"
            , value: 0
            , text: 0
            , suit: "blue"
        },{
            id: 21
            , icon: "yellow-card one-black"
            , value: 1
            , text: 1
            , suit: "yellow"
        },{
            id: 22
            , icon: "yellow-card two-black"
            , value: 2
            , text: 2
            , suit: "yellow"
        },{
            id: 23
            , icon: "yellow-card three-black"
            , value: 3
            , text: 3
            , suit: "yellow"
        },{
            id: 24
            , icon: "yellow-card four-black"
            , value: 4
            , text: 4
            , suit: "yellow"
        },{
            id: 25
            , icon: "yellow-card five-black"
            , value: 5
            , text: 5
            , suit: "yellow"
        },{
            id: 26
            , icon: "yellow-card six-black"
            , value: 6
            , text: 6
            , suit: "yellow"
        },{
            id: 27
            , icon: "yellow-card seven-black"
            , value: 7
            , text: 7
            , suit: "yellow"
        },{
            id: 28
            , icon: "yellow-card eight-black"
            , value: 8
            , text: 8
            , suit: "yellow"
        },{
            id: 29
            , icon: "yellow-card nine-black"
            , value: 9
            , text: 9
            , suit: "yellow"
        },{
            id: 30
            , icon: "yellow-card zero-black"
            , value: 0
            , text: 0
            , suit: "yellow"
        },{
            id: 31
            , icon: "green-card one-white"
            , value: 1
            , text: 1
            , suit: "green"
        },{
            id: 32
            , icon: "green-card two-white"
            , value: 2
            , text: 2
            , suit: "green"
        },{
            id: 33
            , icon: "green-card three-white"
            , value: 3
            , text: 3
            , suit: "green"
        },{
            id: 34
            , icon: "green-card four-white"
            , value: 4
            , text: 4
            , suit: "green"
        },{
            id: 35
            , icon: "green-card five-white"
            , value: 5
            , text: 5
            , suit: "green"
        },{
            id: 36
            , icon: "green-card six-white"
            , value: 6
            , text: 6
            , suit: "green"
        },{
            id: 37
            , icon: "green-card seven-white"
            , value: 7
            , text: 7
            , suit: "green"
        },{
            id: 38
            , icon: "green-card eight-white"
            , value: 8
            , text: 8
            , suit: "green"
        },{
            id: 39
            , icon: "green-card nine-white"
            , value: 9
            , text: 9
            , suit: "green"
        },{
            id: 40
            , icon: "green-card zero-white"
            , value: 0
            , text: 0
            , suit: "green"
        },{
            id: 41
            , icon: "red-card one-white"
            , value: 1
            , text: 1
            , suit: "red"
        },{
            id: 42
            , icon: "red-card two-white"
            , value: 2
            , text: 2
            , suit: "red"
        },{
            id: 43
            , icon: "red-card three-white"
            , value: 3
            , text: 3
            , suit: "red"
        },{
            id: 44
            , icon: "red-card four-white"
            , value: 4
            , text: 4
            , suit: "red"
        },{
            id: 45
            , icon: "red-card five-white"
            , value: 5
            , text: 5
            , suit: "red"
        },{
            id: 46
            , icon: "red-card six-white"
            , value: 6
            , text: 6
            , suit: "red"
        },{
            id: 47
            , icon: "red-card seven-white"
            , value: 7
            , text: 7
            , suit: "red"
        },{
            id: 48
            , icon: "red-card eight-white"
            , value: 8
            , text: 8
            , suit: "red"
        },{
            id: 49
            , icon: "red-card nine-white"
            , value: 9
            , text: 9
            , suit: "red"
        },{
            id: 50
            , icon: "red-card zero-white"
            , value: 0
            , text: 0
            , suit: "red"
        },{
            id: 51
            , icon: "blue-card one-white"
            , value: 1
            , text: 1
            , suit: "blue"
        },{
            id: 52
            , icon: "blue-card two-white"
            , value: 2
            , text: 2
            , suit: "blue"
        },{
            id: 53
            , icon: "blue-card three-white"
            , value: 3
            , text: 3
            , suit: "blue"
        },{
            id: 54
            , icon: "blue-card four-white"
            , value: 4
            , text: 4
            , suit: "blue"
        },{
            id: 55
            , icon: "blue-card five-white"
            , value: 5
            , text: 5
            , suit: "blue"
        },{
            id: 56
            , icon: "blue-card six-white"
            , value: 6
            , text: 6
            , suit: "blue"
        },{
            id: 57
            , icon: "blue-card seven-white"
            , value: 7
            , text: 7
            , suit: "blue"
        },{
            id: 58
            , icon: "blue-card eight-white"
            , value: 8
            , text: 8
            , suit: "blue"
        },{
            id: 59
            , icon: "blue-card nine-white"
            , value: 9
            , text: 9
            , suit: "blue"
        },{
            id: 60
            , icon: "blue-card zero-white"
            , value: 0
            , text: 0
            , suit: "blue"
        },{
            id: 61
            , icon: "yellow-card one-black"
            , value: 1
            , text: 1
            , suit: "yellow"
        },{
            id: 62
            , icon: "yellow-card two-black"
            , value: 2
            , text: 2
            , suit: "yellow"
        },{
            id: 63
            , icon: "yellow-card three-black"
            , value: 3
            , text: 3
            , suit: "yellow"
        },{
            id: 64
            , icon: "yellow-card four-black"
            , value: 4
            , text: 4
            , suit: "yellow"
        },{
            id: 65
            , icon: "yellow-card five-black"
            , value: 5
            , text: 5
            , suit: "yellow"
        },{
            id: 66
            , icon: "yellow-card six-black"
            , value: 6
            , text: 6
            , suit: "yellow"
        },{
            id: 67
            , icon: "yellow-card seven-black"
            , value: 7
            , text: 7
            , suit: "yellow"
        },{
            id: 68
            , icon: "yellow-card eight-black"
            , value: 8
            , text: 8
            , suit: "yellow"
        },{
            id: 69
            , icon: "yellow-card nine-black"
            , value: 9
            , text: 9
            , suit: "yellow"
        },{
            id: 70
            , icon: "yellow-card zero-black"
            , value: 0
            , text: 0
            , suit: "yellow"
        },{
            id: 71
            , icon: "green-card one-white"
            , value: 1
            , text: 1
            , suit: "green"
        },{
            id: 72
            , icon: "green-card two-white"
            , value: 2
            , text: 2
            , suit: "green"
        },{
            id: 73
            , icon: "green-card three-white"
            , value: 3
            , text: 3
            , suit: "green"
        },{
            id: 74
            , icon: "green-card four-white"
            , value: 4
            , text: 4
            , suit: "green"
        },{
            id: 75
            , icon: "green-card five-white"
            , value: 5
            , text: 5
            , suit: "green"
        },{
            id: 76
            , icon: "green-card six-white"
            , value: 6
            , text: 6
            , suit: "green"
        },{
            id: 77
            , icon: "green-card seven-white"
            , value: 7
            , text: 7
            , suit: "green"
        },{
            id: 78
            , icon: "green-card eight-white"
            , value: 8
            , text: 8
            , suit: "green"
        },{
            id: 79
            , icon: "green-card nine-white"
            , value: 9
            , text: 9
            , suit: "green"
        },{
            id: 80
            , icon: "green-card zero-white"
            , value: 0
            , text: 0
            , suit: "green"
        },{
            id: 81
            , icon: "red-card plus-two-red"
            , value: 0
            , text: "+2"
            , suit: "red"
        },{
            id: 82
            , icon: "blue-card plus-two-blue"
            , value: 0
            , text: "+2"
            , suit: "blue"
        },{
            id: 83
            , icon: "yellow-card plus-two-yellow"
            , value: 0
            , text: "+2"
            , suit: "yellow"
        },{
            id: 84
            , icon: "green-card plus-two-green"
            , value: 0
            , text: "+2"
            , suit: "green"
        },{
            id: 85
            , icon: "red-card invert-white"
            , value: 0
            , text: "-"
            , suit: "red"
        },{
            id: 86
            , icon: "blue-card invert-white"
            , value: 0
            , text: "-"
            , suit: "blue"
        },{
            id: 87
            , icon: "yellow-card invert-black"
            , value: 0
            , text: "-"
            , suit: "yellow"
        },{
            id: 88
            , icon: "green-card invert-white"
            , value: 0
            , text: "-"
            , suit: "green"
        },{
            id: 89
            , icon: "black-card plus-four-white"
            , value: 0
            , text: "+4"
            , suit: "black"
        },{
            id: 90
            , icon: "black-card change-color"
            , value: 0
            , text: "-"
            , suit: "black"
        },{
            id: 91
            , icon: "red-card plus-two-red"
            , value: 0
            , text: "+2"
            , suit: "red"
        },{
            id: 92
            , icon: "blue-card plus-two-blue"
            , value: 0
            , text: "+2"
            , suit: "blue"
        },{
            id: 93
            , icon: "yellow-card plus-two-yellow"
            , value: 0
            , text: "+2"
            , suit: "yellow"
        },{
            id: 94
            , icon: "green-card plus-two-green"
            , value: 0
            , text: "+2"
            , suit: "green"
        },{
            id: 95
            , icon: "red-card invert-white"
            , value: 0
            , text: "-"
            , suit: "red"
        },{
            id: 96
            , icon: "blue-card invert-white"
            , value: 0
            , text: "-"
            , suit: "blue"
        },{
            id: 97
            , icon: "yellow-card invert-black"
            , value: 0
            , text: "-"
            , suit: "yellow"
        },{
            id: 98
            , icon: "green-card invert-white"
            , value: 0
            , text: "-"
            , suit: "green"
        },{
            id: 99
            , icon: "black-card plus-four-white"
            , value: 0
            , text: "+4"
            , suit: "black"
        },{
            id: 100
            , icon: "black-card change-color"
            , value: 0
            , text: "-"
            , suit: "black"
        },{
            id: 101
            , icon: "red-card stop-white"
            , value: 0
            , text: "+2"
            , suit: "red"
        },{
            id: 102
            , icon: "blue-card stop-white"
            , value: 0
            , text: "+2"
            , suit: "blue"
        },{
            id: 103
            , icon: "yellow-card stop-black"
            , value: 0
            , text: "+2"
            , suit: "yellow"
        },{
            id: 104
            , icon: "green-card stop-white"
            , value: 0
            , text: "+2"
            , suit: "green"
        },{
            id: 105
            , icon: "red-card invert-white"
            , value: 0
            , text: "-"
            , suit: "red"
        },{
            id: 106
            , icon: "blue-card invert-white"
            , value: 0
            , text: "-"
            , suit: "blue"
        },{
            id: 107
            , icon: "yellow-card invert-black"
            , value: 0
            , text: "-"
            , suit: "yellow"
        },{
            id: 108
            , icon: "green-card invert-white"
            , value: 0
            , text: "-"
            , suit: "green"
        },{
            id: 109
            , icon: "black-card plus-four-white"
            , value: 0
            , text: "+4"
            , suit: "black"
        },{
            id: 110
            , icon: "black-card change-color"
            , value: 0
            , text: "-"
            , suit: "black"
        },{
            id: 111
            , icon: "red-card stop-white"
            , value: 0
            , text: "-"
            , suit: "red"
        },{
            id: 112
            , icon: "blue-card stop-white"
            , value: 0
            , text: "-"
            , suit: "blue"
        },{
            id: 113
            , icon: "yellow-card stop-black"
            , value: 0
            , text: "-"
            , suit: "yellow"
        },{
            id: 114
            , icon: "green-card stop-white"
            , value: 0
            , text: "-"
            , suit: "green"
        }
    ])   
}

//to create a pack into DB quickly
/* 
*/