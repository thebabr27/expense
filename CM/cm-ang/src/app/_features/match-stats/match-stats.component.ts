import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';

@Component({
  selector: 'app-match-stats',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet,],
  templateUrl: './match-stats.component.html',
  styleUrl: './match-stats.component.css'
})
export class MatchStatsComponent {
  topMenu = [
    { label: 'Notizie', route: '/home' },
    { label: 'Trasferimenti', route: '/market' },
    { label: 'Rosa', route: '/team' },
    { label: 'Indietro', route: '/back', yellow: true }]
  bottomMenu = [
    { label: 'Statistiche squadre', route: '/team-stats' },
    { label: 'Statistiche giocatore', route: '/player-stats' },
    { label: 'Statistiche arbitri', route: '/referee-stats' },
    { label: 'Premi', route: '/prizes', yellow: true },
    { label: 'Storia', route: '/history', yellow: true }]
  matchStats = [

    {
      label: 'Tiri in porta',
      home: 14,
      away: 6
    },

    {
      label: 'Tiri nello specchio',
      home: 7,
      away: 4
    },

    {
      label: 'Possesso palla',
      home: 58,
      away: 42,
      suffix: '%'
    },

    {
      label: 'Precisione passaggi',
      home: 91,
      away: 82,
      suffix: '%'
    },

    {
      label: 'Falli',
      home: 9,
      away: 11
    },

    {
      label: 'Calci d’angolo',
      home: 8,
      away: 3
    }

  ];
}
