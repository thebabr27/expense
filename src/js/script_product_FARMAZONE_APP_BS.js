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
  ]

createElenco();

function createElenco() {
  var elenco = "";
  var somma = 0;
  for (var i = 0; i < items.length; i++) {
    //aggiunta dei prodotti
    elenco+='<div class="row">\r'+
      '<div class="col">\r'+
        '<!-- CARD PRODOTTO -->\r'+
        '<div class="card mb-3">\r'+
          '<div class="productdiv">\r'+
            '<img src="src\\img\\bg\\'+(items[i][3])+'.jpg" class="card-img-top" alt="...">\r'+
            '<h2 class="">€'+(items[i][2]).toFixed(2)+'</h2>\r'+
          '</div>\r'+
            '<div class="card-body">\r'+
              '<h5 class="card-title">'+(items[i][1])+'</h5>\r'+
              '<p class="card-text">'+(items[i][4])+" - "+(items[i][5])+'</p>\r'+
            '</div>\r'+
          '\r'+
            '<div class="infodiv">\r'+
              '<div class="row">\r'+
                '<div class="col">\r'+
                  '<button onclick="selezioneFarmaco(this, '+i+')" type="button" class="btn btn-info btn-lg btn-block">\r'+
                  '<i class="fa fa-shopping-cart"></i>\r'+
                    'Aggiungi al carrello</button>\r'+
                  '</div>\r'+
              '</div>\r'+
            '</div>\r'+
          '</div>\r'+
      '</div> <!-- end col -->\r'+
      '</div> <!-- end row -->\r'+
    '<br><br>';
    somma+=(items[i][2]);
  }
  document.getElementById("products").innerHTML = elenco;
}

var carrello = [];

var thisdiv;
function selezioneFarmaco (thisdiv, b) {
  carrello.push(b);
alert(carrello);
};

function sceltaFarmaco () {
  localStorage.carrello = carrello;
  window.location.href = "address_FARMAZONE_APP_BS.html";
}
