import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { GamesComponent } from './feature/games/games.component';
import { GameComponent } from './feature/game/game.component';
import { BaseComponent } from './feature/base/base.component';

const routes: Routes = [
  // redirect vecchie rotte se vuoi mantenere compatibilità
  { path: 'scopa', redirectTo: 'game/scopa', pathMatch: 'full' },
  { path: 'uno', redirectTo: 'game/uno', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'games', component: GamesComponent, canActivate: [AuthGuard] },
  {
    path: 'game/:gameName',
    component: BaseComponent
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
