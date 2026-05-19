import { Component } from '@angular/core';
import { SharedModule } from '../../_shared/shared/shared.module';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    RouterOutlet,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  topMenu = [
    { label: 'Squadra', route: '/team' },
    { label: 'Competizioni', route: '/competitions' },
    { label: 'Opzioni', route: '/options' },
    { label: 'Editor', route: '/editor' ,yellow:true},
    { label: 'Continua', route: '/continue' ,yellow:true}
  ];

  bottomMenu = [
    { label: 'Classifica', route: '/ranking' },
    { label: 'Risultati', route: '/results' },
    { label: 'Calendario', route: '/calendar' },
    { label: 'Board', route: '/board' },
    { label: 'Storia', route: '/history' }
  ];
}
