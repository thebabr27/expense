const addAmountConfirmButton = document.getElementById("addAmountConfirmButton");
const inputAmount = document.getElementById("inputAmount");
const addAmountConfirmSpinner = addAmountConfirmButton.querySelector(".spinner-border");
const appContainer = document.querySelector(".app-container");
const appWrapper = document.querySelector(".app-wrapper");
inputAmount.focus();
let n
const lista = JSON.parse(localStorage.getItem("lista"))
const amount = JSON.parse(localStorage.getItem("amount"))

let text = "",newList=[]; 


addAmountConfirmButton.addEventListener("click",()=>{
    addAmountConfirmSpinner.classList.remove("d-none")
    inputAmount.value=inputAmount.value.replace(",",".")
    inputAmount.value = parseFloat(inputAmount.value).toFixed(2)
        setTimeout(()=>{
            addAmountConfirmSpinner.classList.add("d-none")
            appWrapper.classList.add('animate__animated')
            appWrapper.classList.add('animate__bounceOutLeft')
            localStorage.setItem("amount",'{"topay":'+inputAmount.value+',"payed":0.00,"remaining":0.00}')
            let amount = localStorage.getItem("amount")
            for (let i in lista) {
                newList.push({
                    name:lista[i]
                    , quota:parseFloat(JSON.parse(amount).topay/lista.length)
                    , perc: 100/(lista.length)+"%"
                    , vers: 0
                    , diff: 0
                    , rip: 0
                    , rest: []
                })
            }
            localStorage.setItem("newList",JSON.stringify(newList));
            console.log(newList)
            setTimeout(()=>{
                window.location.href = "./calcolo.html"
            },700)
            
        },700)
})

inputAmount.addEventListener("keydown",(e)=>{
    if (e.key=='Enter') {
        addAmountConfirmButton.click();
    }
})
