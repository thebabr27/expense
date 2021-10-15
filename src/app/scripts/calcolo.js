let lista = JSON.parse(localStorage.getItem("lista"));
  let newList2 = JSON.parse(localStorage.getItem("newList"));
  let newList3 = [];
  let amount = JSON.parse(localStorage.getItem("amount"));
  const topayInput = document.getElementById("topayInput");
  const payedInput = document.getElementById("payedInput");
  const remainingInput = document.getElementById("remainingInput");
  const availableInput2 = document.getElementById("availableInput2");
  const peopleSlider = document.getElementById("peopleSlider");
  const peopleSlider2 = document.getElementById("peopleSlider2");
  const diff = document.getElementById("diff");
  const peopleTable = document.getElementById("peopleTable");
  const payButton = document.getElementById("payButton");
  const payInput = document.getElementById("payInput");
  const takeButton = document.getElementById("takeButton");
  const modal = document.getElementById("modal");
  const modalBG = document.getElementById("modalBG");
  const appContainer = document.querySelectorAll('.app-container')[1];
  const closeModal = document.querySelector('.close');
  const modalTitle = document.querySelector('#modalTitle');
  const euro = document.querySelector('#euro');
  const cent = document.querySelector('#cent');
  const centDec = document.querySelector('#centDec');
  const centInc = document.querySelector('#centInc');
  const euroDec = document.querySelector('#euroDec');
  const euroInc = document.querySelector('#euroInc');
  const euroButton = document.querySelector('#euroButton');
  const centButton = document.querySelector('#centButton');
  const confirmPayButton = document.querySelector('#confirmPayButton');
  const confirmPaySpinner = document.querySelector('#confirmPaySpinner');
  let editedEuro=0;
  let editedCent=0;
  let editedEuroCent=0;
  let editedPayedInput=0;
  let editedAvailableInput2=0;
  let editedRemainingInput=0;
  let peopleSelected = newList2[0],
  peopleInModalSelected = newList2[1];
updateData();
updatePeopleList(newList2,peopleSlider);
updateTable();

console.log(amount)
console.log(newList2)
payButton.addEventListener("click",()=>{
    payInput.value = fix(payInput.value,true);
    peopleSelected.vers = parseFloat(payInput.value)
    updateData();
    updateTable();
})

confirmPayButton.addEventListener("click",()=>{
    console.log(editedEuroCent)
    newList2.filter((e)=>{
        if (e.name==peopleSelected.name) {
            return e
        }    
    })[0].rip += editedEuroCent
    newList2.filter((e)=>{
        if (e.name==peopleInModalSelected.name) {
            return e
        }    
    })[0].vers+=editedEuroCent
    updateTable();
})

takeButton.addEventListener("click",(e)=>{
    updateModal()
    modal.classList.remove("d-none")
    modalBG.classList.remove("d-none")
})

closeModal.addEventListener("click",()=>{
    modal.classList.add("d-none")
    modalBG.classList.add("d-none")
})

function updateIncDec() {
    euro.innerHTML = editedEuroCent.toFixed(2).split(".")[0]
    cent.innerHTML = editedEuroCent.toFixed(2).split(".")[1]
}

function updateModal() {
    newList3=newList2.filter((e)=>{
        if (e.name!=peopleSelected.name) {
            return e
        }
    })
    modalTitle.innerHTML = peopleSelected.name
    payedInput2.innerHTML = "€"+fix(peopleSelected.diff.toFixed(2))
    remainingInput2.innerHTML = "€"+fix((peopleSelected.diff-editedEuroCent).toFixed(2))
    updatePeopleList(newList3,peopleSlider2)
    highlight(payedInput2,peopleSelected.diff);
    highlight(remainingInput2,peopleSelected.rip);   
    switchInModalPeople(peopleInModalSelected.name)
    editedAvailableInput2= (newList2.filter((e)=>{
        if (e.name==peopleInModalSelected.name) {
            return e
        }        
    })[0].diff)*-1
    availableInput2.innerHTML = "€"+fix(editedAvailableInput2.toFixed(2))
    console.log(peopleSelected.diff,peopleSelected.rip)
    euro.innerHTML=editedEuroCent.toFixed(2).toString().split(".")[0]
    cent.innerHTML=editedEuroCent.toFixed(2).toString().split(".")[1]

}

