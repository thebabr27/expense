var firebaseConfig = {
    apiKey: "AIzaSyAyPpwYB1X-e5VnUkUgJ2orPcDr9ybDHEU",
    authDomain: "draggable-9f92b.firebaseapp.com",
    databaseURL: "https://draggable-9f92b.firebaseio.com",
    projectId: "draggable-9f92b",
    storageBucket: "draggable-9f92b.appspot.com",
    messagingSenderId: "1010593277055",
    appId: "1:1010593277055:web:1b729dc7368b8f6f",
  };
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  console.log(firebase)
const container = document.getElementsByClassName("container")[0]
  firebase.database().ref("cardgame/people").once('value').then(function(snapshot) {
		try {
            let items = snapshot.val();
            let html=""; for (let i in items) {
                html+=`<button onclick="enterAs('${items[i].name}')">
                    <div class="card">
                        <div class="card-body">
                            ${items[i].name}
                        </div>
                    </div>
                </button>
                `
                }
                container.innerHTML = html;
        }
        catch(err) {

        }
    })

    function enterAs(name) {
        localStorage.setItem("user",name)
        console.log("entered as "+localStorage.getItem("user"))
        setTimeout(e=>{
            window.location.href = "./playasguest.html"
        },500)
    }

