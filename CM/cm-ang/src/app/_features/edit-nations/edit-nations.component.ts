import { Component } from '@angular/core';
import { SharedModule } from '../../_shared/shared/shared.module';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { EmptyListComponent } from '../../_shared/empty-list/empty-list.component';
import { EditorService } from '../../_services/editor.service';

@Component({
  selector: 'app-edit-nations',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent, EmptyListComponent],
  templateUrl: './edit-nations.component.html',
  styleUrl: './edit-nations.component.css'
})
export class EditNationsComponent {
  nations: any[] = [];
  topMenu = [

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
  newNation = '';


  constructor(
    private editorService: EditorService
  ) {}

  ngOnInit(): void {

    this.editorService
      .nations$
      .subscribe(data => {

        this.nations = data;

      });

    this.editorService.loadNations();

  }

  async addNation() {

    const value =
      this.newNation.trim();

    if (!value) return;

    await this.editorService
      .addNation(value);

    this.newNation = '';

  }

  async deleteNation(id?: string) {

    if (!id) return;

    await this.editorService
      .deleteNation(id);

  }

}