centButton.addEventListener("click",()=>{
    increase10(cent)   
    updateModal()
})

euroButton.addEventListener("click",()=>{
    increase10(euro)   
    updateModal()
})

euroInc.addEventListener("click",()=>{
    increase(euro)   
    updateModal()
})

euroDec.addEventListener("click",()=>{
    decrease(euro)   
    updateModal()
})

centInc.addEventListener("click",()=>{
    increase(cent)   
    updateModal()
})

centDec.addEventListener("click",()=>{
    decrease(cent)   
    updateModal()
})

function increase10(item) {
    switch (item.id) {
        case 'euro': editedEuroCent+=10; break;
        case 'cent': editedEuroCent+=10; break;
        default: console.log("err");
    }
    updateIncDec()
}

function increase(item) {
    switch (item.id) {
        case 'euro': editedEuroCent+=1; break;
        case 'cent': editedEuroCent+=.01; break;
        default: console.log("err");
    }
    updateIncDec()
}

function decrease(item) {
    switch (item.id) {
        case 'euro': editedEuroCent-=1; break;
        case 'cent': editedEuroCent-=.01; break;
        default: console.log("err");
    }
    updateIncDec()
}

peopleSlider2.addEventListener("click",(e)=>{
    let name = e.target.innerText
    peopleInModalSelected=newList2.filter((e)=>{
        name=name.replace("\n","")
        if (e.name==name) {
            return e
        }
    })[0]
    switchInModalPeople(peopleInModalSelected.name)
})

peopleSlider.addEventListener("click",(e)=>{
    payInput.value=""
    let name = e.target.innerText;
    peopleSelected=newList2.filter((e)=>{
        if (e.name==name) {
            return e
        }
    })[0]
    switchPeople(peopleSelected.name)
})

payInput.addEventListener("keydown",(e)=>{
    if (e.key=='Enter') {
        payButton.click();
    }
})

function switchInModalPeople(peopleName) {
    
    let people = peopleTable.querySelectorAll('.people');
    for (let i in newList3) {
        if (peopleSlider2.querySelectorAll('.btn')[i].innerText.split(" ").length>1) {
            peopleSlider2.querySelectorAll('.btn')[i].innerText=
            peopleSlider2.querySelectorAll('.btn')[i].innerText.split(" ")[8].replace("\n","")
        }
        
        if (peopleSlider2.querySelectorAll('.btn')[i].innerText==peopleName) {            
            peopleSlider2.querySelectorAll(".btn")[i].classList.add("btn-secondary")
            peopleSlider2.querySelectorAll(".btn")[i].classList.remove("btn-light")
        } else {
            peopleSlider2.querySelectorAll(".btn")[i].classList.remove("btn-secondary")
            peopleSlider2.querySelectorAll(".btn")[i].classList.add("btn-light")
        }
    }
    
}

function switchPeople(peopleName) {
    let people = peopleTable.querySelectorAll('.people');
    for (let i in people) {
        if (typeof(people[i])=='object') {
            if (peopleSlider.querySelectorAll(".btn")[i].innerText==peopleName) {
                peopleSlider.querySelectorAll(".btn")[i].classList.add("btn-secondary")
                peopleSlider.querySelectorAll(".btn")[i].classList.remove("btn-light")
            } else {
                peopleSlider.querySelectorAll(".btn")[i].classList.remove("btn-secondary")
                peopleSlider.querySelectorAll(".btn")[i].classList.add("btn-light")
            }
        }
    }
    
    for (let i in people) {
        if (typeof(people[i])=='object') {
            if (people[i].querySelector('h5').innerText==peopleName) {
                people[i].classList.remove("d-none")  
            }
        }
    }
    for (let i in people) {
        if (typeof(people[i])=='object') {
            if (people[i].querySelector('h5').innerText!=peopleName) {
                people[i].classList.add("d-none")  
            }
        }
    }
}

