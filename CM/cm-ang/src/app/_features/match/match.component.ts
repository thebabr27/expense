import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';
import { TeamsNavLayoutComponent } from '../../_shared/layout/teams-nav-layout/teams-nav-layout.component';
import { CommentaryComponent } from '../../_shared/commentary/commentary.component';
import { MomentumComponent } from '../../_shared/momentum/momentum.component';
import { MatchInfoComponent } from '../../_shared/match-info/match-info.component';

export interface Team {
  name: string;
  shortName: string;
  colors: {
    main: string;
    second: string;
    third: string;
  };
  goals: number;
}
export interface MatchEvent {
  team: Team | null;
  player: string;
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'action';
  text?: string;
}
interface MatchRow {
  home: MatchEvent | null;
  away: MatchEvent | null;
}
export interface CommentaryEvent {
  player: string;
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'action';
  team: Team | null;
  text?: string;
}

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet, TeamsNavLayoutComponent, CommentaryComponent, MomentumComponent, MatchInfoComponent],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent implements OnInit {

  topMenu = [
    { label: 'Rosa', route: '/team' },
    { label: 'Statistiche partita', route: '/match-stats' },
    { label: 'Azioni', route: '/match-actions' },
    { label: 'Cronaca', route: '/full-commentary', yellow: true }]
  bottomMenu = [
    { label: 'Statistiche squadre', route: '/team-stats' },
    { label: 'Statistiche giocatore', route: '/player-stats' },
    { label: 'Statistiche arbitri', route: '/referee-stats' },
    { label: 'Premi', route: '/prizes', yellow: true },
    { label: 'Storia', route: '/history', yellow: true }]

  teams: Team[] = [

    {
      name: 'AC Milan',
      shortName: 'Milan',

      colors: {
        main: '#111',
        second: 'red',
        third: '#FFF'
      },

      goals: 0
    },

    {
      name: 'AS Roma',
      shortName: 'Roma',

      colors: {
        main: 'red',
        second: 'orange',
        third: '#000'
      },

      goals: 1
    }

  ];
  matchEvents: MatchEvent[] = [
    {
      team: this.teams[1],
      player: 'Mancini',
      minute: 18,
      type: 'goal',
      text: 'Gol della Roma!!!'
    },
    {
      team: this.teams[0],
      player: 'Maignan',
      minute: 22,
      type: 'action',
      text: 'Rinvio lungo del portiere'
    },
    {
      team: null,
      player: '',
      minute: 30,
      type: 'action',
      text: 'Il gioco ristagna a centrocampo'
    }
  ];

  matchRows: MatchRow[] = [];

  commentary: CommentaryEvent[] = [];

  ngOnInit(): void {

    this.buildMatchRows();
    this.commentary = this.matchEvents.filter(e => e.type !== null);

  }


  buildMatchRows() {

    const homeEvents = this.matchEvents.filter(
      e => e.team !== null && e.team.shortName === this.teams[0].shortName
    );
    const awayEvents = this.matchEvents.filter(
      e => e.team !== null && e.team.shortName === this.teams[1].shortName
    );

    const maxRows = Math.max(
      homeEvents.length,
      awayEvents.length
    );

    this.matchRows = [];

    for (let i = 0; i < maxRows; i++) {

      this.matchRows.push({

        home: homeEvents[i] || null,

        away: awayEvents[i] || null

      });

    }

  }
}
