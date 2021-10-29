class Db  {
    constructor() {}

    init() {
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
    }

    read(path) {
        return firebase.database().ref(path).once('value')
    }

    ifData(path,actions) {
        firebase.database().ref(path).once('value').then(
            snapshot=>{
                console.log(actions[0].action,actions[0].params)
                try {
                    setTimeout(e=>{
                        if (snapshot) {
                            actions[0].action(path)
                        } else {
                            console.log("no data")
                        }
                    },1000)
                }
                catch(err) {
                    console.log(err)
                }
            })
    }

    on(path) {
        firebase.database().ref(path).on('value',
            snapshot=>{
                try {
                    setTimeout(e=>snapshot.val(),1000)
                }
                catch(err) {

                }
            })
    }
    
}