function highlightTableItem(item) {
    for (let index in newList2) {         
        /* let index = newList2.indexOf(peopleSelected); */
        item[index].classList.remove("bg-danger");       
        item[index].classList.remove("bg-warning");       
        item[index].classList.remove("bg-success");        
        item[index].classList.remove("text-light")
        let condition;
        switch (item[0].classList[0]) {
            case 'vers':
                condition = newList2[index].vers-newList2[index].quota;
                break;
            case 'diff':
                condition = newList2[index].vers-newList2[index].quota;
                break;
            case 'rip':
                condition = newList2[index].rip+(newList2[index].diff*-1)
                console.log("rip",condition)
                break;
            default: console.log("error")
        }
        /* console.log(item[0].classList[0],"condizione",condition) */
        if (condition<-2) {
            item[index].classList.add("bg-danger");        
            item[index].classList.add("text-light")
        } else if (condition>=0) {
            item[index].classList.add("bg-success");        
            item[index].classList.add("text-light")
        } else {
            item[index].classList.add("bg-warning");        
        }
    }
}

function highlightTable() {
    highlightTableItem(
        peopleTable.querySelectorAll(".vers")
    )
    highlightTableItem(
        peopleTable.querySelectorAll(".diff")
    )
    highlightTableItem(
        peopleTable.querySelectorAll(".rip")
    )
    
}

function updateTable() {
    let text = ""; for (let i in newList2) {
        /* console.log(newList2[i]); */
        text+=
        `<div class="people">                   
        <div class="w-100 text-center">
            <h5>`+newList2[i].name+`</h5>
        </div>
        <div class="quota d-flex justify-content-between p-2 mb-1">
            <div>Quota</div>
            <div>€`+newList2[i].quota+`</div>
        </div>
        <div class="perc d-flex justify-content-between p-2 mb-1">
            <div>Percentuale</div>
            <div>`+newList2[i].perc+`</div>
        </div>
        <div class="vers d-flex justify-content-between rounded p-2 mb-1 ">
            <div>Versato</div>
            <div>€`+(parseFloat(newList2[i].vers)).toFixed(2)+`</div>
        </div>
        <div class="diff d-flex justify-content-between p-2 mb-1">
            <div>Differenza</div>
            <div>€`+(parseFloat(newList2[i].diff)).toFixed(2)+`</div>
        </div>
        <div class="rip d-flex justify-content-between p-2 mb-1">
            <div>Ripreso</div>
            <div>€`+(parseFloat(newList2[i].rip)).toFixed(2)+`</div>
        </div>
    </div>
        `
    }
    peopleTable.innerHTML=text

    switchPeople(peopleSelected.name)
    highlightTable()
}

function updatePeopleList(list,slider) {
    let text = ""; for (let i in list) {
        text+=
        `<button class="btn btn-light shadow rounded-pill py-3 mr-3">
        `+list[i].name+`
        </button>
        `;
    }
    slider.innerHTML=text
}

function updateData() {
    amount.payed=0;
    for (let i in newList2) {
        amount.payed+=newList2[i].vers;
        console.log()
        newList2[i].diff=parseFloat((newList2[i].vers-newList2[i].quota).toFixed(2))
    }
    console.log(newList2)
    amount.remaining=amount.payed-amount.topay
    highlight(payedInput,amount.remaining);
    highlight(remainingInput,amount.remaining);
    updateItem(topayInput,amount.topay)
    updateItem(payedInput,amount.payed)
    updateItem(remainingInput,amount.remaining)

}

