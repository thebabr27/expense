import { Component } from '@angular/core';
import { SharedModule } from '../../_shared/shared/shared.module';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, PageLayoutComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
topMenu = [

  {
    label: 'Nazioni',
    route: '/edit-nations'
  },

    {
      label: 'Squadre',
      route: '/edit-teams'
    },

    {
      label: 'Giocatori',
      route: '/edit-players'
    },

    {
      label: 'Competizioni',
      route: '/edit-competitions'
    },
    { label: 'Indietro', route: '/back', yellow: true }

];
}
