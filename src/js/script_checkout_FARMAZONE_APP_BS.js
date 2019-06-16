var items = [
  ["Tachipirina 1000", "Bustine 20g", 5.49, 'tachipirina1000',
  '1000mg compresse ',
  'Trattamento sintomatico delle affezioni dolorose di ogni genere (ad esempio, mal di testa, mal di denti, torcicollo, dolori articolari e lombosacrali, dolori mestruali, piccoli interventi chirurgici).'],
  ["Okitask", "40mg 10 compresse", 4.69, 'oki1',
  'Ketoprofene Sale Di Lisina',
  'Dolori di diversa origine e natura, ed in particolare: mal di testa, mal di denti, nevralgie, dolori mestruali, dolori muscolari e osteoarticolari.'],
  ["Vivin C", "530mg 20 compresse effervescenti", 5.99, 'vivin-c',
  'Acido acetilsalicilico 0,330g, acido ascorbico 0,200g.',
  'Mal di testa e di denti, nevralgie, dolori mestruali, dolori reumatici e muscolari. Terapia sintomatica degli stati febbrili e delle sindrom i influenzali e da raffreddamento.'],
  ["Aspirina C", "500mg 10 compresse", 4.73, 'aspirina1',
  'Acido acetilsalicilico e derivati.',
  'Trattamento sintomatico di mal di testa e di dent i, nevralgie, dolori mestruali, dolori reumatici e muscolari.'],
  ["Tipo di consegna scelta", "Express", 3.50, '',
  '',''],
  ]

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
    '<strong>€'+somma.toFixed(2)+'</strong>\r'+
  '</li>\r'
  document.getElementById("itemsList").innerHTML = elenco;
  document.getElementById("itemsNum").innerHTML = (items.length)-1;
}

document.getElementById("customerData").innerHTML =
localStorage.nominativo + "<br>" +
localStorage.indirizzo;

document.getElementById("pharmacieData").innerHTML =
localStorage.farmacia;

function done () {

  window.location.href = "done_FARMAZONE_APP_BS.html";
}
