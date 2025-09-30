import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/core/service/alert.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('nicknameInput') nicknameInput!: ElementRef;
  gameForm!: FormGroup;
  nickname: string = '';
  people: any[] = [];
  minPlayers: number = 4;   // numero minimo per abilitare Start
  maxPlayers: number = 4;

  constructor(private fb: FormBuilder,
    private alertService: AlertService,
  private route: ActivatedRoute) { }

  ngOnInit(): void {
    
  const gameNameFromRoute = this.route.snapshot.data['gameName'] || 'uno';
   
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
  
  ngAfterViewInit(): void {
    // Focus automatico
    this.nicknameInput.nativeElement.focus();
  }

  onHover(el: any) {
    console.log(el)
  }

  getCardBackground(card: any): any {
    const gameName = this.gameForm.get('gameName')?.value?.toLowerCase();

    if (gameName === 'scopa') {
      // Sfondo bianco per tutte le carte di Scopa
      return { 'deck-white': true };
    }

    // Logica UNO
    return {
      'deck-red': card.color === 'Rosso' && this.isCardPlayable(card),
      'deck-green': card.color === 'Verde' && this.isCardPlayable(card),
      'deck-blue': card.color === 'Blu' && this.isCardPlayable(card),
      'deck-yellow': card.color === 'Giallo' && this.isCardPlayable(card),
      'deck-wild': !card.suit && !card.color && this.isCardPlayable(card),
      'deck-red-disabled': card.color === 'Rosso' && !this.isCardPlayable(card),
      'deck-green-disabled': card.color === 'Verde' && !this.isCardPlayable(card),
      'deck-blue-disabled': card.color === 'Blu' && !this.isCardPlayable(card),
      'deck-yellow-disabled': card.color === 'Giallo' && !this.isCardPlayable(card),
      'deck-wild-disabled': !card.color && !this.isCardPlayable(card),
    };
  }


  getCardCenterClass(card: any): string {
    const gameName = this.gameForm.get('gameName')?.value?.toLowerCase();

    if (gameName === 'uno') {
      return card.type ? `uno-${card.type}` : '';
    }

    if (gameName === 'scopa' && card.suit && card.rank) {
      // restituisce seme + classe valore
      console.log(
        `${card.suit.toLowerCase()} ${card.suit.toLowerCase()}-${card.rank.toLowerCase()}`
      )
      return `${card.suit.toLowerCase()} ${card.suit.toLowerCase()}-${card.rank.toLowerCase()}`;
    }

    return '';
  }


  getMyUserDeck() {

    // Recupera userName dal form
    const userName = this.gameForm.get('userName')?.value;
    // Trova il mazzo del giocatore con quel nome
    const userDeck = (this.gameForm.get('users')?.value).find((u: any) => u.name === userName)?.deck;
    return userDeck
  }

  calculateMargin(index: number, length: number): string {
    if (!length) return '0px';
    const middle = Math.floor(length / 2);
    const offset = 30; // pixel di spostamento per carta

    if (index < middle) {
      return `-${(middle - index) * offset}px`; // carte a sinistra
    } else if (index > middle) {
      return `${(index - middle) * offset}px`;  // carte a destra
    } else {
      return '0px'; // carta centrale
    }
  }

  calculateMarginForDeckContainer(deckLength: number): string {
    if (!deckLength || deckLength <= 1) return '0px';

    const middleIndex = Math.floor(deckLength / 2); // indice della carta di mezzo
    const offset = 30; // pixel di sovrapposizione tra carte

    // sposta il container a sinistra del numero di carte prima della centrale
    const margin = -middleIndex * offset;
    return `${margin}px`;
  }

  addPlayer() {
    if (!this.nickname.trim()) return;

    const users = this.gameForm.get('users')?.value || [];
    const formattedName =
      this.nickname.trim().charAt(0).toUpperCase() + this.nickname.trim().slice(1).toLowerCase();

    const newPlayer = {
      name: formattedName,
      deck: [],
      played: false,
      drawed: false,
      playerType: 'human'
    };

    this.people.push(newPlayer);
    this.gameForm.patchValue({ users: [...users, newPlayer], phase: 'waiting-room' });
    this.nickname = '';
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

  async root() {
    if ((this.gameForm.get('users')?.value?.length || 0) < this.minPlayers) return;

    const gameName = this.gameForm.get('gameName')?.value;
    if (!gameName) {
      console.error('Errore: nessun gioco selezionato!');
      return;
    }
    let mainDeck: any[] = [];
    let cardsPerPlayer = 5;

    // Crea mazzo in base al gioco
    switch (gameName) {
      default: console.log(gameName)
    }
    if (gameName.toLowerCase() === 'uno') {
      mainDeck = await this.createUnoDeck();
      cardsPerPlayer = 7;
    } else if (gameName.toLowerCase() === 'scopa') {
      mainDeck = this.createScopaDeck();
      cardsPerPlayer = 3;
    }

    if (!mainDeck || mainDeck.length === 0) {
      console.error('Errore: mazzo non creato!');
      return;
    }

    console.log(`Mazzo principale pronto: ${mainDeck.length} carte`);

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

    console.log(`Gioco "${gameName}" iniziato, carte distribuite:`, this.gameForm.get('users')?.value);
  }

  // Mischia un array di carte
  shuffleDeck(deck: any[]): any[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // Crea mazzo UNO
  private createUnoDeck(): any[] {
    const colors = ['Rosso', 'Verde', 'Blu', 'Giallo'];
    const deck: any[] = [];

    for (const color of colors) {
      // Carta 0
      deck.push({ color, name: `0 ${color}`, value: 0 });

      // Due copie di 1-9
      for (let num = 1; num <= 9; num++) {
        deck.push({ color, name: `${num} ${color}`, value: num });
        deck.push({ color, name: `${num} ${color}`, value: num });
      }

      // Carte azione: due copie per tipo
      const actions = ['draw-two', 'Reverse', 'Skip'];
      for (const action of actions) {
        deck.push({ color, name: `${action} ${color}`, type: action.toLowerCase() });
        deck.push({ color, name: `${action} ${color}`, type: action.toLowerCase() });
      }
    }

    // Carte jolly (senza colore)
    for (let i = 0; i < 4; i++) {
      deck.push({ name: 'Wild', type: 'wild' });
      deck.push({ name: 'Wild +4', type: 'wild-draw-four' });
    }

    console.log(`Mazzo UNO creato: ${deck.length} carte`);
    return deck;
  }

  // Crea mazzo Scopa
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

  startGame() {
    const users = this.gameForm.get('users')?.value || [];
    if (users.length >= this.minPlayers) {
      this.gameForm.patchValue({ phase: 'start-waiting' });
      this.root()
    }
  }
  // Sposta una o più carte da un mazzo a un altro
  moveCards(deckFrom: any[], deckTo: any[], cardIndices: number[] = []): any[] {
    if (!deckFrom || !deckTo) return deckFrom;
    const cardsToMove: any[] = [];

    if (cardIndices.length === 0) {
      const card = deckFrom.pop();
      if (card) cardsToMove.push(card);
    } else {
      cardIndices.sort((a, b) => b - a).forEach(i => {
        if (i >= 0 && i < deckFrom.length) {
          cardsToMove.push(deckFrom.splice(i, 1)[0]);
        }
      });
    }

    deckTo.push(...cardsToMove);
    return cardsToMove;
  }

  // Sposta una carta specifica dal giocatore al centro
  // Sposta una carta specifica dal giocatore al mazzo centrale
  moveCardToCenterDeck(cardIndex: number, playerName?: string) {
    const users = this.gameForm.get('users')?.value || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    const name = playerName || this.gameForm.get('userName')?.value;
    const player = users.find((u: any) => u.name === name);

    if (!player || !player.deck || cardIndex >= player.deck.length) return;

    // Preleva la carta scelta dal mazzo del giocatore
    const playedCard = player.deck.splice(cardIndex, 1)[0];
    if (!playedCard) return;

    // Aggiorna il currentColor se serve (per UNO)
    if (this.gameForm.get('gameName')?.value?.toLowerCase() === 'uno') {
      if (playedCard.color) {
        this.gameForm.patchValue({ currentColor: playedCard.color });
      }
    }

    // ✅ Aggiungi la carta al mazzo centrale (NON al mainDeck)
    centerDeck.push(playedCard);

    // Aggiorna il form con il nuovo stato
    this.gameForm.patchValue({ users, centerDeck });

    // Mostra alert
    this.alertService.triggerAlert(
      'info',
      `${name} ha giocato: ${playedCard.name}`,
      'check-circle'
    );
  }


  // Pesca una carta dal mazzo principale o dal mazzo specificato
  playerDrawCard(userName?: string, count: number = 1, fromDeckName: string = 'mainDeck') {
    const deck = this.gameForm.get(fromDeckName)?.value || [];
    const users = this.gameForm.get('users')?.value || [];
    const name = userName || this.gameForm.get('userName')?.value;
    const player = users.find((u: any) => u.name === name);

    if (!player || !deck || deck.length === 0) return;

    const drawnCards: any[] = [];
    for (let i = 0; i < count && deck.length > 0; i++) {
      drawnCards.push(deck.shift());
    }

    player.deck.push(...drawnCards);
    this.gameForm.patchValue({ users, [fromDeckName]: deck });

    if (drawnCards.length > 0) {
      this.alertService.triggerAlert(
        'warning',
        `${name} pesca ${drawnCards.length} carte${count > 1 ? 's' : ''}: ${drawnCards.map(c => c.name).join(', ')}`,
        'exclamation-circle'
      );
    }

    return drawnCards;
  }

  // Controlla se una carta è giocabile
  isCardPlayable(card: any, topCard?: any): boolean {
    const gameName = this.gameForm.get('gameName')?.value?.toLowerCase();
    if (!card) return false;

    // ✅ Se il centro è vuoto, qualsiasi carta è giocabile
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    if (centerDeck.length === 0) {
      return true;
    }

    if (gameName === 'uno') {
      let currentColor = this.gameForm.get('currentColor')?.value;
      if (!currentColor && topCard?.color) currentColor = topCard.color;

      const playable =
        !card.color ||
        card.color === currentColor ||
        ['wild', 'wild-draw-four'].includes(card.type);

      return playable;
    }

    if (gameName === 'scopa') return true;

    return true;
  }

}