function highlight(item,sum) {
    item.classList.remove("text-danger")
    item.classList.remove("text-success")
    item.classList.remove("text-warning")
    if(sum <-2 ) {
        item.classList.add("text-danger")
    } else if (sum >=0) {
        item.classList.add("text-success")
    } else {
        item.classList.add("text-warning")
    }
}
function updateItem(item,val) {
    item.innerHTML = "€"+fix(val.toFixed(2))
}
function fix(num) {
        num = num.toString().replace(",",".")
        if(num.indexOf(".")>-1) {
            if (num.split(".")[1].length==2) {
                /* console.log("due numeri") */
            } else if (num.split(".")[1].length==1) {            
                num+="0"
            } else if (num.split(".")[1].length==0) {   
                console.log("nessun numero");
            } else {
                console.log("piu di due numeri")
            }
        } else {
            num+=".00"
        }
        console.log(num)
    return num
}
   /* 
takeButton.addEventListener("click",(e)=>{
    console.log("loading data for ",peopleSelected)
    modal.classList.remove("d-none")
    modalBG.classList.remove("d-none")
    appContainer.classList.add("position-absolute")
    appContainer.classList.add("w-100")
    appContainer.setAttribute("style","height:100vh!important")
    updateModal()
})

payButton.addEventListener("click",()=>{
    payInput.value = fixNumber(payInput.value);
    updatePeople();
})
payInput.addEventListener("keydown",(e)=>{
    if (e.key=='Enter') {
        payButton.click();
    }
})

    closeModal.addEventListener("click",()=>{
        modal.classList.add("d-none")
        modalBG.classList.add("d-none")
    })

    peopleSlider.addEventListener("click",(e)=>{
        peopleSelected = e.target.innerText;
        payInput.value = ""
        select();
    })

    select();
    updateAmount()
    calcola()

    function updatePeople() {
        newList2[lista.indexOf(peopleSelected)].vers = payInput.value;
        select();
        updateAmount();
        console.log(newList2)
    }

    function updateModal() {
        modalTitle.innerHTML = peopleSelected
    }

    function updateAmount() {
        topayInput.innerHTML = "€"+amount.topay;
        let totalPayed = 0; for (let i in newList2) {
            totalPayed+=parseFloat(newList2[i].vers)
        }
        amount.payed = fixNumber((totalPayed).toString())
        payedInput.innerHTML = "€"+fixNumber(amount.payed,true); 
        amount.remaining = (fixNumber(amount.payed,true)-fixNumber(amount.topay,true)).toString()
        remainingInput.innerHTML = "€"+fixNumber(amount.remaining,true);
        highlightAmount(payedInput)
        highlightAmount(remainingInput)
        console.log("am",amount)
        console.log("nL",newList2)
    }

    function highlightAmount(input) {
        input.classList.remove("text-danger")    
        input.classList.remove("text-success")     
        input.classList.remove("text-warning")   
        if (parseFloat(amount.remaining)<-2) {            
            input.classList.add("text-danger")       
            input.classList.add("text-danger")
        } else if (parseFloat(amount.remaining)>=0) {  
            input.classList.add("text-success")
        } else {
            input.classList.add("text-warning")
        }
    }

    function calcola() {
    }

    function select() {
        let text = ""; for (let i in lista) {
            text+=
            `<button class="btn btn-light shadow rounded-pill py-3 mr-3">
            `+lista[i]+`
            </button>
            `;
        }
        
        peopleSlider.innerHTML = text;
        peopleSlider2.innerHTML = text;
    
        text = ""; for (let i in newList2) {
            text+=
            `<div class="people">                   
            <div class="w-100 text-center">
                <h5>`+newList2[i].name+`</h5>
            </div>
            <div class="d-flex justify-content-between p-2 mb-1">
                <div>Quota</div>
                <div>€`+newList2[i].quota+`</div>
            </div>
            <div class="d-flex justify-content-between p-2 mb-1">
                <div>Percentuale</div>
                <div>`+newList2[i].perc+`</div>
            </div>
            <div class="d-flex justify-content-between bg-danger rounded p-2 mb-1 text-light">
                <div>Versato</div>
                <div>€`+newList2[i].vers+`</div>
            </div>
            <div class="d-flex justify-content-between p-2 mb-1">
                <div>Differenza</div>
                <div>€`+newList2[i].diff+`</div>
            </div>
            <div class="d-flex justify-content-between p-2 mb-1">
                <div>Ripreso</div>
                <div>€`+newList2[i].rip+`</div>
            </div>
        </div>
            `
        }
        
        peopleTable.innerHTML = text;
        
        let people = peopleTable.querySelectorAll('.people');
        for (let i in people) {
            if (typeof(people[i])=='object') {
                if (people[i].querySelector('h5').innerText != peopleSelected) {
                    people[i].classList.add("d-none")
                }
            }
        }
    }

 */