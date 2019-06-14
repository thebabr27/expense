var items = [
  ["Tachipirina 1000", "Bustine 20g", 5.49],
  ["Okitask", "Bustine 10g", 4.5],
  ["Vivin C", "Compresse", 6.69],
  ["Aspirina C", "Compresse", 5.99],
]

alert(localStorage.carrello);
createElenco();

function createElenco() {
  var elenco = "";
  var somma = 0;
  for (var i = 0; i < items.length; i++) {
    //aggiunta dei prodotti
    elenco+='<li class="list-group-item d-flex justify-content-between lh-condensed">\r'+
      '<div>\r'+
        '<h6 class="my-0">'+items[i][0]+'</h6>\r'+
        '<small class="text-muted">'+items[i][1]+'</small>\r'+
      '</div>\r'+
      '<span class="text-muted">€'+(items[i][2]).toFixed(2)+'</span>\r'+
    '</li>\r'
    somma+=(items[i][2]);
  }
  //aggiunta del totale
  elenco+='<li class="list-group-item d-flex justify-content-between lh-condensed">\r'+
    '<span>Totale</span>\r'+
    '<strong>€'+somma+'</strong>\r'+
  '</li>\r'
  document.getElementById("itemsList").innerHTML = elenco;
  document.getElementById("itemsNum").innerHTML = items.length;
}

document.getElementById("customerData").innerHTML =
localStorage.nominativo + "<br>" +
localStorage.indirizzo;

document.getElementById("pharmacieData").innerHTML =
localStorage.farmacia;

function done () {

  window.location.href = "done_FARMAZONE_APP_BS.html";
}
