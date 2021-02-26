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
console.log("database service loaded");
const auth = firebase.auth();loginButton.addEventListener("click", e => {const email = inputEmail.value;const pass = inputPassword.value;const promise = auth.signInWithEmailAndPassword(email,pass);if(validateInput("inputEmail")){document.getElementById("loginSpin").classList.toggle("d-none");
setTimeout(function(){document.getElementById("loginSpin").classList.toggle("d-none");
},3000);

}console.log('AHA');promise.catch(e => console.log("err"));});logoutButton.addEventListener("click", e => {firebase.auth().signOut();});firebase.auth().onAuthStateChanged(firebaseUser => {if (firebaseUser) {document.getElementById("loginGroup").classList.toggle("d-none");
document.getElementById("logoutGroup").classList.toggle("d-none");

} else {		document.getElementById("logoutGroup").classList.add("d-none");
document.getElementById("loginGroup").classList.remove("d-none");

}});function validateInput(theInput) { 
return true;

};
const update = document.getElementById('update');const send = document.getElementById('send');const name = document.getElementById('name');const confirmName = document.getElementById('confirmName');const enter_spinner = document.getElementById('enter_spinner');const message = document.getElementById('message');var myVar = setInterval(()=>{ updateChat()}, 1000);var allchats = [], dbupdates = [], allupdates = [], todayschat = [],actualchat = [];confirmName.addEventListener("click", ()=>{var names_list = ["mario","luigi"];if(name.value.length < 1){undefined
alertInputInvalid("name","insert_name");
console.log("inserire un nome...");
} else if(names_list.indexOf(name.value)>=0){undefined
alertInputInvalid("name","exist_name");
} else {undefined
document.getElementById("enter_spinner").classList.remove("d-none");
name.value = name.value.slice(0,1).toUpperCase() + name.value.slice(1,name.value.length);
console.log(name.value);
enterChat();
}});update.addEventListener("click", ()=>{updateChat();});send.addEventListener("click", ()=>{sendMessage();});function alertInputInvalid(item_id,alert_id) { 
document.getElementById(item_id).setAttribute("style","border:3px solid #FF44CC");
document.getElementById(item_id).classList.add("shadow");
document.getElementById(alert_id).classList.remove("d-none");
setTimeout(( ) => {
	document.getElementById(alert_id).classList.add("d-none");

}, 2000);


};
function enterChat() { 
setTimeout(( ) => {
	document.getElementById("name").setAttribute("style","border:none");
document.getElementById("name").classList.remove("shadow");
document.getElementById("welcome").setAttribute("style","opacity:0;width:100%; height:100vh");
document.getElementById("app").classList.remove("d-none");

}, 600);

setTimeout(( ) => {
	document.getElementById("welcome").classList.add("d-none");
document.getElementById("app").setAttribute("style","opacity:1;width:100%; height:100vh");
firstLoad();

}, 1400);


};
function messageName() { 
var date = new Date();
var hrs = date.getHours(), mins = date.getMinutes(), sec = date.getSeconds();
if(date.getHours()<10){var hrs = "0"+hrs;
}
if(date.getMinutes()<10){var mins = "0"+mins;
}
if(date.getSeconds()<10){var sec = "0"+sec;
}
var text = "_"+hrs+"_"+mins+"_"+sec+"_"+name.value;
return text;

};
function sendMessage() { 
console.log(allupdates);
if(message.value.length<1){undefined
alertInputInvalid("message","insert_text");
} else {undefined
document.getElementById("message").setAttribute("style","border:none");
eval("var obj = { text:'"+message.value+"'};");
firebase.database().ref("/chat/_20210225/updates/"+messageName())
.set(obj);
document.getElementById("message").value="";
}

};
function updateChat() { 
firebase.database().ref('/chat/_20210225/messages')
.once('value').then(function(snapshot) {
try {
dbmessages = snapshot.val();
} catch(err) {
};});
firebase.database().ref('/chat/_20210225/updates')
.once('value').then(function(snapshot) {
try {
dbupdates = snapshot.val();var keys = Object.keys(dbupdates);eval("console.log()");var pathMessage="", actualchat=[],theName = "", theHrs = "", theMins = "";for (var i=0; i<keys.length;i++) {
	theName = keys[i].split("_")[4],theHrs = keys[i].split("_")[1],theMins = keys[i].split("_")[2];
console.log(theName, theHrs, theMins);
eval('actualchat.push("h"+theHrs+":"+theMins+" - "+theName+": "+dbupdates.'+keys[i]+'.text)');
pathMessage = keys[i];
eval("var obj = {	text: dbupdates."+keys[i]+".text	}");
firebase.database().ref("/chat/_20210225/messages/"+pathMessage)
.set(obj);
firebase.database().ref("/chat/_20210225/updates/"+pathMessage).remove();

}var text = "";for (var i=0; i<actualchat.length;i++) {
	theName = actualchat[i].split("- ")[1].split(":")[0];
if(theName == name.value){text+= "<div class=' w-100'><div class=' bg-light fit-content rounded shadow  py-3 px-4 mb-2'><p class=' d-flex m-0'>"+actualchat[i]+"</p></div></div>";
} else {text+= "<div class=' w-100 d-flex justify-content-end'><div class=' bg-light fit-content  rounded shadow  py-3 px-4 mb-2'><p class=' d-flex m-0'>"+actualchat[i]+"</p></div></div>";
}

}	document.getElementById("main").insertAdjacentHTML('beforeend', text);

} catch(err) {
};});

};
function firstLoad() { 
firebase.database().ref('/chat/_20210225/messages')
.once('value').then(function(snapshot) {
try {
allchats = snapshot.val();var keys = Object.keys(allchats);var actualchat=[],theName = "", theHrs = "", theMins = "";for (var i=0; i<keys.length;i++) {
	theName = keys[i].split("_")[4],theHrs = keys[i].split("_")[1],theMins = keys[i].split("_")[2];
eval('actualchat.push("h"+theHrs+":"+theMins+" - "+theName+": "+allchats.'+keys[i]+'.text)');

}var text = "";for (var i=0; i<actualchat.length;i++) {
	theName = actualchat[i].split("- ")[1].split(":")[0];
if(theName == name.value){text+= "<div class=' w-100'><div class=' bg-light fit-content rounded shadow  py-3 px-4 mb-2'><p class=' d-flex m-0'>"+actualchat[i]+"</p></div></div>";
} else {text+= "<div class=' w-100 d-flex justify-content-end'><div class=' bg-light fit-content  rounded shadow  py-3 px-4 mb-2'><p class=' d-flex m-0'>"+actualchat[i]+"</p></div></div>";
}

}	document.getElementById('main').innerHTML = "<div class=' w-100 h-100 d-flex  justify-content-center'  style='margin-top:25%''><div class=' spinner-border '  role='status'><span class=' sr-only'>Loading...</span></div></div>";
setTimeout(( ) => {
		document.getElementById('main').innerHTML = text;


}, 200);

} catch(err) {
};});

};
