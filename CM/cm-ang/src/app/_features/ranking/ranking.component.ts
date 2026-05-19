import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet,],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent implements OnInit {
  @ViewChild('ranking-list') rankingList!: ElementRef;
  topMenu = [
    { label: 'Notizie', route: '/home' },
    { label: 'Trasferimenti', route: '/market' },
    { label: 'Rosa', route: '/team' },
    { label: 'Indietro', route: '/back', yellow: true }]
  bottomMenu = [
    { label: 'Statistiche squadre', route: '/team-stats' },
    { label: 'Statistiche giocatore', route: '/player-stats' },
    { label: 'Statistiche arbitri', route: '/referee-stats' },
    { label: 'Premi', route: '/prizes' , yellow: true},
    { label: 'Storia', route: '/history' , yellow: true}]

  rankingTeams = [

    {
      team: "Milan",
      played: 32,
      wins: 24,
      draws: 5,
      losses: 3,
      goalsFor: 68,
      goalsAgainst: 25,
      points: 77
    },

    {
      team: "Inter",
      played: 32,
      wins: 22,
      draws: 6,
      losses: 4,
      goalsFor: 63,
      goalsAgainst: 28,
      points: 72
    },

    {
      team: "Juventus",
      played: 32,
      wins: 20,
      draws: 7,
      losses: 5,
      goalsFor: 58,
      goalsAgainst: 30,
      points: 67
    },

    {
      team: "Napoli",
      played: 32,
      wins: 19,
      draws: 8,
      losses: 5,
      goalsFor: 61,
      goalsAgainst: 35,
      points: 65
    },

    {
      team: "Roma",
      played: 32,
      wins: 17,
      draws: 8,
      losses: 7,
      goalsFor: 52,
      goalsAgainst: 37,
      points: 59
    },

    {
      team: "Lazio",
      played: 32,
      wins: 16,
      draws: 7,
      losses: 9,
      goalsFor: 49,
      goalsAgainst: 39,
      points: 55
    },

    {
      team: "Torino",
      played: 32,
      wins: 14,
      draws: 9,
      losses: 9,
      goalsFor: 44,
      goalsAgainst: 40,
      points: 51
    },

    {
      team: "Atalanta",
      played: 32,
      wins: 14,
      draws: 8,
      losses: 10,
      goalsFor: 48,
      goalsAgainst: 43,
      points: 50
    },

    {
      team: "Fiorentina",
      played: 32,
      wins: 13,
      draws: 8,
      losses: 11,
      goalsFor: 45,
      goalsAgainst: 44,
      points: 47
    },

    {
      team: "Bologna",
      played: 32,
      wins: 12,
      draws: 10,
      losses: 10,
      goalsFor: 42,
      goalsAgainst: 41,
      points: 46
    },

    {
      team: "Udinese",
      played: 32,
      wins: 11,
      draws: 10,
      losses: 11,
      goalsFor: 38,
      goalsAgainst: 40,
      points: 43
    },

    {
      team: "Genoa",
      played: 32,
      wins: 11,
      draws: 8,
      losses: 13,
      goalsFor: 37,
      goalsAgainst: 45,
      points: 41
    },

    {
      team: "Sassuolo",
      played: 32,
      wins: 10,
      draws: 9,
      losses: 13,
      goalsFor: 41,
      goalsAgainst: 50,
      points: 39
    },

    {
      team: "Monza",
      played: 32,
      wins: 10,
      draws: 8,
      losses: 14,
      goalsFor: 36,
      goalsAgainst: 46,
      points: 38
    },

    {
      team: "Lecce",
      played: 32,
      wins: 9,
      draws: 9,
      losses: 14,
      goalsFor: 33,
      goalsAgainst: 47,
      points: 36
    },

    {
      team: "Cagliari",
      played: 32,
      wins: 8,
      draws: 10,
      losses: 14,
      goalsFor: 31,
      goalsAgainst: 49,
      points: 34
    },

    {
      team: "Verona",
      played: 32,
      wins: 8,
      draws: 8,
      losses: 16,
      goalsFor: 29,
      goalsAgainst: 52,
      points: 32
    },

    {
      team: "Empoli",
      played: 32,
      wins: 7,
      draws: 8,
      losses: 17,
      goalsFor: 27,
      goalsAgainst: 55,
      points: 29
    },

    {
      team: "Salernitana",
      played: 32,
      wins: 5,
      draws: 9,
      losses: 18,
      goalsFor: 25,
      goalsAgainst: 60,
      points: 24
    },

    {
      team: "Frosinone",
      played: 32,
      wins: 4,
      draws: 8,
      losses: 20,
      goalsFor: 22,
      goalsAgainst: 64,
      points: 20
    }

  ];

  rankingHTML = ""

  ngOnInit(): void { 
    this.rankingTeams.forEach((club, index) => {

      let zoneClass = "";

      if (index <= 3) {
        zoneClass = "champions";
      }
      else if (index <= 5) {
        zoneClass = "europa";
      }
      else if (index === 6) {
        zoneClass = "conference";
      }
      else if (index >= this.rankingTeams.length - 3) {
        zoneClass = "relegation";
      }  
        this.rankingHTML += `
            
                <div class="league-row ${zoneClass}">

                    <div class="rank-zone"></div>

                    <div class="club">
                        <span class="club-name">
                            ${club.team}
                        </span>
                    </div>

                    <div>${club.played}</div>
                    <div>${club.wins}</div>
                    <div>${club.draws}</div>
                    <div>${club.losses}</div>
                    <div>${club.goalsFor}</div>
                    <div>${club.goalsAgainst}</div>

                    <div class="points-box">
                        ${club.points}
                    </div>

                </div>

            `; 
 
    });

  }
}
