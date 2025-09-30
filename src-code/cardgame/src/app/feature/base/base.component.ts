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

  action(action: string, card?: any, i?: number) {
    const users: any = this.gameForm.get('users')?.value || [];
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];
    const currentUserName = this.gameForm.get('userName')?.value;
    const gameName: string = this.gameForm.get('gameName')?.value?.toLowerCase();
    const currentPlayer: any = users.find((u: any) => u.name === currentUserName);
    const playerInTurnName: string = this.gameForm.get('peopleInTurn')?.value;
    const playerInTurn: any = users.find((e: any) => e.name == playerInTurnName);
    const playerInTurnIndex: number = users.findIndex((e: any) => e.name == playerInTurnName); // Calcola l’indice del prossimo giocatore (ciclo circolare)

    const cardIndex = this.getCardIndexInDeck(card);

    if (!currentPlayer || !currentPlayer.deck || cardIndex >= currentPlayer.deck.length) return;

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

        const selectedSum = this.selectedCaptureCards
          .map((c: any) => this.getCardNumericValue(c))
          .reduce((a: number, b: number) => a + b, 0);

        const playedValue = this.getCardNumericValue(this.playedCard);

        if (selectedSum === playedValue) {
          console.log(`✅ Cattura valida! ${this.playedCard.rank} di ${this.playedCard.suit} prende le carte selezionate.`);

          // Sposta le carte selezionate dal centerDeck al pointsDeck del giocatore in turno
          if (!playerInTurn.pointsDeck) playerInTurn.pointsDeck = [];

          // Usa moveCards: centerDeck → pointsDeck del giocatore in turno
          this.moveCards(centerDeck, playerInTurn.pointsDeck, this.selectedCaptureCards.map((c: any) => centerDeck.indexOf(c)));

          // Sposta la carta giocata nel pointsDeck del giocatore in turno
          const playedCardIndex = playerInTurn.deck.findIndex((c: any) => c === this.playedCard);
          if (playedCardIndex > -1) {
            this.moveCards(playerInTurn.deck, playerInTurn.pointsDeck, [playedCardIndex]);
          }

          // Aggiorna lo stato
          this.gameForm.patchValue({ users, centerDeck });

          // Reset selezioni
          this.selectedCaptureCards = [];
          this.playedCard = null;
          this.hasSelectableCards = false;

          // Toast con nome giocatore in turno
          this.alertService.triggerAlert(
            'success',
            `${playerInTurn.name} ha preso con ${playedValue}`,
            'check-circle',
            7000
          );

          // Calcola il prossimo giocatore
          const nextIndex = (playerInTurnIndex + 1) % users.length;
          const nextPlayer = users[nextIndex];

          // Aggiorna peopleInTurn nel form
          this.gameForm.patchValue({ peopleInTurn: nextPlayer.name });

          // Se il prossimo giocatore è CPU, gioca la carta
          if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
            setTimeout(() => {
              this.action('cpuPlayCard');
            }, 3000)
          }
        }

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

          // Controlla se il centro è vuoto prima di giocare la carta
          const isCenterEmpty = centerDeck.length === 0;

          // Trova le carte catturabili
          const validCaptureCards: any[] = this.getScopaCardsForValue(this.getCardNumericValue(card))
            .filter((c: any) => c !== card && centerDeck.includes(c));

          if (validCaptureCards.length > 0) {
            console.log(`${currentUserName} può catturare con ${card.rank} di ${card.suit}:`,
              validCaptureCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', ')
            );
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

            // Sposta la carta nel centerDeck
            this.moveCards(playerInTurn.deck, centerDeck, [cardIndex]);

            // Toast SCOPA se il centro era vuoto prima di giocare
            const scopaText = isCenterEmpty ? ' …e ha fatto SCOPA!' : '';
            this.alertService.triggerAlert(
              'success',
              `${currentUserName} ha giocato ${card.rank} di ${card.suit}${scopaText}`,
              'check-circle',
              7000
            );

            // Dopo aver spostato la carta e gestito eventuali catture
            const allEmpty = users.every((u: any) => u.deck.length === 0);
            const mainDeckEmpty = (this.gameForm.get('mainDeck')?.value || []).length === 0;

            if (allEmpty && mainDeckEmpty && centerDeck.length > 0) {
              // Tutti i giocatori e il maindeck vuoti → il giocatore in turno prende tutto
              const playerDeck = playerInTurn.deck || [];
              this.moveCards(centerDeck, playerDeck, centerDeck.map((_, i) => i));
              this.alertService.triggerAlert(
                'success',
                `${playerInTurn.name} prende tutte le carte rimaste nel centro!`,
                'check-circle',
                7000
              );

              this.gameForm.patchValue({ users, centerDeck });
              break
            }

            // Calcola il prossimo giocatore
            const nextIndex = (playerInTurnIndex + 1) % users.length;
            const nextPlayer = users[nextIndex];

            // Aggiorna peopleInTurn nel form
            this.gameForm.patchValue({ peopleInTurn: nextPlayer.name });

            // Se il prossimo giocatore è CPU, gioca la carta
            if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
              setTimeout(() => {
                this.action('cpuPlayCard');
              }, 3000);
            }
          }
        }

        break;

      case 'cpuPlayCard':
        this.playCpu()
        break;

      default:
        console.log('Azione non gestita:', action, card);
    }
  }

  private playCpu() {
    const users: any[] = this.gameForm.get('users')?.value || [];
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];
    const playerInTurnName: string = this.gameForm.get('peopleInTurn')?.value;
    const playerInTurn: any = users.find((u: any) => u.name === playerInTurnName);

    if (!playerInTurn || playerInTurn.playerType !== 'cpu' || playerInTurn.deck.length === 0) return;

    console.log(`Centro prima che ${playerInTurn.name} giochi:`, centerDeck);
    console.log(`${playerInTurn.name} ha nel deck:`, playerInTurn.deck.map((c: any) => `${c.rank} di ${c.suit}`));

    // Trova la migliore cattura o la carta meno importante
    const bestOption = this.findBestCaptureOrLowestCard(playerInTurn.deck, centerDeck);
    if (!bestOption || !bestOption.handCard) return;

    const cardIndex = bestOption.handCardIndex!;
    const playedCard = bestOption.handCard;

    // Gioca la carta nel centerDeck
    this.moveCards(playerInTurn.deck, centerDeck, [cardIndex]);
    this.playedCard = playedCard;

    // Aggiorna lo stato prima dei toast
    this.gameForm.patchValue({ users, centerDeck });

    // Toast carta giocata
    this.alertService.triggerAlert(
      'info',
      `${playerInTurn.name} ha giocato: ${playedCard.rank} di ${playedCard.suit}`,
      'check-circle',
      4000
    );

    // Se ci sono catture possibili 
    if (bestOption.capturedCards && bestOption.capturedCards.length > 0) {
      const pointsDeck = playerInTurn.pointsDeck || (playerInTurn.pointsDeck = []);

      // Indici delle carte catturate + carta giocata nel centerDeck
      const capturedIndices = bestOption.capturedCards.map(c => centerDeck.indexOf(c));
      const playedCardIndexInCenter = centerDeck.indexOf(playedCard);
      if (playedCardIndexInCenter > -1) capturedIndices.push(playedCardIndexInCenter);

      // Sposta tutte le carte nel pointsDeck della CPU
      this.moveCards(centerDeck, pointsDeck, capturedIndices);

      this.playedCard = null; // resetta la carta giocata
      this.gameForm.patchValue({ users, centerDeck });

      const capturedText = bestOption.capturedCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', ');

      // Controlla se dopo la presa il centerDeck è vuoto
      const scopaText = centerDeck.length === 0 ? ' …e ha fatto SCOPA!' : '';

      this.alertService.triggerAlert(
        'success',
        `${playerInTurn.name} ha preso: ${capturedText} con ${playedCard.rank} di ${playedCard.suit}${scopaText}`,
        'check-circle',
        7000
      );
    }

    // Controlla se tutti i giocatori hanno 0 carte nel deck
    // Controlla se tutti i giocatori hanno 0 carte
    const allEmpty = users.every(u => u.deck.length === 0);
    const mainDeck: any[] = this.gameForm.get('mainDeck')?.value || [];

    if (allEmpty) {
      if (mainDeck.length > 0) {
        // Ridistribuisci carte ai giocatori (3 per ciascuno o quante ne restano)
        const cardsPerPlayer = 3;
        const updatedUsers = this.dealCardsToPlayers(users, mainDeck, cardsPerPlayer);
        console.log('Ridistribuite carte a tutti i giocatori:', updatedUsers.map(u => `${u.name}: ${u.deck.length} carte`));
        this.gameForm.patchValue({ users: updatedUsers, mainDeck });
      } else if (centerDeck.length > 0) {
        // Il maindeck è vuoto → il giocatore in turno prende tutto il centro
        const pointsDeck = playerInTurn.pointsDeck || (playerInTurn.pointsDeck = []);
        this.moveCards(centerDeck, pointsDeck, centerDeck.map((_, i) => i));
        this.alertService.triggerAlert(
          'success',
          `${playerInTurn.name} prende tutte le carte rimaste nel centro! Partita FINITA!`,
          'check-circle',
          7000
        );
        this.gameForm.patchValue({ users, centerDeck });
        return; // termina il turno
      }
    }



    // Passa al prossimo giocatore
    const currentIndex = users.findIndex((u: any) => u.name === playerInTurnName);
    const nextIndex = (currentIndex + 1) % users.length;
    this.gameForm.patchValue({ peopleInTurn: users[nextIndex].name });

    // Se il prossimo è CPU, richiama playCpu con timeout corretto
    const nextPlayer = users[nextIndex];
    if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
      setTimeout(() => {
        console.log(`--- Ora gioca CPU: ${nextPlayer.name} ---`);
        console.log('Centro attuale:', this.gameForm.get('centerDeck')?.value || []);
        this.playCpu();
      }, 1500); // timeout breve per non sovrapporre toast
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

    switch (gameName.toLowerCase()) {
      case 'uno':
        mainDeck = await this.createUnoDeck();
        cardsPerPlayer = 7;
        break;
      case 'scopa':
        mainDeck = this.createScopaDeck();
        cardsPerPlayer = 3;
        break;
      default:
        console.log(gameName);
    }

    if (!mainDeck || mainDeck.length === 0) {
      console.error('Errore: mazzo non creato!');
      return;
    }

    console.log(`Mazzo principale pronto: ${mainDeck.length} carte`);
    mainDeck = this.shuffleDeck([...mainDeck]);

    // Distribuzione carte
    const updatedUsers = this.dealCardsToPlayers(this.gameForm.get('users')?.value || [], mainDeck, cardsPerPlayer);
    // Ottieni o crea il centerDeck
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];

    // Distribuzione carte nel centro
    this.dealCardsToCenter(mainDeck, centerDeck, 4); // 4 carte nel centerDeck

    this.gameForm.patchValue({ centerDeck });
    console.log(mainDeck, updatedUsers)
    // Inizializza peopleInTurn e primo giocatore
    const peopleInTurn = updatedUsers.map((u: any) => u.name);
    const firstPlayer = updatedUsers[0]?.name || null;

    this.gameForm.patchValue({
      users: updatedUsers,
      mainDeck,
      centerDeck,
      phase: 'start-playing',
      peopleInTurn: firstPlayer
    });

    console.log(`Gioco "${gameName}" iniziato, carte distribuite:`, updatedUsers);
  }

  private dealCardsToPlayers(users: any[], mainDeck: any[], cardsPerPlayer: number): any[] {
    // Controlla se ci sono abbastanza carte nel mazzo principale
    if ((mainDeck?.length || 0) < users.length * cardsPerPlayer) {
      this.alertService.triggerAlert(
        'warning',
        'Partita finita: non ci sono abbastanza carte nel mazzo principale!',
        'info-circle',
        7000
      );
      return users; // restituisci lo stato attuale dei giocatori senza modifiche
    }

    // Distribuisci le carte
    return users.map((player: any) => {
      const playerDeck: any[] = [];
      for (let i = 0; i < cardsPerPlayer; i++) {
        const card = mainDeck.shift();
        if (card) playerDeck.push(card);
      }
      return { ...player, deck: playerDeck };
    });
  }


  dealCardsToCenter(mainDeck: any[], centerDeck: any[], cardsToDeal: number = 4) {
    const movedCards = this.moveCards(mainDeck, centerDeck, Array.from({ length: cardsToDeal }, (_, i) => i));
    console.log('Carte distribuite al centro:', movedCards.map(c => `${c.rank} di ${c.suit}`));
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

  private playNextCPU(users: any[], currentPlayerName: any) {
    const currentIndex = users.findIndex((u: any) => u.name === currentPlayerName);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextPlayer: any = users[nextIndex];

    if (nextPlayer.playerType === 'cpu' && nextPlayer.deck.length > 0) {
      setTimeout(() => {
        const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];

        // Debug: stampa il centro prima di qualsiasi mossa
        console.log(`Centro prima che ${nextPlayer.name} giochi:`, centerDeck);
        // Stampa le carte attuali della CPU (prime tre)
        console.log(`${nextPlayer.name} ha nel deck:`,
          nextPlayer.deck.slice(0, 3).map((c: any) => `${c.rank} di ${c.suit}`)
        );
        // Trova la migliore presa possibile
        const bestCapture = this.findBestCaptureOrLowestCard(nextPlayer.deck, centerDeck);
        if (bestCapture && bestCapture.capturedCards) {
          console.log(this.findBestCaptureOrLowestCard(nextPlayer.deck, centerDeck));
        } else {
          console.log(`${nextPlayer.name} non ha catture possibili con le prime carte.`,
            this.findBestCaptureOrLowestCard(nextPlayer.deck, centerDeck)
          );
        }
        // Sposta la prima carta del deck CPU nel centerDeck
        // const movedCards = this.moveCards(nextPlayer.deck, centerDeck, [0]);
        // this.gameForm.patchValue({ users, centerDeck });

        // Imposta playedCard della CPU
        // this.playedCard = movedCards[0];

        // Toast con la carta giocata
        // if (this.playedCard) {
        //   this.alertService.triggerAlert(
        //     'info',
        //     `${nextPlayer.name} ha giocato: ${this.playedCard.rank} di ${this.playedCard.suit}`,
        //     'check-circle',
        //     4000
        //   );
        // }

        // Controlla catture possibili solo per Scopa
        const gameName = this.gameForm.get('gameName')?.value?.toLowerCase();
        if (gameName === 'scopa') {
          // const captureCards = this.getScopaCardsForValue(this.getCardNumericValue(this.playedCard))
          //   .filter((c: any) => c !== this.playedCard && centerDeck.includes(c));

          // if (captureCards.length > 0) {
          //   console.log(`${nextPlayer.name} può catturare carte con ${this.playedCard.rank} di ${this.playedCard.suit}:`,
          //     captureCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', '));
          //   ...
          //   return;
          // }
        }

        // Non far partire la CPU successiva
        // this.playNextCPU(users, nextPlayer.name);
      }, 3000);
    }
  }

  findBestCaptureOrLowestCard(handCards: any[], centerDeck: any[]): { handCard?: any, capturedCards?: any[], handCardIndex?: number } | null {
    const cardValue = (card: any) => {
      switch (card.rank.toLowerCase()) {
        case 'asso': case '1': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case 'fante': return 8;
        case 'cavallo': return 9;
        case 're': return 10;
        default: return 0;
      }
    };

    const scoreCapture = (handCard: any, capturedCards: any[]): number => {
      let score = 0;
      score += capturedCards.length;
      if (capturedCards.some((c: any) => c.rank === '7' && c.suit === 'denari') || (handCard.rank === '7' && handCard.suit === 'denari')) {
        score += 10;
      }
      score += capturedCards.filter((c: any) => c.suit === handCard.suit).length;
      return score;
    };

    const findCombinations = (arr: any[], target: number): any[][] => {
      const results: any[][] = [];
      const helper = (combo: any[], sum: number, start: number) => {
        if (sum === target) {
          results.push([...combo]);
          return;
        }
        for (let i = start; i < arr.length; i++) {
          const val = cardValue(arr[i]);
          if (sum + val <= target) {
            combo.push(arr[i]);
            helper(combo, sum + val, i + 1);
            combo.pop();
          }
        }
      };
      helper([], 0, 0);
      return results;
    };

    let bestOption: any | null = null;

    for (let idx = 0; idx < handCards.length; idx++) {
      const handCard = handCards[idx];
      const targetValue = cardValue(handCard);
      let possibleCaptures = findCombinations(centerDeck, targetValue);

      // Aggiungi cattura singola della carta uguale
      if (centerDeck.some((c: any) => cardValue(c) === targetValue)) {
        possibleCaptures.push(centerDeck.filter((c: any) => cardValue(c) === targetValue));
      }

      for (const captured of possibleCaptures) {
        const score = scoreCapture(handCard, captured);
        if (!bestOption || score > bestOption.score) {
          bestOption = { handCard, capturedCards: captured, handCardIndex: idx, score };
        }
      }
    }

    // Se non ci sono catture possibili, restituisci la carta meno importante
    if (!bestOption && handCards.length > 0) {
      let minVal = Infinity;
      let minIdx = 0;
      handCards.forEach((c, i) => {
        const val = cardValue(c);
        if (val < minVal) {
          minVal = val;
          minIdx = i;
        }
      });
      bestOption = { handCard: handCards[minIdx], capturedCards: [], handCardIndex: minIdx, score: 0 };
    }

    return bestOption;
  }


  toggleSelectCaptureCard(card: any) {

  }

  /**
  * Trova nel centerDeck le carte che possono essere raccolte per fare punti. 
  */
  getScopaCardsForValue(targetValue: number): any[] {
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];

    // Prima verifica se c'è una carta esatta uguale a targetValue
    const exactMatch = centerDeck.filter((c: any) => this.getCardNumericValue(c) === targetValue);
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
