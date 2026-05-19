import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet,],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  topMenu = [
    { label: 'Notizie', route: '/home' },
    { label: 'Trasferimenti', route: '/market' }, 
    { label: 'Rosa', route: '/team' },
    { label: 'Indietro', route: '/back', yellow: true }]
  bottomMenu = [
    { label: 'Tattiche', route: '/tactics' },
    { label: 'Allenamento', route: '/training' },
    { label: 'Ultima Partita', route: '/last-match' },
    { label: 'Classifica', route: '/ranking' },
    { label: 'Storia', route: '/history' }]


  myTeam = "Milan";

  calendar = [
    { home: "Milan", away: "Inter", date: "G1", homeGoals: 2, awayGoals: 1 },
    { home: "Juventus", away: "Milan", date: "G2", homeGoals: 1, awayGoals: 1 },
    { home: "Milan", away: "Napoli", date: "G3", homeGoals: 3, awayGoals: 0 },
    { home: "Roma", away: "Milan", date: "G4", homeGoals: null, awayGoals: null },
    { home: "Milan", away: "Lazio", date: "G5", homeGoals: null, awayGoals: null }
  ];

  ngOnInit(): void {
   this.renderCalendar()
  }
  
  isPlayed(match:any) {
    return typeof match.homeGoals === "number" && typeof match.awayGoals === "number";
  }

  renderCalendar() {

    const list = document.getElementById("calendarList");
    if (list) {
    list.innerHTML = "";

    this.calendar.forEach(match => {

      const isHome = match.home === this.myTeam;
      const played = this.isPlayed(match);

      const result = played
        ? `${match.homeGoals} - ${match.awayGoals}`
        : "-";

      list.innerHTML += `
            <div class="calendar-row">

                <div class="calendar-date">
                    ${match.date}
                </div>

                <div class="calendar-icon">
                    <div class="fixture-icon ${isHome ? 'home' : 'away'}">
                        <div class="icon-part part-1"></div>
                        <div class="icon-part part-2"></div>
                        <div class="icon-part part-3"></div>
                    </div>
                </div>

                <div class="calendar-match">
                    ${match.home} vs ${match.away}
                </div>

                <div class="calendar-result ${played ? 'played' : 'future'}">
                    ${result}
                </div>

            </div>
        `;
    });
    }
  }

}
