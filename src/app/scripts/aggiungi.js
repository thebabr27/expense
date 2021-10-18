const addPersonConfirmButton = document.getElementById("addPersonConfirmButton");
const inputNewPerson = document.getElementById("inputNewPerson");
const addPersonConfirmSpinner = addPersonConfirmButton.querySelector(".spinner-border");
const appContainer = document.querySelector(".app-container");
const appWrapper = document.querySelector(".app-wrapper");
inputNewPerson.focus();

addPersonConfirmButton.addEventListener("click",()=>{
    console.log(inputNewPerson.value);
    inputNewPerson.value = fixName(inputNewPerson.value)
    addPersonConfirmSpinner.classList.remove("d-none")
        setTimeout(()=>{
            addPersonConfirmSpinner.classList.add("d-none")
            appWrapper.classList.add('animate__animated')
            appWrapper.classList.add('animate__bounceOutLeft')
            let list = [];
            if (localStorage.getItem("lista")) {
                list = JSON.parse(localStorage.getItem("lista"));
            }
            list.push(inputNewPerson.value)
            localStorage.setItem("lista",JSON.stringify(list))
            setTimeout(()=>{
                window.location.href = "./persone.html"
            },700)
            
        },700)
})

inputNewPerson.addEventListener("keydown",(e)=>{
    if (e.key=='Enter') {
        addPersonConfirmButton.click();
    }
})

function fixName(name) {
    return name.slice(0,1).toUpperCase()+ name.slice(1,name.length).toLowerCase();
}