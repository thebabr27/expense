import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet,],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  topMenu = [
    { label: 'Notizie', route: '/home' },
    { label: 'Trasferimenti', route: '/market' }, 
    { label: 'Calendario', route: '/calendar' },
    { label: 'Indietro', route: '/back', yellow: true }]
  bottomMenu = [
    { label: 'Tattiche', route: '/tactics' },
    { label: 'Allenamento', route: '/training' },
    { label: 'Ultima Partita', route: '/last-match' },
    { label: 'Classifica', route: '/ranking' },
    { label: 'Storia', route: '/history' }]

  players = [
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

  roleMap = {
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
  

  ngOnInit(): void {
    this.renderRoster();
  }

  renderRoster() {
    const container = document.querySelector(".squad-roster");
    if (container) {
      container.innerHTML = ""; 

      this.players.forEach(p => {
        const fitClass = this.getFitColor(p);
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


  getFitColor(player:any) {
    const diff = Math.abs(
      ((this.roleMap as any)[(player as any).role] ?? 0) -
      ((this.roleMap as any)[(player as any).position] ?? 0)
    );

    // 5 livelli:

    if (diff === 0) return "fit-5"; // verde pieno
    if (diff === 1) return "fit-4"; // verde chiaro
    if (diff === 2) return "fit-3"; // giallo-verde
    if (diff === 3) return "fit-2"; // giallo
    return "fit-1";                 // rosso
  }

}
