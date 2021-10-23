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
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const enter = document.getElementById("enter");
  const h1 = document.getElementsByTagName("h1")[0];

  loginButton.addEventListener("click", e => {
      const email = inputEmail.value;
      const pass = inputPassword.value;
      const promise = auth.signInWithEmailAndPassword(email,pass);
      
      promise.catch(e => console.log("err"));
  });
  
  logoutButton.addEventListener("click", e => {
  firebase.auth().signOut();
      
  });
  enter.addEventListener("click", e => {
      setTimeout(e=>{
        window.location.href = "./aggiungi.html"
      },500)
  })
  firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				console.log("logged in");
                h1.classList.remove("d-none")
                inputEmail.classList.add("d-none")
                inputPassword.classList.add("d-none")
                loginButton.classList.add("d-none")
                enter.classList.remove("d-none")
                logoutButton.classList.remove("d-none")
				} else {
                    h1.classList.add("d-none")
                    inputEmail.classList.remove("d-none")
                    inputPassword.classList.remove("d-none")
                    loginButton.classList.remove("d-none")
                    enter.classList.add("d-none")
                    logoutButton.classList.add("d-none")
                }
            })