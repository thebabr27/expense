function restart() {
    window.location.href = "index_FARMAZONE_APP_BS.html";
}

function alertDatiFarm (inputFarm) {
  localStorage.farmacia = inputFarm.value;

  window.location.href = "checkout_FARMAZONE_APP_BS.html";

}

function alertDatiInd (inputNomin, inputInd, inputCit, inputCap) {
  localStorage.nominativo = inputNomin.value;
  localStorage.indirizzo = inputInd.value;
  localStorage.citta = inputCit.value;
  localStorage.cap = inputCap.value;
  window.location.href = "selectpharm_FARMAZONE_APP_BS.html";
}

function alertDatiProd (inputProduct) {
  localStorage.prodotto = inputProduct.value;
  window.location.href = "address_FARMAZONE_APP_BS.html";
}
