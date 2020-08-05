firebaseConfig = {
apiKey: "AIzaSyAyPpwYB1X-e5VnUkUgJ2orPcDr9ybDHEU",
authDomain: "draggable-9f92b.firebaseapp.com",
databaseURL: "https://draggable-9f92b.firebaseio.com",
projectId: "draggable-9f92b",
storageBucket: "draggable-9f92b.appspot.com",
messagingSenderId: "1010593277055",
appId: "1:1010593277055:web:1b729dc7368b8f6f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("firebase loaded");
var countDownDate = new Date("Aug 21, 2020 00:00:00").getTime();var x = setInterval(function() {var now = new Date().getTime();var distance = countDownDate - now;var days = Math.floor(distance / (1000 * 60 * 60 * 24));var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));var seconds = Math.floor((distance % (1000 * 60)) / 1000);document.getElementById("demo").innerHTML = "- "+days + " giorni " + hours + " ore "+ minutes + " minuti e " + seconds + " secondi alla partenza! <i class='fa fa-smile'></i>";if (distance < 0) {clearInterval(x);document.getElementById("demo").innerHTML = "00:00:00";}}, 1000);function send(name,desc) { 
var d = new Date(),myname = "";
myname=name+"_"+d.getDay()+d.getHours()+d.getMinutes();
firebase.database().ref("db/toscana/"+myname).set({descrizione: desc,});
eval("document.getElementById('"+name+"_thanks').classList.remove('d-none');");
eval("document.getElementById('"+name+"_send').classList.add('disabled');");
eval("document.getElementById('"+name+"_send').innerText = 'Fatto';");

};
$(".notification").tooltip("show");$(".tooltip-inner").append('<br><a href="#section6">Vedi prenotazioni</a>');$(".tooltip-inner").on("click",()=>{$(".notification").tooltip("hide");});$("#bell").on("click",()=>{$(".tooltip-inner").append('<br><a href="#section6">Vedi prenotazioni</a>');});$(function () {$('[data-toggle="tooltip"]').tooltip()})