import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../_shared/shared/shared.module';
import { BottomNavLayoutComponent } from '../../_shared/layout/bottom-nav-layout/bottom-nav-layout.component';
import { PageLayoutComponent } from '../../_shared/layout/page-layout/page-layout.component';
import { TopNavLayoutComponent } from '../../_shared/layout/top-nav-layout/top-nav-layout.component';
import { EmptyListComponent } from '../../_shared/empty-list/empty-list.component';

import {
  Competition,
  CompetitionPhase,
  EditorService
} from '../../_services/editor.service';

export interface CompetitionForm {

  fullName: string;

  shortName: string;

  colors: {

    c1: string;

    c2: string;

    c3: string;

  };

  phases: CompetitionPhase[];

}

@Component({
  selector: 'app-edit-competitions',
  standalone: true,
  imports: [
    SharedModule,
    TopNavLayoutComponent,
    BottomNavLayoutComponent,
    PageLayoutComponent,
    EmptyListComponent
  ],
  templateUrl: './edit-competitions.component.html',
  styleUrl: './edit-competitions.component.css'
})
export class EditCompetitionsComponent implements OnInit {

  /*
  ------------------------
  TOP MENU
  ------------------------
  */

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
      label: 'Indietro',
      route: '/back',
      yellow: true
    }

  ];

  /*
  ------------------------
  DATA
  ------------------------
  */

  competitions: Competition[] = [];

  showForm = false;

  showPhaseForm = false;

  editingCompetitionId:
    string | null = null;

  editingPhaseIndex:
    number | null = null;

  /*
  ------------------------
  COMPETITION FORM
  ------------------------
  */

  form: CompetitionForm = {

    fullName: '',

    shortName: '',

    colors: {

      c1: '#111111',

      c2: '#ffffff',

      c3: '#ffcc00'

    },

    phases: []

  };

  /*
  ------------------------
  PHASE FORM
  ------------------------
  */

  phaseForm: CompetitionPhase = {

    id: '',

    name: '',

    type: 'league',

    teamsCount: null,

    rounds: false,

    matchdays: null,

    startDate: '',

    endDate: '',

    generateCalendar: true,

    points: {

      win: null,

      draw: null,

      loss: null

    },

    knockoutTeamsLeft: null

  };

  constructor(
    private editorService:
      EditorService
  ) { }

  /*
  ------------------------
  INIT
  ------------------------
  */

  ngOnInit(): void {

    this.editorService
      .competitions$
      .subscribe(data => {

        this.competitions = data;

      });

    this.editorService
      .loadCompetitions();

  }

  /*
  ------------------------
  OPEN COMPETITION FORM
  ------------------------
  */

  openForm() {

    this.resetForm();

    this.editingCompetitionId = null;

    this.showForm = true;

  }

  /*
  ------------------------
  CLOSE COMPETITION FORM
  ------------------------
  */

  closeForm() {

    this.showForm = false;

    this.editingCompetitionId = null;

    this.closePhaseForm();

    this.resetForm();

  }

  /*
  ------------------------
  RESET COMPETITION FORM
  ------------------------
  */

  resetForm() {

    this.form = {

      fullName: '',

      shortName: '',

      colors: {

        c1: '#111111',

        c2: '#ffffff',

        c3: '#ffcc00'

      },

      phases: []

    };

  }

  /*
  ------------------------
  OPEN PHASE FORM
  ------------------------
  */

  openPhaseForm() {

    this.editingPhaseIndex = null;

    this.phaseForm = {

      id: crypto.randomUUID(),

      name: '',

      type: 'league',

      teamsCount: null,

      rounds: false,

      matchdays: null,

      startDate: '',

      endDate: '',

      generateCalendar: true,

      points: {

        win: null,

        draw: null,

        loss: null

      },

      knockoutTeamsLeft: null

    };

    this.showPhaseForm = true;

  }

  /*
  ------------------------
  CLOSE PHASE FORM
  ------------------------
  */

  closePhaseForm() {

    this.showPhaseForm = false;

    this.editingPhaseIndex = null;

  }

  /*
  ------------------------
  SAVE PHASE
  ------------------------
  */

  savePhase() {

    if (
      !this.phaseForm.name.trim()
    ) return;

    if (
      this.editingPhaseIndex !== null
    ) {

      this.form.phases[
        this.editingPhaseIndex
      ] = {

        ...this.phaseForm

      };

    }

    else {

      this.form.phases.push({

        ...this.phaseForm

      });

    }

    this.closePhaseForm();

  }

  /*
  ------------------------
  EDIT PHASE
  ------------------------
  */

  editPhase(
    phase: CompetitionPhase,
    index: number
  ) {

    this.editingPhaseIndex = index;

    const safePhase: CompetitionPhase = {

      ...phase,

      rounds:
        typeof phase.rounds === 'boolean'
          ? phase.rounds
          : false,

      points: phase.points ?? {

        win: null,
        draw: null,
        loss: null

      }

    };

    this.phaseForm = JSON.parse(
      JSON.stringify(safePhase)
    );

    this.showPhaseForm = true;

  }

  /*
  ------------------------
  REMOVE PHASE
  ------------------------
  */

  removePhase(index: number) {

    this.form.phases.splice(
      index,
      1
    );

  }

  /*
  ------------------------
  SAVE COMPETITION
  ------------------------
  */

  async saveCompetition() {

    if (
      !this.form.fullName.trim()
    ) return;

    const payload: Competition = {

      fullName:
        this.form.fullName,

      shortName:
        this.form.shortName,

      colors: {

        ...this.form.colors

      },

      phases:
        this.form.phases,

      createdAt:
        Date.now()

    };

    if (
      this.editingCompetitionId
    ) {

      await this.editorService
        .updateCompetition(

          this.editingCompetitionId,

          payload

        );

    }

    else {

      await this.editorService
        .addCompetition(
          payload
        );

    }

    this.closeForm();

  }

  /*
  ------------------------
  EDIT COMPETITION
  ------------------------
  */

  editCompetition(
    competition: Competition
  ) {

    this.editingCompetitionId =
      competition.id || null;

    this.form = {

      fullName:
        competition.fullName,

      shortName:
        competition.shortName,

      colors: {

        ...competition.colors

      },

      phases:
        competition.phases
          ? JSON.parse(
            JSON.stringify(
              competition.phases
            )
          )
          : []

    };

    this.showForm = true;

  }

  /*
  ------------------------
  GET PHASE TYPE LABEL
  ------------------------
  */

  getPhaseTypeLabel(
    type: string
  ): string {

    switch (type) {

      case 'league':
        return 'Campionato';

      case 'cup':
        return 'Coppa';

      case 'knockout':
        return 'Knockout';

      default:
        return '';

    }

  }

}