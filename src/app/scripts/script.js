let appScript = document.createElement("script");
appScript.setAttribute("id","appScript");
appScript.innerHTML = 
`
console.log("YEAH")
`
document.body.appendChild(appScript);
document.querySelector('#appScript').remove();
/* 
let appContainer = document.createElement("div");
appContainer.setAttribute("class","app-container ");
appContainer.innerHTML =
`
<div class="container d-flex flex-column justify-content-between h-100">
    <div class="card text-center card-custom">
        <div class="card-body d-flex justify-content-center">
            <h2>
                Inserisci Partecipanti
            </h2>
        </div>
    </div>
    <div class="card card-custom">
        <div id="addNewPersonCard" class="card-body d-flex justify-content-center">
            <button onclick="clicked('addNewPersonButton')" id="addNewPersonButton" class="btn btn-dark rounded-pill">
                + Aggiungi Nuovo
            </button>
        </div>
        <div id="nameInputCard" class="d-none card-body justify-content-center ">
            <div class="form-group">
                <label for="" class="form-label">Nome:</label>
                <input class="form-control" type="text" placeholder="Inserisci un nome">
            </div>
        </div>
    </div>
    <div class="card card-custom">
        <div class="card-body py-4 d-flex justify-content-center">
        </div>
    </div>
</div>

`
function clicked(item) {
    console.log(item)
}
function out(item) {
    item.classList.add("d-flex")
    item.classList.remove("d-none")
}
document.getElementsByTagName("body")[0].insertBefore(appContainer,
    document.getElementsByTagName("body")[0].firstChild)


    document.querySelector("#loneScript").remove(); */