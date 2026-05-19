import { Injectable } from '@angular/core';

import {
  Database,
  ref,
  push,
  set,
  get,
  remove,
  update
} from '@angular/fire/database';

import { BehaviorSubject } from 'rxjs';

export interface CompetitionPhase {

  id?: string;

  name: string;

  type:
    | 'league'
    | 'knockout';

  /*
  GENERIC
  */

  teamsCount: number | null;

  startDate: string;

  endDate: string;

  generateCalendar: boolean;

  /*
  LEAGUE + KNOCKOUT
  */

  rounds?: boolean;

  /*
  LEAGUE
  */

  matchdays?: number | null;

  points?: {

    win: number | null;

    draw: number | null;

    loss: number | null;

  };

  /*
  KNOCKOUT
  */

  knockoutTeamsLeft?: number | null;

}
export interface Competition {

  id?: string;

  fullName: string;

  shortName: string;

  colors: {

    c1: string;

    c2: string;

    c3: string;

  };

  phases: CompetitionPhase[];

  createdAt: number;

}
export interface Nation {

  id?: string;

  name: string;

  createdAt: number;

}
export interface Player {

  id?: string;

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
export interface Team {

  id?: string;

  fullName: string;

  shortName: string;

  nationId: string;

  home: {
    c1: string;
    c2: string;
    c3: string;
  };

  away: {
    c1: string;
    c2: string;
    c3: string;
  };

  third: {
    c1: string;
    c2: string;
    c3: string;
  };

}
@Injectable({
  providedIn: 'root'
})
export class EditorService {

  nations$ =
    new BehaviorSubject<Nation[]>([]);

  private teamsSubject =
    new BehaviorSubject<Team[]>([]);
  teams$ =
    this.teamsSubject.asObservable();

  private playersSubject =
    new BehaviorSubject<Player[]>([]);
  players$ =
    this.playersSubject.asObservable();

  private competitionsSubject =
    new BehaviorSubject<Competition[]>([]);
  competitions$ =
    this.competitionsSubject.asObservable();

  constructor(
    private db: Database
  ) { }
  /*
  ------------------------ 
  COMPETIZIONI 
  ------------------------
  */
  async loadCompetitions() {

    try {

      const competitionsRef =
        ref(this.db, 'cm/db/competitions');

      const snapshot =
        await get(competitionsRef);

      if (!snapshot.exists()) {

        this.competitionsSubject.next([]);

        return;

      }

      const data =
        snapshot.val();

      const competitions: Competition[] =
        Object.keys(data).map(key => ({

          id: key,

          ...data[key]

        }));

      competitions.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

      this.competitionsSubject.next(
        competitions
      );

    }

    catch (err) {

      console.error(
        'Errore load competitions',
        err
      );

    }

  }
  async addCompetition(
    competition: Competition
  ) {

    try {

      const competitionsRef =
        ref(this.db, 'cm/db/competitions');

      const newCompetitionRef =
        push(competitionsRef);

      await set(newCompetitionRef, {

        fullName: competition.fullName,

        shortName: competition.shortName,

        colors: competition.colors,

        phases: competition.phases || [],

        createdAt: Date.now()

      });

      await this.loadCompetitions();

    }

    catch (err) {

      console.error(
        'Errore add competition',
        err
      );

    }

  }
  async updateCompetition(
    id: string,
    competition: Competition
  ) {

    try {

      await update(

        ref(this.db, `cm/db/competitions/${id}`),

        {

          fullName: competition.fullName,

          shortName: competition.shortName,

          colors: competition.colors,

          phases: competition.phases

        }

      );

      await this.loadCompetitions();

    }

    catch (err) {

      console.error(
        'Errore update competition',
        err
      );

    }

  }
  async deleteCompetition(id: string) {

    try {

      await remove(

        ref(this.db,
          `cm/db/competitions/${id}`
        )

      );

      await this.loadCompetitions();

    }

    catch (err) {

      console.error(
        'Errore delete competition',
        err
      );

    }

  }
  getCompetitionById(
    id: string | null
  ): Competition | null {

    if (!id) return null;

    const competitions =
      this.competitionsSubject.getValue();

    return competitions.find(
      c => c.id === id
    ) || null;

  }
  getPhaseById(
    competitionId: string,
    phaseId: string
  ): CompetitionPhase | null {

    const competition =
      this.getCompetitionById(
        competitionId
      );

    if (!competition) return null;

    return competition.phases.find(
      p => p.id === phaseId
    ) || null;

  }
  generatePhaseId(): string {

    return crypto.randomUUID();

  }


  /*
  ------------------------
  NAZIONI
  ------------------------
  */
  getNationById(id: string | null): Nation | null {

    if (!id) return null;

    return this.nations$.getValue()
      .find(n => n.id === id) || null;

  }

