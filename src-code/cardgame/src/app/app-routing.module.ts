import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { GamesComponent } from './feature/games/games.component';
import { DosComponent } from './feature/dos/dos.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'games', component: GamesComponent, canActivate: [AuthGuard] },
  { path: 'dos', component: DosComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' } // fallback
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
