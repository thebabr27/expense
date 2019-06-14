var inputProduct;

function restart() {
    window.location.href = "index.html";
}

function sceltaFarmacia (inputFarm) {
  localStorage.farmacia = inputFarm.value;
  window.location.href = "checkout_FARMAZONE_APP_BS.html";

}

function datiCliente (inputName, inputSurname, inputEmail, inputInd, inputCap, inputCit, inputPhone) {
  localStorage.nominativo = inputName.value + " " + inputSurname.value;
  localStorage.indirizzo = inputInd.value + " " + inputCap.value + " " + inputCit.value;
  window.location.href = "selectpharm_FARMAZONE_APP_BS.html";
}

function cercaFarmaci(a) {
  localStorage.cercato = a.value;
  window.location.href = "product_FARMAZONE_APP_BS.html";
}

function elencoFarmaci (inputProduct) {
  localStorage.prodotto = inputProduct.value;
  window.location.href = "product_FARMAZONE_APP_BS.html";
}

var carrello = [];

var thisdiv;
function selezioneFarmaco (thisdiv, b) {
  carrello.push(b);

};

function sceltaFarmaco () {
  localStorage.carrello = carrello;
  window.location.href = "address_FARMAZONE_APP_BS.html";
}
