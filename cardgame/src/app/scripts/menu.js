const games = document.getElementById("games")
const utilities = document.getElementById("utilities")
const gamesIcon = document.getElementsByClassName("games-icon")[0]
const utilitiesIcon = document.getElementsByClassName("utilities-icon")[0]

utilities.addEventListener("click",e=>{
    utilitiesIcon.classList.add("utilities-icon-dark")
    utilitiesIcon.classList.remove("utilities-icon")
    utilities.setAttribute('border','3px solid #212121!important')
    utilities.querySelector('.card-footer').classList.remove('text-light')
    setTimeout(e=>{
        window.location.href = "./utilitiesmenu.html"
    },500)
})
games.addEventListener("click",e=>{
    gamesIcon.classList.add("games-icon-dark")
    gamesIcon.classList.remove("games-icon")
    games.setAttribute('border','3px solid #212121!important')
    games.querySelector('.card-footer').classList.remove('text-light')
    setTimeout(e=>{
        window.location.href = "./gamesmenu.html"
    },500)
})