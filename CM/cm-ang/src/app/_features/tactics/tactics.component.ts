import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';

@Component({
  selector: 'app-tactics',
  standalone: true,
    imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
      RouterOutlet,],
  templateUrl: './tactics.component.html',
  styleUrl: './tactics.component.css'
})
export class TacticsComponent {

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

}
