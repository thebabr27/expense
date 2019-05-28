document.getElementById("customerData").innerHTML =
localStorage.nominativo + ", " + localStorage.indirizzo + ", " +
localStorage.citta; + ", " + localStorage.cap;

document.getElementById("item1Name").innerHTML = localStorage.prodotto;
document.getElementById("item1Amount").innerHTML = "€"+"5.00";
document.getElementById("rideAmount").innerHTML = "€"+"1.00";
document.getElementById("totalAmount").innerHTML = "€"+"6.00";

function done () {

  window.location.href = "done_FARMAZONE_APP_BS.html";
}
