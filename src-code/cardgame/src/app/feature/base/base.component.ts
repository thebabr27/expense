import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/core/service/alert.service';
import { ScopaService } from 'src/app/core/service/scopa.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('modalTrigger', { static: false }) modalTrigger!: ElementRef<HTMLElement>;
  @ViewChild('nicknameInput') nicknameInput!: ElementRef;
  gameForm!: FormGroup;
  nickname: string = '';
  people: any[] = [];
  minPlayers: number = 4;   // numero minimo per abilitare Start
  maxPlayers: number = 4;
  hoveredCard: any = null;// Carte attualmente selezionate dall'utente
  selectedCaptureCards: any[] = [];
  hasSelectableCards: boolean = false;
  selectedFirst: any[] = [];
  selectedSecond: any[] = [];
  playedCard: any;

  // Carte del centro che l'utente può effettivamente prendere
  validCaptureCards: any[] = [];


  constructor(private fb: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private scopaService: ScopaService) { }

  ngOnInit(): void {

    const gameNameFromRoute = this.route.snapshot.params['gameName'];
    if (!gameNameFromRoute) {
      // Mostra toast / alert
      this.alertService.triggerAlert(
        'warning',
        'Nessun gioco selezionato! Verrai reindirizzato.',
        'exclamation-circle'
      ); return
    }
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


  onHover(card: any) {
    this.hoveredCard = card; // carta in primo piano
  }

  onLeave() {
    this.hoveredCard = null; // reset z-index
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
      return `${card.suit.toLowerCase()} ${card.suit.toLowerCase()}-${card.rank.toLowerCase()}`;
    }

    return '';
  }

  getCardIndexInDeck(card: any): number {
    const users: any = this.gameForm.get('users')?.value || [];
    const currentUserName = this.gameForm.get('userName')?.value;
    const player: any = users.find((u: any) => u.name === currentUserName);
    if (!player || !player.deck) return -1;
    return player.deck.findIndex((c: any) => c === card);
  }

  action(action: string, card: any, i?: number) {
    const users: any = this.gameForm.get('users')?.value || [];
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];
    const currentUserName = this.gameForm.get('userName')?.value;
    const gameName: string = this.gameForm.get('gameName')?.value?.toLowerCase();
    const player: any = users.find((u: any) => u.name === currentUserName);
    const cardIndex = this.getCardIndexInDeck(card); 

    if (!player || !player.deck || cardIndex >= player.deck.length) return;

    switch (action) {
      case 'humanSelectCard':
        if (gameName !== 'scopa') {
          console.warn('humanSelectCard è usato solo in Scopa.');
          return;
        }


        if (!this.playedCard) {
          console.warn('Nessuna carta giocata dal mazzo umano, impossibile selezionare catture.');
          return;
        }

        // Se la carta è già selezionata → la deseleziono
        const idx = this.selectedCaptureCards.findIndex((c: any) => c === card);
        if (idx > -1) {
          this.selectedCaptureCards.splice(idx, 1);
          card.selected = false;
        } else {
          // Altrimenti la seleziono
          this.selectedCaptureCards.push(card);
          card.selected = true;
        }

        console.log(
          `Carte selezionate per cattura con ${this.playedCard.rank} di ${this.playedCard.suit}:`,
          this.selectedCaptureCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', ')
        );

        break;

      case 'humanPlayCard':
        if (gameName === 'uno') {
          if (!this.isCardPlayable(card)) {
            console.log('Carta non giocabile:', card);
            return;
          }
        }

        const cardIndex = this.getCardIndexInDeck(card);
        if (cardIndex === -1) return;

        if (gameName === 'scopa') {
          this.playedCard = card;
          if (centerDeck.length === 0) {
            console.log('Centro vuoto, carta messa al centro:', card);
            this.moveCardToCenterDeck(cardIndex);
            return;
          }

          const validCaptureCards: any[] = this.getScopaCardsForValue(this.getCardNumericValue(card))
            .filter(c => c !== card && centerDeck.includes(c));

          if (validCaptureCards.length > 0) {
            console.log(`${currentUserName} può catturare con ${card.rank} di ${card.suit}:`,
              validCaptureCards.map(c => `${c.rank} di ${c.suit}`).join(', '));
            this.hasSelectableCards = true;
            centerDeck.forEach((c: any) => c.selectable = validCaptureCards.includes(c));

            this.alertService.triggerAlert(
              'info',
              `Seleziona le carte da catturare con ${card.rank} di ${card.suit} e conferma.`,
              'info-circle',
              5000
            );

          } else {
            console.log(`${currentUserName} non può catturare con ${card.rank} di ${card.suit}`);
            this.moveCardToCenterDeck(cardIndex);
          }
        } else if (gameName === 'uno') {
          this.moveCardToCenterDeck(cardIndex);
        }

        break;

      default:
        console.log('Azione non gestita:', action, card);
    }
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
      pointsDeck: [],
      played: false,
      drawed: false,
      playerType: 'human'
    };

    this.people.push(newPlayer);
    this.gameForm.patchValue({ users: [...users, newPlayer], phase: 'waiting-room' });
    this.nickname = '';

    // Salvataggio tramite ScopaService
    this.scopaService.saveForm(this.gameForm.value)
      .then(() => console.log('Form salvato correttamente'))
      .catch(err => console.error('Errore nel salvataggio del form', err));
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

  chooseColor(e: any) {

  }

  moveCardToCenterDeck(cardIndex: number, playerName?: any) {
    const users: any = this.gameForm.get('users')?.value || [];
    const centerDeck: any = this.gameForm.get('centerDeck')?.value || [];
    const mainDeck: any = this.gameForm.get('mainDeck')?.value || [];
    const name: any = playerName || this.gameForm.get('userName')?.value;
    const player: any = users.find((u: any) => u.name === name);

    if (!player || !player.deck || cardIndex >= player.deck.length) return;

    // Prendi la carta giocata senza rimuoverla
    const playedCard: any = player.deck[cardIndex];
    if (!this.playedCard) return;

    const gameName: any = this.gameForm.get('gameName')?.value?.toLowerCase();

    switch (gameName) {
      case 'uno':
        if (playedCard.color) this.gameForm.patchValue({ currentColor: playedCard.color });
        break;

      case 'scopa':
        // CPU
        if (player.playerType === 'cpu') {
          // Mostra subito la carta giocata nel centro
          centerDeck.push(playedCard);
          this.gameForm.patchValue({ centerDeck });

          // Trova le carte catturabili dal centerDeck (escludendo la carta giocata)
          let captureCards: any[] = this.getScopaCardsForValue(this.getCardNumericValue(playedCard)) || [];
          captureCards = captureCards.filter((c: any) => c !== playedCard && centerDeck.includes(c));

          if (captureCards.length > 0) {
            // Alert: CPU potrebbe catturare
            const capturedText = captureCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', ');
            const playedText = `${this.playedCard.rank} di ${this.playedCard.suit}`;
            this.alertService.triggerAlert(
              'info',
              `${player.name} potrebbe prendere le carte: ${capturedText} con ${playedText}`,
              'info-circle',
              5000
            );

            setTimeout(() => {
              // Rimuovi carte catturate dal centerDeck
              captureCards.forEach((c: any) => {
                const idx = centerDeck.findIndex((cd: any) => cd === c);
                if (idx > -1) centerDeck.splice(idx, 1);
              });

              // Rimuovi carta giocata dal centerDeck
              const playedIndex = centerDeck.findIndex((cd: any) => cd === playedCard);
              if (playedIndex > -1) centerDeck.splice(playedIndex, 1);

              // Aggiorna pointsDeck CPU
              if (!player.pointsDeck) player.pointsDeck = [];
              player.pointsDeck.push(playedCard, ...captureCards);

              // Rimuovi la carta dal deck della CPU **dopo** la cattura
              const cardDeckIndex = player.deck.findIndex((c: any) => c === playedCard);
              if (cardDeckIndex > -1) player.deck.splice(cardDeckIndex, 1);

              // Toast cattura
              const capturedTextFinal = captureCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', ');
              const message = capturedTextFinal
                ? `${player.name} ha preso: ${capturedTextFinal} con ${this.playedCard.rank} di ${this.playedCard.suit}`
                : `${player.name} ha preso: ${this.playedCard.rank} di ${this.playedCard.suit}`;
              this.alertService.triggerAlert('success', message, 'check-circle', 7000);

              // Aggiorna stato
              this.gameForm.patchValue({ users, centerDeck });

              // Chiamata CPU successiva
              this.playNextCPU(users, name);
            }, 2500);

          } else {
            // Caso: nessuna cattura possibile → togli carta dal deck e push normale
            const cardDeckIndex = player.deck.findIndex((c: any) => c === playedCard);
            if (cardDeckIndex > -1) player.deck.splice(cardDeckIndex, 1);

            this.playNextCPU(users, name);
          }
        }


        // Giocatore umano
        if (player.playerType === 'human') {
          // Calcola le carte catturabili (escludendo la carta giocata)
          let validCaptureCards: any[] = this.getScopaCardsForValue(this.getCardNumericValue(playedCard));
          validCaptureCards = validCaptureCards.filter((c: any) => c !== playedCard && centerDeck.includes(c));

          if (validCaptureCards.length > 0) {
            // Log per debug: carte catturabili
            console.log(`${player.name} può catturare con ${this.playedCard.rank} di ${this.playedCard.suit}:`,
              validCaptureCards.map(c => `${c.rank} di ${c.suit}`).join(', '));
            this.hasSelectableCards = true;  // <- aggiorna quando ci sono carte catturabili
            centerDeck.forEach((c: any) => c.selectable = validCaptureCards.includes(c));


            this.alertService.triggerAlert(
              'info',
              `Seleziona le carte da catturare con ${this.playedCard.rank} di ${this.playedCard.suit} e conferma.`,
              'info-circle',
              5000
            );

            // La UI gestirà toggleSelectCaptureCard() e conferma con confirmCapture()
          } else {
            this.hasSelectableCards = false;
            // Nessuna cattura possibile, push normale della carta nel centerDeck
            console.log(`${player.name} non può catturare con ${this.playedCard.rank} di ${this.playedCard.suit}`);
            centerDeck.push(playedCard);
            player.deck.splice(cardIndex, 1);

            // Aggiorna lo stato dell'utente e del centro
            this.gameForm.patchValue({ centerDeck, users });
            const currentIndex = users.findIndex((u: any) => u.name === name);
            const nextIndex = (currentIndex + 1) % users.length;
            const nextPlayer: any = users[nextIndex];

            if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
              setTimeout(() => {
                this.moveCardToCenterDeck(0, nextPlayer.name);
              }, 2000);
            }
          }
        }


        break;

      default:
        console.warn(`Gioco non gestito: ${gameName}`);
        return;
    }

    // Imposta played = true per il giocatore corrente
    users.forEach((u: any) => u.played = u.name === name);

    this.gameForm.patchValue({ users, centerDeck, mainDeck });

    // Alert carta giocata
    this.alertService.triggerAlert(
      'info',
      `${name} ha giocato: ${this.playedCard.name || playedCard.rank + ' di ' + playedCard.suit}`,
      'check-circle'
    );

    // CPU successiva
    /* if (gameName === 'scopa') {
      const currentIndex = users.findIndex((u: any) => u.name === name);
      const nextIndex = (currentIndex + 1) % users.length;
      const nextPlayer: any = users[nextIndex];

      // Se chi sta giocando è umano, blocca l'autoplay
      if (player.playerType === 'human') return;

      if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
        setTimeout(() => {
          this.moveCardToCenterDeck(0, nextPlayer.name);
        }, 2000);
      }
    } */
  }

  // Metodo separato per far giocare la prossima CPU
  private playNextCPU(users: any[], currentPlayerName: any) {
    const currentIndex = users.findIndex((u: any) => u.name === currentPlayerName);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextPlayer: any = users[nextIndex];

    if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
      setTimeout(() => {
        this.moveCardToCenterDeck(0, nextPlayer.name);
      }, 2000);
    }
  }

  toggleSelectCaptureCard(card: any) {

  }

  /**
  * Trova nel centerDeck le carte che possono essere raccolte per fare punti.
  * @param targetValue Il valore della carta giocata (numero intero da 1 a 10)
  * @returns Array di carte dal centerDeck che formano combinazioni con il targetValue
  */
  getScopaCardsForValue(targetValue: number): any[] {
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];

    // Prima verifica se c'è una carta esatta uguale a targetValue
    const exactMatch = centerDeck.filter(c => this.getCardNumericValue(c) === targetValue);
    if (exactMatch.length > 0) return exactMatch;

    // Altrimenti cerca combinazioni di carte che sommano al valore target
    const results: any[] = [];

    const findCombinations = (arr: any[], combo: any[] = [], sum: number = 0, start: number = 0) => {
      if (sum === targetValue) {
        results.push([...combo]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        const cardValue = this.getCardNumericValue(arr[i]);
        if (sum + cardValue <= targetValue) {
          combo.push(arr[i]);
          findCombinations(arr, combo, sum + cardValue, i + 1);
          combo.pop();
        }
      }
    };

    findCombinations(centerDeck);

    // Restituisci la prima combinazione trovata, se ce n'è più di una
    return results.length > 0 ? results[0] : [];
  }

  /**
   * Restituisce il valore numerico di una carta SCOPA
   */

  getCardNumericValue(card: any): number {
    switch (card.rank.toLowerCase()) {
      case '1':
      case 'asso': return 1;
      case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '10':
        return parseInt(card.rank, 10);
      case 'fante':
        return 8; // oppure 8/9/10 se vuoi la scala italiana
      case 'cavallo':
        return 9; // oppure 8/9/10 se vuoi la scala italiana
      case 're':
        return 10; // oppure 8/9/10 se vuoi la scala italiana
      default:
        return 0;
    }
  }


  playerDrawCard(userName?: any, count: any = 1, fromDeckName: any = 'mainDeck'): any[] {
    const gameName: any = this.gameForm.get('gameName')?.value?.toLowerCase();
    const users: any = this.gameForm.get('users')?.value || [];
    const name: any = userName || this.gameForm.get('userName')?.value;
    const player: any = users.find((u: any) => u.name === name);
    const deck: any = this.gameForm.get(fromDeckName)?.value || [];

    if (!player || !deck || deck.length === 0) return [];

    const drawnCards: any[] = [];

    switch (gameName) {
      case 'uno':
        for (let i = 0; i < count && deck.length > 0; i++) {
          drawnCards.push(deck.shift());
        }
        break;

      case 'scopa':
        for (let i = 0; i < count && deck.length > 0; i++) {
          drawnCards.push(deck.shift());
        }
        break;

      default:
        // fallback generico
        for (let i = 0; i < count && deck.length > 0; i++) {
          drawnCards.push(deck.shift());
        }
    }

    player.deck.push(...drawnCards);

    // Imposta played = true per questo utente e false per gli altri
    users.forEach((u: any) => u.played = u.name === name);

    this.gameForm.patchValue({ users, [fromDeckName]: deck });

    if (drawnCards.length > 0) {
      this.alertService.triggerAlert(
        'warning',
        `${name} pesca ${drawnCards.length} carte${count > 1 ? 's' : ''}: ${drawnCards.map((c: any) => c.name).join(', ')}`,
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
