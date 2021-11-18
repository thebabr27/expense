class Db {
    constructor() {
        this.initialize()
    }

    initialize() {
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
    }

    on(path,func) {
        firebase.database().ref(path).on('value',func) 
    }

    read(path,func) {
        firebase.database().ref(path).once('value').then(func)
    }
}
        
