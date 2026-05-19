import { Component, OnInit } from '@angular/core';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';
import { EmptyListComponent } from '../../_shared/empty-list/empty-list.component';
import { Nation, EditorService, Team } from '../../_services/editor.service';
import { FullScreenModalService } from '../../_services/full-screen-modal.service';

@Component({
  selector: 'app-edit-teams',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent, EmptyListComponent],
  templateUrl: './edit-teams.component.html',
  styleUrl: './edit-teams.component.css'
})
export class EditTeamsComponent implements OnInit {

  topMenu = [

    {
      label: 'Nazioni',
      route: '/edit-nations'
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
  nations: Nation[] = [];

  teams: Team[] = [];

  form: Team = {

    fullName: '',

    shortName: '',

    nationId: '',

    home: {
      c1: '#111111',
      c2: '#ff0000',
      c3: '#ffffff'
    },

    away: {
      c1: '#ffffff',
      c2: '#dddddd',
      c3: '#111111'
    },

    third: {
      c1: '#222222',
      c2: '#ffcc00',
      c3: '#ffffff'
    }

  };

  showNationModal = false;

  selectedNationName = '';

  showForm = false;

  editingTeamId: string | null = null;

  constructor(
    private editorService: EditorService,
  private modal: FullScreenModalService
  ) { }

  ngOnInit(): void {

    this.editorService
      .nations$
      .subscribe(data => {

        this.nations = data;

      });

    this.editorService
      .teams$
      .subscribe(data => {

        this.teams = data;

      });

    this.editorService.loadNations();

    this.editorService.loadTeams();

  }
  
  getNationName(id: string): string {

    return this.nations.find(
      n => n.id === id
    )?.name || '';

  }

  async addTeam() {

    if (!this.form.fullName.trim()) return;

    if (this.editingTeamId) {

      await this.editorService.updateTeam(

        this.editingTeamId,

        this.form

      );

    }

    else {

      await this.editorService.addTeam(

        this.form

      );

    }

    this.resetForm();

    this.editingTeamId = null;

    this.showForm = false;

  }

  /*
  ------------------------
  EDIT
  ------------------------
  */

  editTeam(team: Team) {

    this.editingTeamId =
      team.id || null;

    this.form = {

      fullName: team.fullName,

      shortName: team.shortName,

      nationId: team.nationId,

      home: {
        ...team.home
      },

      away: {
        ...team.away
      },

      third: {
        ...team.third
      }

    };

    const nation =
      this.nations.find(
        n => n.id === team.nationId
      );

    this.selectedNationName =
      nation?.name || '';

    this.showForm = true;

  }

  /*
  ------------------------
  OPEN NATIONS MODAL
  ------------------------
  */

  openNationModal() {
    
    this.modal.open(

      'Seleziona Nazione',

      this.nations,

      (nation: Nation) => {

        this.form.nationId =
          nation.id || '';

        this.selectedNationName =
          nation.name;

      }

    );

  }

  /*
  ------------------------
  RESET
  ------------------------
  */

  resetForm() {

    this.form = {

      fullName: '',

      shortName: '',

      nationId: '',

      home: {
        c1: '#111111',
        c2: '#ff0000',
        c3: '#ffffff'
      },

      away: {
        c1: '#ffffff',
        c2: '#dddddd',
        c3: '#111111'
      },

      third: {
        c1: '#222222',
        c2: '#ffcc00',
        c3: '#ffffff'
      }

    };

    this.selectedNationName = '';

  }

  /*
  ------------------------
  CLOSE
  ------------------------
  */

  closeForm() {

    this.showForm = false;

    this.editingTeamId = null;

    this.resetForm();

  }
  selectNation(nation: Nation) {

    this.form.nationId =
      nation.id || '';

    this.selectedNationName =
      nation.name;

  }
}