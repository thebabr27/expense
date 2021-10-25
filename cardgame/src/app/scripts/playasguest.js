const navbar = document.getElementsByClassName("navbar")[0]

navbar.innerHTML = '<div class="navbar-brand d-flex text-light"><div class="user"></div>'
+'<div class="ml-2">'+localStorage.getItem("user")+"</div></div>"
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
  let items=[];

  sendMsgButton.addEventListener("click",e=>{
      items.push({
          author: localStorage.getItem("user")
          , text: msgInput.value
      })
      sendMessage(items)
      msgInput.value=""
  })

  msgInput.addEventListener("keyup",e=>{
      if (e.key=='Enter') {
          sendMsgButton.click()
      }
  })

firebase.database().ref("cardgame/messages").once('value').then(
    snapshot=>{
    try {
        items = snapshot.val();
        let html=""; for (let i in items) {
            html+=`<div class="w-100"><b>${items[i].author}:&nbsp;</b>${items[i].text}<br></div>`
        }
        messages.innerHTML = html;
        messages.scrollTop= messages.scrollHeight
    }
    catch(err) {

    }
})

firebase.database().ref("cardgame/game/pack").once('value').then(
snapshot=>{
    try {
        generateCards(snapshot.val(),dropArea2)
    }
    catch(err) {

    }
})   
firebase.database().ref("cardgame/game/cards").once('value').then(
    snapshot=>{
        try {
            generateCards(snapshot.val(),dropArea)
        }
        catch(err) {
    
        }
    })   
    
function generateCards(cards,area) {
    let button;
    for (let i in cards) {
        button = document.createElement("button")
        button.setAttribute("draggable","true")
        if(area=='dropArea2') {
            button.setAttribute("class","game-button position-absolute  btn p-0 shadow rounded")
        } else {
            button.setAttribute("class","game-button position-relative  btn p-0 rounded")
        }
        button.setAttribute("id","card_"+i)
        button.setAttribute("style","margin-left:-30px")
        let html = "";
        html=`
            <div id="card_${i}Slider" value="${cards[i].value}" style="z-index:1000" class="w-100 h-100 position-absolute"></div>     
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
        document.getElementById(`card_${i}Slider`).addEventListener("touchmove",(e)=>{            
            e.preventDefault()
            touched(e)
        })
        document.getElementById(`card_${i}Slider`).addEventListener("touchend",(e)=>{            
            e.preventDefault()
            touchEnd(e)
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
function sendMessage(arr) {
    firebase.database().ref("cardgame/messages/").set(arr)  
    firebase.database().ref("cardgame/messages").once('value').then(function(snapshot) {
        try {
            items = snapshot.val();
            let html=""; for (let i in items) {
                html+=`<div class="w-100"><b>${items[i].author}:&nbsp;</b>${items[i].text}<br></div>`
            }
            messages.innerHTML = html;
            messages.scrollTop= messages.scrollHeight
        }
        catch(err) {

        }
    })
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
    margin-top: calc(${e.touches[0].clientY}px - 50vh);
    margin-left: calc(${e.touches[0].clientX}px - 30vh);
    `)
}
function touched(e) {
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
function touchEnd(e) {
    let eid = e.target.id.replace("Slider","");
    if (dropping && dropWhere=='d1') {     
        document.getElementById(eid).classList.remove("position-relative")
        document.getElementById(eid).classList.add("position-absolute") 
        dropArea.appendChild(
            document.getElementById(eid)
        )
    } else if (dropping && dropWhere=='d2') {     
        document.getElementById(eid).classList.remove("position-absolute")
        document.getElementById(eid).classList.add("position-relative") 
        dropArea2.appendChild(document.getElementById(
            e.target.id.replace("Slider",""))
        )
    }
    document.getElementById(eid).classList.remove("d-none")
    document.getElementById("only").classList.add("d-none")
    unHighlightDropArea([dropArea, dropArea2])
    showItem(e)
}
function unHighlightDropArea(areas) {
    for (let i in areas) {        
        areas[i].classList.remove("shadow-lg")
        areas[i].classList.remove("border")
    }
}