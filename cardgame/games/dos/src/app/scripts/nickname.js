const enterWithNicknameButton = document.getElementById("enterWithNickname");
const inputNickname = document.getElementById("inputNickname");
const invalidFeedbacks = document.getElementsByClassName('invalid-feedback')
const form = document.getElementsByClassName('form-group')[0]
const loading = document.getElementById('loading')
const appContainer = document.getElementById('app-container')
const db = new Db()
let data,loadedData=[];
let names = []
db.read('/cardgame/people',snapshot=>{
    data = snapshot.val()
    form.classList.remove("d-none")
    enterWithNicknameButton.classList.remove("d-none")
    loading.classList.add("d-none")
    loading.classList.remove("d-flex")
    appContainer.classList.remove("d-none")
    appContainer.classList.add("d-flex")

    for (let i in data) {
        loadedData.push(data[i])
        names.push(data[i].name.toUpperCase())
    }
})
enterWithNicknameButton.addEventListener("click",e=>{
    if(checkNickname()) {
        loadedData.push({
            name: inputNickname.value
            , role: "player"
        })
        db.write('/cardgame/people',loadedData)
        setTimeout(e=>{
            window.location.href = "./waitingroom.html"
        },500)
    }
})
inputNickname.addEventListener("keyup",e=>{
    if (e.key=='Enter'
        || e.code=='Enter') {
       enterWithNicknameButton.click()
    } else {
        invalidFeedbacks[0].setAttribute("style","display:none")
        invalidFeedbacks[1].setAttribute("style","display:none")
    }
})

function checkNickname() {
    var regex = /^[A-Za-z0-9 ]+$/
 
        //Validate TextBox value against the Regex.
        var isValid = regex.test(inputNickname.value);
        if (!isValid) {
                invalidFeedbacks[0].setAttribute("style","display:flex");
                return false
        } else {
            if (names.indexOf(inputNickname.value.toUpperCase())>-1) {
                invalidFeedbacks[1].setAttribute("style","display:flex")
                return false
            } else {
                return true
            }
        }
}