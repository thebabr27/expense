import { Routes } from '@angular/router';
import { AlfaLoginComponent } from './_core/alfa-login/alfa-login.component';
import { HomeComponent } from './_features/home/home.component';
import { authGuard } from './_shared/auth.guard';
import { TeamComponent } from './_features/team/team.component';
import { CalendarComponent } from './_features/calendar/calendar.component';
import { ResultsComponent } from './_features/results/results.component';
import { RankingComponent } from './_features/ranking/ranking.component';
import { TacticsComponent } from './_features/tactics/tactics.component';
import { MatchComponent } from './_features/match/match.component';
import { MatchStatsComponent } from './_features/match-stats/match-stats.component';
import { EditorComponent } from './_features/editor/editor.component';
import { EditNationsComponent } from './_features/edit-nations/edit-nations.component';
import { EditCompetitionsComponent } from './_features/edit-competitions/edit-competitions.component';
import { EditTeamsComponent } from './_features/edit-teams/edit-teams.component';
import { EditPlayersComponent } from './_features/edit-players/edit-players.component';

export const routes: Routes = [

  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [authGuard]
  },

  {
    path: 'editor',
    component: EditorComponent,
    canActivate: [authGuard]
  },

  {
    path: 'edit-nations',
    component: EditNationsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'edit-competitions',
    component: EditCompetitionsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'edit-teams',
    component: EditTeamsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'edit-players',
    component: EditPlayersComponent,
    canActivate: [authGuard]
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  {
    path: 'match',
    component: MatchComponent,
    canActivate: [authGuard]
  },

  {
    path: 'match-stats',
    component: MatchStatsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'login',
    component: AlfaLoginComponent
  },

  {
    path: 'ranking',
    component: RankingComponent,
    canActivate: [authGuard]
  },

  {
    path: 'results',
    component: ResultsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'tactics',
    component: TacticsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'team',
    component: TeamComponent,
    canActivate: [authGuard]
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
