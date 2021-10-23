const one = document.getElementById("one")
const two = document.getElementById("two")
const only = document.getElementById("only")
const dropArea = document.getElementById("dropArea")
const dropArea2 = document.getElementById("dropArea2")
let newEl, dropping=false,dropWhere="";
only.addEventListener("dragstart",(e)=>{
    e.preventDefault()
})

let pack = [
    {id:1,value:1,suit:"blu",text:"1",icon:"red-card one-white", colorCode:"#2673E8"}
    , {id:2,value:2,suit:"blu",text:"2",icon:"blue-card two-white", colorCode:"#2673E8"}
    , {id:3,value:3,suit:"blu",text:"3",icon:"blue-card three-white", colorCode:"#2673E8"}
    , {id:4,value:4,suit:"blu",text:"4",icon:"blue-card four-white", colorCode:"#2673E8"}
    , {id:5,value:5,suit:"blu",text:"5",icon:"blue-card five-white", colorCode:"#2673E8"}
    , {id:22,value:12,suit:"blu",text:"11",icon:"blue-card invert-white", colorCode:"#2673E8"}
    , {id:6,value:1,suit:"yellow",text:"1",icon:"yellow-card one-black", colorCode:"#E8BD26"}
    , {id:7,value:2,suit:"yellow",text:"2",icon:"yellow-card two-black", colorCode:"#E8BD26"}
    , {id:8,value:3,suit:"yellow",text:"3",icon:"yellow-card three-black", colorCode:"blue", colorCode:"#E8BD26"}
    , {id:9,value:4,suit:"yellow",text:"4",icon:"yellow-card four-black", colorCode:"#E8BD26"}
    , {id:10,value:5,suit:"yellow",text:"5",icon:"yellow-card five-black", colorCode:"#E8BD26"}
    ,{id:11,value:1,suit:"green",text:"1",icon:"green-card one-white", colorCode:"#45BB32"}
    , {id:12,value:2,suit:"green",text:"2",icon:"green-card two-white", colorCode:"#45BB32"}
    , {id:13,value:3,suit:"green",text:"3",icon:"green-card three-white", colorCode:"#45BB32"}
    , {id:14,value:4,suit:"green",text:"4",icon:"green-card four-white", colorCode:"#45BB32"}
    , {id:15,value:5,suit:"green",text:"5",icon:"green-card five-white", colorCode:"#45BB32"}
    , {id:21,value:10,suit:"green",text:"",icon:"green-card stop-white", colorCode:"#45BB32"}
    , {id:16,value:1,suit:"red",text:"1",icon:"red-card one-white", colorCode:"#E82626"}
    , {id:17,value:2,suit:"red",text:"2",icon:"red-card two-white", colorCode:"#E82626"}
    , {id:18,value:3,suit:"red",text:"3",icon:"red-card three-white", colorCode:"#E82626"}
    , {id:19,value:4,suit:"red",text:"4",icon:"red-card four-white", colorCode:"#E82626"}
    , {id:20,value:5,suit:"red",text:"5",icon:"red-card five-white", colorCode:"#E82626"}

]
let floor = []
let cards = []
let theCards = []
let specialCards = ['special-red-card']
console.log(pack)
giveCards(8,pack,theCards)
console.log(pack)
giveCards(1,pack,floor)
generateCards(theCards,dropArea2)
generateCards(floor,dropArea)
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
function unHighlightDropArea(areas) {
    for (let i in areas) {        
        areas[i].classList.remove("shadow-lg")
        areas[i].classList.remove("border")
    }
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
function hideItem(e) {
    let eid = e.target.id.replace("Slider","");
    document.getElementById(eid).classList.add("disabled")
}
function showItem(e) {
    let eid = e.target.id.replace("Slider","");
    document.getElementById(eid).classList.remove("disabled")
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
function showDragged(e) {
    let eid = e.target.id.replace("Slider","");
    let newEl = document.getElementById(eid)
    document.getElementById("only").innerHTML = newEl.innerHTML;
    document.getElementById("only").classList.remove("d-none")
    document.getElementById("only")
    .setAttribute("style",`
    margin-top: calc(${e.touches[0].clientY}px - ${dropArea.clientHeight+50}px);
    margin-left: calc(${e.touches[0].clientX}px - 100px);
    `)
}

function matchCards(parameters) {
    //confronta 
    let rtrn=false
    for (let i in parameters) {
    eval(`           
        if (selectedCards1[0].${parameters[i]} == selectedCards2[0].${parameters[i]})
                    rtrn=true
        `)
    }
    return rtrn
}

function giveCards(n,packFrom,packTo) {
    console.log(n,packFrom,packTo)
    for (let i=0;i<n;i++) { 
        let num =  Math.floor(Math.random() * packFrom.length) 
        addCard(num,packFrom,packTo)
        console.log(num,packTo,packFrom)
        removeCard(num,packFrom)
    }
}

function addCard(which,packFrom,packTo) {
    packTo.push(packFrom[which])
}

function removeCard(which,packFrom) {
    packFrom.splice(which,1)
}
