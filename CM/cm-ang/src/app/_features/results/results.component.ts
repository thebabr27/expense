import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';

interface Match {

  home: string;
  away: string;

  homeGoals: number | null;
  awayGoals: number | null;

  status: 'live' | 'halftime' | 'finished' | 'scheduled';
  date?: string;

  minute?: number;

  kickoff?: string;
}
@Component({
  selector: 'app-results',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet,],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit, AfterViewInit {
  @ViewChild('resultsList') resultsList!: ElementRef;
  @ViewChild('matchdayTitle') matchdayTitle!: ElementRef;
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
  matchdays: {
    title: string;
    matches: Match[];
    date?: string;
  }[] = [

      {
        title: "31ª Giornata - Serie A",
  date: "12 Maggio 2026",

        matches: [

          {
            home: "Inter",
            away: "Roma",

            homeGoals: 2,
            awayGoals: 2,

            status: 'finished'
          },

          {
            home: "Napoli",
            away: "Milan",

            homeGoals: 1,
            awayGoals: 3,

            status: 'finished'
          },

          {
            home: "Juventus",
            away: "Torino",

            homeGoals: 0,
            awayGoals: 0,

            status: 'finished'
          },

          {
            home: "Bologna",
            away: "Lazio",

            homeGoals: 2,
            awayGoals: 1,

            status: 'finished'
          },

          {
            home: "Empoli",
            away: "Genoa",

            homeGoals: 1,
            awayGoals: 1,

            status: 'finished'
          }

        ]
      },

      {
        title: "32ª Giornata - Serie A",
  date: "12 Maggio 2026",

        matches: [

          {
            home: "Milan",
            away: "Inter",

            homeGoals: 2,
            awayGoals: 1,

            status: 'finished'
          },

          {
            home: "Juventus",
            away: "Napoli",

            homeGoals: 1,
            awayGoals: 1,

            status: 'finished'
          },

          {
            home: "Roma",
            away: "Lazio",

            homeGoals: 3,
            awayGoals: 0,

            status: 'finished'
          },

          {
            home: "Atalanta",
            away: "Fiorentina",

            homeGoals: 2,
            awayGoals: 2,

            status: 'live',

            minute: 67
          },

          {
            home: "Torino",
            away: "Bologna",

            homeGoals: 0,
            awayGoals: 1,

            status: 'halftime'
          }

        ]
      },

      {
        title: "33ª Giornata - Serie A",
  date: "12 Maggio 2026",

        matches: [

          {
            home: "Milan",
            away: "Juventus",

            homeGoals: null,
            awayGoals: null,

            status: 'scheduled',

            kickoff: '20:45'
          },

          {
            home: "Napoli",
            away: "Roma",

            homeGoals: null,
            awayGoals: null,

            status: 'scheduled',

            kickoff: '18:00'
          },

          {
            home: "Inter",
            away: "Atalanta",

            homeGoals: null,
            awayGoals: null,

            status: 'scheduled',

            kickoff: '15:00'
          },

          {
            home: "Lazio",
            away: "Torino",

            homeGoals: null,
            awayGoals: null,

            status: 'scheduled',

            kickoff: '12:30'
          },

          {
            home: "Bologna",
            away: "Fiorentina",

            homeGoals: null,
            awayGoals: null,

            status: 'scheduled',

            kickoff: '20:45'
          }

        ]
      }

    ];

  currentMatchday = 1;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.renderMatchday()

  }


  renderMatchday() {

    const current = this.matchdays[this.currentMatchday];

    this.matchdayTitle.nativeElement.textContent = current.title;

    this.resultsList.nativeElement.innerHTML = "";

    current.matches.forEach(match => {

      this.resultsList.nativeElement.innerHTML += `
      <div class="result-row">
        <div class="team home">${match.home}</div>
        <div class="score-box">${match.homeGoals} - ${match.awayGoals}</div>
        <div class="team away">${match.away}</div>
      </div>
    `;

    });

  }

  prevMatchday() {

    if (this.currentMatchday > 0) {

      this.currentMatchday--;

      this.renderMatchday();

    }

  }

  nextMatchday() {

    if (this.currentMatchday < this.matchdays.length - 1) {

      this.currentMatchday++;

      this.renderMatchday();

    }

  }
}
