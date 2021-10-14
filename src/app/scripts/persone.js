const addPersonButton = document.getElementById("addPersonButton");
const cardsWrapper = document.getElementById("cardsWrapper");
const startButton = document.getElementById("startButton");

let lista = JSON.parse(localStorage.getItem("lista"));
console.log(lista)
let listaHTML = ""; for (let i in lista) {
    listaHTML+=
    `<div class="card mb-2">
    <div class="card-body shadow">
        ${lista[i]}
    </div>
</div>`
}
cardsWrapper.innerHTML = listaHTML;

if (lista.length>1) {
    startButton.innerHTML = "Inizia";
    startButton.classList.remove("disabled");
}
addPersonButton.addEventListener("click",()=>{    
    window.location.href = "./aggiungi.html"
})
startButton.addEventListener("click",()=>{    
    window.location.href = "./importo.html"
})