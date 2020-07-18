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
function send(name,desc) { 
var d = new Date(),myname = "";
myname=name+"_"+d.getDay()+d.getHours()+d.getMinutes();
firebase.database().ref("db/toscana/"+myname).set({descrizione: desc,});
eval("document.getElementById('"+name+"_thanks').classList.remove('d-none');");
eval("document.getElementById('"+name+"_send').classList.add('disabled');");
eval("document.getElementById('"+name+"_send').innerText = 'Fatto';");

};
