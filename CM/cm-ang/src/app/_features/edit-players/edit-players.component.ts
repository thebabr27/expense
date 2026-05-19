import { Component, OnInit } from '@angular/core';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { SharedModule } from '../../_shared/shared/shared.module';
import { EmptyListComponent } from '../../_shared/empty-list/empty-list.component';
import { EditorService, Nation, Player, Team } from '../../_services/editor.service';
import { FullScreenModalService } from '../../_services/full-screen-modal.service';
export interface PlayerForm {

  fullName: string;

  shirtName: string;

  fanNickname: string;

  birthDate: string;

  birthCity: string;

  nationId: string;

  teamId: string | null;

  loanTeamId: string | null;

  loanEndDate: string;

  favoriteTeamId: string | null;

}
@Component({
  selector: 'app-edit-players',
  standalone: true,
  imports: [SharedModule, TopNavLayoutComponent, BottomNavLayoutComponent, PageLayoutComponent,
    EmptyListComponent],
  templateUrl: './edit-players.component.html',
  styleUrl: './edit-players.component.css'
})
export class EditPlayersComponent implements OnInit {

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
      label: 'Competizioni',
      route: '/edit-competitions'
    },
    { label: 'Indietro', route: '/back', yellow: true }

  ];
  form: PlayerForm = {

    fullName: '',

    shirtName: '',

    fanNickname: '',

    birthDate: '',

    birthCity: '',

    nationId: '',

    teamId: null,

    loanTeamId: null,

    loanEndDate: '',

    favoriteTeamId: null

  };
  nations: Nation[] = [];

  teams: Team[] = [];

  players: PlayerForm[] = [];

  showForm = false;

  editingPlayerId: string | null = null;

  selectedNationName = '';

  selectedTeamName = '';

  selectedLoanTeamName = '';

  selectedFavoriteTeamName = '';

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

    this.editorService
      .players$
      .subscribe(data => {

        this.players = data;

      });

    this.editorService.loadNations();

    this.editorService.loadTeams();

    this.editorService.loadPlayers();

  }

  getTeamById(id: any) {
    return this.editorService.getTeamById(id);
  }

  getNationality(nationId: string): string {

    const nation =
      this.editorService.getNationById(nationId);

    return nation?.name || '';

  }

  getPlayerAge(birthDate: string): number {

    if (!birthDate) return 0;

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;

  }

  /*
  ------------------------
  OPEN NATION MODAL
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
  OPEN TEAM MODAL
  ------------------------
  */

  openTeamModal() {

    const items = [

      {
        id: null,
        fullName: 'Svincolato'
      },

      ...this.teams

    ];

    this.modal.open(

      'Seleziona Squadra',

      items,

      (team: any) => {

        this.form.teamId =
          team.id || null;

        this.selectedTeamName =
          team.fullName;

      },
      'fullName'

    );

  }

  /*
  ------------------------
  OPEN LOAN MODAL
  ------------------------
  */

  openLoanModal() {

    const items = [

      {
        id: null,
        fullName: 'Nessun prestito'
      },

      ...this.teams

    ];

    this.modal.open(

      'Squadra in Prestito',

      items,

      (team: any) => {

        this.form.loanTeamId =
          team.id || null;

        this.selectedLoanTeamName =
          team.fullName;

        /*
        reset data fine prestito
        */

        if (!team.id) {

          this.form.loanEndDate = '';

        }

      },
      'fullName'

    );

  }

  /*
  ------------------------
  OPEN FAVORITE TEAM MODAL
  ------------------------
  */

  openFavoriteModal() {

    const items = [

      {
        id: null,
        fullName: 'Nessuna'
      },

      ...this.teams

    ];

    this.modal.open(

      'Squadra del Cuore',

      items,

      (team: any) => {

        this.form.favoriteTeamId =
          team.id || null;

        this.selectedFavoriteTeamName =
          team.fullName;

      },
      'fullName'

    );

  }
  editPlayer(player: Player) {

    this.editingPlayerId =
      player.id || null;

    this.form = {

      fullName: player.fullName,

      shirtName: player.shirtName,

      fanNickname: player.fanNickname,

      birthDate: player.birthDate,

      birthCity: player.birthCity,

      nationId: player.nationId,

      teamId: player.teamId,

      loanTeamId: player.loanTeamId,

      loanEndDate: player.loanEndDate,

      favoriteTeamId: player.favoriteTeamId

    };

    /*
    ------------------------
    NAZIONE
    ------------------------
    */

    const nation =
      this.nations.find(
        n => n.id === player.nationId
      );

    this.selectedNationName =
      nation?.name || '';

    /*
    ------------------------
    SQUADRA
    ------------------------
    */

    const team =
      this.teams.find(
        t => t.id === player.teamId
      );

    this.selectedTeamName =
      team?.fullName || 'Svincolato';

    /*
    ------------------------
    PRESTITO
    ------------------------
    */

    const loanTeam =
      this.teams.find(
        t => t.id === player.loanTeamId
      );

    this.selectedLoanTeamName =
      loanTeam?.fullName || '';

    /*
    ------------------------
    SQUADRA DEL CUORE
    ------------------------
    */

    const favoriteTeam =
      this.teams.find(
        t => t.id === player.favoriteTeamId
      );

    this.selectedFavoriteTeamName =
      favoriteTeam?.fullName || 'Nessuna';

    /*
    ------------------------
    OPEN FORM
    ------------------------
    */

    this.showForm = true;

  }
  closeForm() {

    this.showForm = false;
    this.editingPlayerId = null;

    this.resetForm();

  }
  resetForm() {

    this.form = {

      fullName: '',

      shirtName: '',

      fanNickname: '',

      birthDate: '',

      birthCity: '',

      nationId: '',

      teamId: null,

      loanTeamId: null,

      loanEndDate: '',

      favoriteTeamId: null

    };

    this.selectedNationName = '';

    this.selectedTeamName = '';

    this.selectedLoanTeamName = '';

    this.selectedFavoriteTeamName = '';

  }
  async savePlayer() {

    if (
      !this.form.fullName.trim()
    ) return;

    if (this.editingPlayerId) {

      await this.editorService
        .updatePlayer(

          this.editingPlayerId,

          this.form

        );

    }

    else {

      await this.editorService
        .addPlayer(this.form);

    }

    this.resetForm();

    this.editingPlayerId = null;

    this.showForm = false;

  }


}
