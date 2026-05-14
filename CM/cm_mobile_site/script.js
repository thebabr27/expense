const players = [
  {
    num: 1,
    name: "Alisson Becker",
    cap: "",
    role: "gk",
    position: "gk",
    nation: "br",
    cond: 100,
    roles: [
      { name: "gk", skill: 99 }
    ]
  },
  {
    num: 5,
    name: "Theo Hernández",
    cap: "",
    role: "lb",
    position: "lw",
    nation: "fr",
    cond: 99,
    roles: [
      { name: "lb", skill: 90 },
      { name: "lwb", skill: 85 },
      { name: "lw", skill: 60 }
    ]
  },
  {
    num: 9,
    name: "Paulo Dybala",
    cap: "",
    role: "rw",
    position: "cam",
    nation: "ar",
    cond: 92,
    roles: [
      { name: "cam", skill: 92 },
      { name: "rw", skill: 88 },
      { name: "st", skill: 80 }
    ]
  }
];

const roleMap = {
  gk: 0,

  lb: 1,
  cb: 2,
  rb: 1,

  lcb: 2,
  rcb: 2,

  dm: 3,
  cm: 4,
  lcm: 4,
  rcm: 4,

  cam: 5,
  lw: 6,
  rw: 6,

  st: 7
};

function getFitColor(player) {
  const diff = Math.abs(
    (roleMap[player.role] ?? 0) -
    (roleMap[player.position] ?? 0)
  );

  // 5 livelli:

  if (diff === 0) return "fit-5"; // verde pieno
  if (diff === 1) return "fit-4"; // verde chiaro
  if (diff === 2) return "fit-3"; // giallo-verde
  if (diff === 3) return "fit-2"; // giallo
  return "fit-1";                 // rosso
}
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.boxShadow = '0 0 15px #003cff';
    setTimeout(() => {
      btn.style.boxShadow = 'none';
    }, 180);
  });
});

function renderRoster() {
  const container = document.querySelector(".squad-roster");
  if (container) {
    container.innerHTML = "";

    container.innerHTML += `
    <div class="roster-header">
      <div>Num</div>
      <div>Nome</div>
      <div>Cap</div>
      <div>Ruolo</div>
      <div>Naz</div>
      <div>Cond</div>
    </div>
  `;

    players.forEach(p => {
      const fitClass = getFitColor(p);
      container.innerHTML += `
      <div class="roster-row">

        <div class="col num">
          <div class="shirt-number">${p.num}</div>
        </div>

        <div class="col name">${p.name}</div>

        <div class="col cap">${p.cap}</div>

        <div class="col role">
        <div class="role-box ${fitClass}">
            <span class="area-left"></span>
            <span class="area-center"></span>
            <span class="area-right"></span>
            <span class="area-midcircle"></span>
            <div class="role-dot ${p.role}"></div>
          </div>
        </div>

        <div class="col nation">
          <div class="flag ${p.nation}"></div>
        </div>

        <div class="col cond">${p.cond}%</div>

      </div>
    `;
    });
  }
}

renderRoster();

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