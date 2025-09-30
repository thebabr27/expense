// game.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ScopaService } from 'src/app/core/service/scopa.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameForm!: FormGroup;
  nickname: string = '';
  people: any[] = [];
  minPlayers: number = 4;
  maxPlayers: number = 4;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private scopaService: ScopaService
  ) { }

  ngOnInit(): void {
    const gameNameFromRoute = this.route.snapshot.params['gameName'] 
    console.log(this.route.snapshot.params['gameName'] )

    this.gameForm = this.fb.group({
      gameName: [gameNameFromRoute],
      phase: ['player-input'],
      users: [[]],
      peopleInTurn: [''],
      mainDeck: [[]],
      centerDeck: [[]],
      userName: ['Mimmo'],
      currentColor: [''],
      direction: [1]
    });
  }

  /*** 👇 LOGICA COMUNE ***/

  addPlayer() {
    if (!this.nickname.trim()) return;

    const users = this.gameForm.get('users')?.value || [];
    const formattedName =
      this.nickname.trim().charAt(0).toUpperCase() +
      this.nickname.trim().slice(1).toLowerCase();

    const newPlayer = {
      name: formattedName,
      deck: [],
      played: false,
      drawed: false,
      playerType: 'human'
    };

    this.people.push(newPlayer);
    this.gameForm.patchValue({
      users: [...users, newPlayer],
      phase: 'waiting-room'
    });
    this.nickname = '';

    // 🔹 Salvataggio su DB
    this.scopaService.saveForm(this.gameForm.value);
  }

  addBots() {
    const users = this.gameForm.get('users')?.value || [];
    const missing = this.minPlayers - users.length;

    const cpuPlayers = Array.from({ length: missing }).map((_, i) => ({
      name: `CPU ${i + 1}`,
      deck: [],
      played: false,
      drawed: false,
      playerType: 'cpu'
    }));

    this.gameForm.patchValue({ users: [...users, ...cpuPlayers] });
  }

  startGame() {
    const users = this.gameForm.get('users')?.value || [];
    if (users.length >= this.minPlayers) {
      this.gameForm.patchValue({ phase: 'start-waiting' });
      this.root();
    }
  }

  async root() {
    if ((this.gameForm.get('users')?.value?.length || 0) < this.minPlayers) return;

    const gameName = this.gameForm.get('gameName')?.value;
    let mainDeck: any[] = [];
    let cardsPerPlayer = 5;

    if (gameName.toLowerCase() === 'uno') {
      mainDeck = this.createUnoDeck();
      cardsPerPlayer = 7;
    } else if (gameName.toLowerCase() === 'scopa') {
      mainDeck = this.createScopaDeck();
      cardsPerPlayer = 3;
    }

    mainDeck = this.shuffleDeck([...mainDeck]);

    this.gameForm.patchValue({
      users: (this.gameForm.get('users')?.value || []).map((player: any) => {
        const playerDeck: any[] = [];
        for (let i = 0; i < cardsPerPlayer; i++) {
          const card = mainDeck.shift();
          if (card) playerDeck.push(card);
        }
        return { ...player, deck: playerDeck };
      }),
      mainDeck,
      phase: 'start-playing'
    });
  }

  shuffleDeck(deck: any[]): any[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private createUnoDeck(): any[] {
    const colors = ['Rosso', 'Verde', 'Blu', 'Giallo'];
    const deck: any[] = [];

    for (const color of colors) {
      deck.push({ color, name: `0 ${color}`, value: 0 });
      for (let num = 1; num <= 9; num++) {
        deck.push({ color, name: `${num} ${color}`, value: num });
        deck.push({ color, name: `${num} ${color}`, value: num });
      }
      const actions = ['draw-two', 'Reverse', 'Skip'];
      for (const action of actions) {
        deck.push({ color, name: `${action} ${color}`, type: action.toLowerCase() });
        deck.push({ color, name: `${action} ${color}`, type: action.toLowerCase() });
      }
    }

    for (let i = 0; i < 4; i++) {
      deck.push({ name: 'Wild', type: 'wild' });
      deck.push({ name: 'Wild +4', type: 'wild-draw-four' });
    }

    return deck;
  }

  private createScopaDeck(): any[] {
    const suits = ['Coppe', 'Denari', 'Spade', 'Bastoni'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', 'Fante', 'Cavallo', 'Re'];
    const deck: any[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ name: `${rank} di ${suit}`, suit, rank });
      }
    }
    return deck;
  }
}