  async loadNations() {

    try {

      const nationsRef =
        ref(this.db, 'cm/db/nations');

      const snapshot =
        await get(nationsRef);

      if (!snapshot.exists()) {

        this.nations$.next([]);

        return;

      }

      const data = snapshot.val();

      const nations: Nation[] =
        Object.keys(data).map(key => ({

          id: key,

          ...data[key]

        }));

      nations.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      this.nations$.next(nations);

    }

    catch (err) {

      console.error(
        'Errore load nations',
        err
      );

    }

  }

  async addNation(name: string) {

    try {

      const nationsRef =
        ref(this.db, 'cm/db/nations');

      const newNationRef =
        push(nationsRef);

      await set(newNationRef, {

        name,

        createdAt: Date.now()

      });

      await this.loadNations();

    }

    catch (err) {

      console.error(
        'Errore add nation',
        err
      );

    }

  }

  async deleteNation(id: string) {

    try {

      await remove(
        ref(this.db, `cm/db/nations/${id}`)
      );

      await this.loadNations();

    }

    catch (err) {

      console.error(
        'Errore delete nation',
        err
      );

    }

  }

  async updateNation(
    id: string,
    name: string
  ) {

    try {

      await update(

        ref(this.db, `cm/db/nations/${id}`),

        {
          name
        }

      );

      await this.loadNations();

    }

    catch (err) {

      console.error(
        'Errore update nation',
        err
      );

    }

  }/*
------------------------
SQUADRE
------------------------
*/

  getTeamById(id: string | null): Team | null {

    if (!id) return null;

    const teams = this.teamsSubject.getValue();

    return teams.find(t => t.id === id) || null;

  }

  async loadTeams() {

    const teamsRef =
      ref(this.db, 'cm/db/teams');

    const snapshot =
      await get(teamsRef);

    if (!snapshot.exists()) {

      this.teamsSubject.next([]);

      return;

    }

    const data =
      snapshot.val();

    const teams: Team[] =
      Object.keys(data).map(key => ({

        id: key,

        ...data[key]

      }));

    this.teamsSubject.next(teams);

  }

  async addTeam(team: Team) {

    const teamsRef =
      ref(this.db, 'cm/db/teams');

    const newTeamRef =
      push(teamsRef);

    await set(newTeamRef, {

      fullName: team.fullName,

      shortName: team.shortName,

      nationId: team.nationId,

      home: team.home,

      away: team.away,

      third: team.third

    });

    await this.loadTeams();

  }

  async deleteTeam(id: string) {

    await remove(

      ref(this.db, `cm/db/teams/${id}`)

    );

    await this.loadTeams();

  }

  async updateTeam(
    id: string,
    team: Team
  ) {

    try {

      await update(

        ref(this.db, `cm/db/teams/${id}`),

        {

          fullName: team.fullName,

          shortName: team.shortName,

          nationId: team.nationId,

          home: team.home,

          away: team.away,

          third: team.third

        }

      );

      await this.loadTeams();

    }

    catch (err) {

      console.error(
        'Errore update team',
        err
      );

    }

  }

  /*
------------------------
GIOCATORI
------------------------
*/
  async loadPlayers() {

    try {

      const playersRef =
        ref(this.db, 'cm/db/players');

      const snapshot =
        await get(playersRef);

      if (!snapshot.exists()) {

        this.playersSubject.next([]);

        return;

      }

      const data =
        snapshot.val();

      const players: Player[] =
        Object.keys(data).map(key => ({

          id: key,

          ...data[key]

        }));

      players.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

      this.playersSubject.next(players);

    }

    catch (err) {

      console.error(
        'Errore load players',
        err
      );

    }

  }

  async addPlayer(player: Player) {

    try {

      const playersRef =
        ref(this.db, 'cm/db/players');

      const newPlayerRef =
        push(playersRef);

      await set(newPlayerRef, {

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

      });

      await this.loadPlayers();

    }

    catch (err) {

      console.error(
        'Errore add player',
        err
      );

    }

  }

  async deletePlayer(id: string) {

    try {

      await remove(

        ref(this.db, `cm/db/players/${id}`)

      );

      await this.loadPlayers();

    }

    catch (err) {

      console.error(
        'Errore delete player',
        err
      );

    }

  }

  async updatePlayer(id: string, player: Player) {

    try {

      const payload = {
        fullName: player.fullName,
        shirtName: player.shirtName,
        fanNickname: player.fanNickname,
        birthDate: player.birthDate,
        birthCity: player.birthCity,
        nationId: player.nationId || null,
        teamId: player.teamId || null,
        loanTeamId: player.loanTeamId || null,
        loanEndDate: player.loanEndDate || null,
        favoriteTeamId: player.favoriteTeamId || null
      };

      console.log('UPDATE PLAYER PAYLOAD:', payload);

      await update(
        ref(this.db, `cm/db/players/${id}`),
        payload
      );

      await this.loadPlayers();

    }

    catch (err) {

      console.error('Errore update player', err);

    }
  }
}