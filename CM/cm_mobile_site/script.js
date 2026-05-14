
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.boxShadow = '0 0 15px #003cff';
    setTimeout(() => {
      btn.style.boxShadow = 'none';
    }, 180);
  });
});

function startCareer() {

  localStorage.setItem("career", "roma");

  window.location.href = "home.html";

}

function goToPlayerName() {
  window.location.href = "player-name.html";
}

function goToTeam() {
  window.location.href = "team.html";
}

function goToHome() {
  window.location.href = "home.html";
}