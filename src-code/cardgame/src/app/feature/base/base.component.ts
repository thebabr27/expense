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
  toCapture: any[] = [];
  toCenter: any[] = [];
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
      lastTaker: [''],
      mainDeck: [[]],
      originalDeck: [[]],
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

  getUserScores() {
  const users = this.gameForm.get('users')?.value || [];

  // Conteggio carte e denari
  const deckLengths = users.map((u: any) => (u.pointsDeck?.deck?.length || 0));
  const maxCarte = Math.max(...deckLengths);
  const denariCounts = users.map((u: any) => (u.pointsDeck?.deck?.filter((c: any) => c.suit.toLowerCase() === 'denari').length || 0));
  const maxDenari = Math.max(...denariCounts);

  // Controllo se ci sono pareggi per carte e denari
  const maxCarteCount = deckLengths.filter((l: any) => l === maxCarte).length;
  const maxDenariCount = denariCounts.filter((l: any) => l === maxDenari).length;

  // Calcolo primiera di tutti i giocatori e massimo
  const primiereScores = users.map((u: any) => this.calcPrimiera(u.pointsDeck?.deck || []));
  const maxPrimiera = Math.max(...primiereScores);
  const maxPrimieraCount = primiereScores.filter((p: any) => p === maxPrimiera).length;

  return users.map((u: any, index: number) => {
    const deckObj = u.pointsDeck || { deck: [], scopa: 0 };
    const deck = deckObj.deck || [];
    const scope = deckObj.scopa || 0;

    const carte = deck.length;
    const denari = deck.filter((c: any) => c.suit.toLowerCase() === 'denari').length;
    const settebello = deck.some((c: any) => c.suit.toLowerCase() === 'denari' && c.rank === '7') ? 1 : 0;
    const primiera = primiereScores[index];

    // Totale punti
    let total = 0;
    total += scope;                                           // punti per scopa
    total += (carte === maxCarte && maxCarteCount === 1 ? 1 : 0);     // più carte, solo se unico
    total += (denari === maxDenari && maxDenariCount === 1 ? 1 : 0);   // più denari, solo se unico
    total += settebello;                                      // settebello
    total += (primiera === maxPrimiera && maxPrimieraCount === 1 ? 1 : 0); // primiera, solo se unico

    console.log({
      name: u.name,
      scope,
      carte,
      denari,
      settebello,
      primiera,
      total,
      pointsDeck: deck
    });

    return {
      name: u.name,
      scope,
      carte,
      denari,
      settebello,
      primiera,
      total
    };
  });
}


  // Calcolo primiera corretto
  calcPrimiera(deck: any[]): number {
    const valoriPrimiera: any = {
      '7': 21, '6': 18, '1': 16, 'Asso': 16,
      '5': 15, '4': 14, '3': 13, '2': 12,
      'Re': 10, 'Cavallo': 10, 'Fante': 10
    };
    const semi = ['denari', 'coppe', 'spade', 'bastoni'];

    let score = 0;
    for (let seme of semi) {
      const carteSeme = deck.filter((c: any) => c.suit.toLowerCase() === seme);
      if (carteSeme.length > 0) {
        // usa rank della carta per valoriPrimiera
        const max = Math.max(...carteSeme.map((c: any) => valoriPrimiera[c.rank] || 0));
        score += max;
      }
    }

    return score;
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

  private endGame() {
    const users = this.gameForm.get('users')?.value || [];
    // Calcolo punteggi finali
    const scores = this.getUserScores();


    // Mostro un alert per l’utente
    console.log('💾 Stato pointsDeck:', users.map((e: any) => e.pointsDeck));

    // Mostro i punteggi in console (debug)
    console.log('🏁 Fine partita - punteggi finali:', scores);

    // Aggiorna il phase del gameForm
    this.gameForm.patchValue({ phase: 'finish-playing' });

    // Mostra alert dopo 2 secondi
    setTimeout(() => {
      this.alertService.triggerAlert(
        'success',
        'La partita è terminata! Ecco i punteggi finali.',
        'check-circle',
        7000
      );
    }, 2000);


    // Salvo lo stato finale nel gameForm
    this.gameForm.patchValue({
      users,
      gameOver: true,   // puoi usare questa flag nel template per bloccare azioni
      finalScores: scores
    });
  }

  cpuPlay() {
    const users = this.gameForm.get('users')?.value || [];
    let centerDeck = this.gameForm.value.centerDeck;
    let mainDeck = this.gameForm.value.mainDeck || [];
    let lastTaker = this.gameForm.value.lastTaker;

    let currentIndex = users.findIndex((u: any) => u.name === this.gameForm.value.peopleInTurn);
    if (currentIndex === -1) currentIndex = 0;
    const playerInTurn = users[currentIndex];
    let cpuDeck = playerInTurn.deck;
    let cpuPoints = playerInTurn.pointsDeck;

    if (!cpuPoints) {
      cpuPoints = { deck: [], scopa: 0 };
      playerInTurn.pointsDeck = cpuPoints;
    }
    if (!cpuPoints.deck) cpuPoints.deck = [];

    const cpu = this.suggestBestCard(cpuDeck, centerDeck);

    // Caso 1️⃣: CPU non cattura nulla
    if (!cpu.capturedCards || cpu.capturedCards.length === 0) {
      this.moveCards(cpuDeck, centerDeck, [cpu.handCardIndex]);
      this.alertService.triggerAlert(
        'info',
        `🤖 ${playerInTurn.name} gioca ${cpu.handCard.rank} di ${cpu.handCard.suit}.`,
        'info-circle',
        5000
      );
    }
    // Caso 2️⃣: CPU cattura
    else {
      const playedCard = cpu.handCard;
      const capturedCards = cpu.capturedCards || [];
      const capturedIndices = this.findMatchingIndices(capturedCards, centerDeck);

      this.moveCards(cpuDeck, cpuPoints.deck, [cpu.handCardIndex]);
      if (capturedIndices.length > 0) {
        this.moveCards(centerDeck, cpuPoints.deck, capturedIndices);
      }

      // Aggiorno lastTaker
      lastTaker = playerInTurn.name;

      // Costruisco testo alert
      let alertText = `🤖 ${playerInTurn.name} prende ${capturedCards.map(c => `${c?.rank ?? '?'} di ${c?.suit ?? '?'}`).join(', ')} con ${playedCard?.rank ?? '?'} di ${playedCard?.suit ?? '?'}`;

      if (centerDeck.length === 0) {
        cpuPoints.scopa += 1;
        alertText += ' ...e fa scopa!';
      }

      if (capturedCards.some(c => c.rank === '7' && c.suit === 'denari')) {
        alertText = `🤖 ${playerInTurn.name} prende il Settebello!`;
      }

      this.alertService.triggerAlert('success', alertText, 'check-circle', 5000);
      console.log("💻 CPU played:", playedCard);
      console.log("💻 CPU captured:", capturedCards);
    }

    // 🔹 Controllo se tutti i deck sono vuoti
    const allEmpty = users.every((u: any) => u.deck.length === 0);

    if (allEmpty) {
      if (mainDeck.length > 0) {
        // Distribuisci nuove carte
        const updatedUsers = this.dealCardsToPlayers(users, mainDeck, 3);
        users.splice(0, users.length, ...updatedUsers);
        console.log('💾 Nuove carte distribuite dal mazzo principale');
      } else {
        // Fine partita: assegna centerDeck al lastTaker
        if (lastTaker) {
          const takerPoints = users.find((u: any) => u.name === lastTaker).pointsDeck;
          if (takerPoints) {
            takerPoints.deck.push(...centerDeck);
          }
        }
        centerDeck = [];
        this.gameForm.patchValue({ centerDeck });
        console.log('🏁 Fine partita, carte rimanenti assegnate al lastTaker');
        this.endGame();
        return; // esco per non passare il turno successivo
      }
    }

    // Passa al prossimo giocatore
    const nextIndex = (currentIndex + 1) % users.length;
    const nextPlayer = users[nextIndex];
    this.gameForm.patchValue({ peopleInTurn: nextPlayer.name, users, centerDeck, mainDeck, lastTaker });
    console.log(`🔄 Turno passato a: ${nextPlayer.name}`);

    if (nextPlayer.playerType !== 'human') {
      console.log(`🤖 ${nextPlayer.name} è CPU, rilancio cpuPlay()`);
      setTimeout(() => this.cpuPlay(), 2000);
    }
  }

  private sortCardsByImportance(deck: any[]): any[] {
    // Funzione per ottenere un valore numerico ordinabile per rank standard
    const rankValue = (card: any): number => {
      switch (card.rank.toLowerCase()) {
        case 'asso': return 1;
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

    return deck.slice().sort((a, b) => {
      // Primo posto: 7 di denari
      if (a.rank === '7' && a.suit === 'denari') return -1;
      if (b.rank === '7' && b.suit === 'denari') return 1;

      // Poi tutti i 6 in denari
      if (a.rank === '6' && a.suit === 'denari') return -1;
      if (b.rank === '6' && b.suit === 'denari') return 1;

      // Poi gli altri 7
      if (a.rank === '7' && a.suit !== 'denari') return -1;
      if (b.rank === '7' && b.suit !== 'denari') return 1;

      // Poi gli altri 6
      if (a.rank === '6' && a.suit !== 'denari') return -1;
      if (b.rank === '6' && b.suit !== 'denari') return 1;

      // Tutte le altre carte in ordine di rank crescente
      return rankValue(a) - rankValue(b);
    });
  }

  private suggestBestCard(
    handCards: any[],
    centerDeck: any[]
  ): { handCardIndex: number, handCard: any, capturedCards: any[] } {

    // Funzione di supporto: valore numerico della carta
    const cardValue = (card: any) => {
      const rankStr = String(card.rank).toLowerCase();
      switch (rankStr) {
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

    // Ordina le carte in mano per importanza minore → maggiore
    const sortedHand = this.sortCardsByImportance(handCards);

    for (const card of sortedHand) {
      const combos = this.findCaptureCombinationsFlat(card, centerDeck);

      // 1️⃣ 7 di denari cattura un altro 7
      if (card.rank === '7' && card.suit === 'denari') {
        const capture = combos.find(c => c.rank === '7' && c.suit !== 'denari');
        if (capture) {
          return {
            handCardIndex: handCards.indexOf(card),
            handCard: card,
            capturedCards: [capture]
          };
        }
      }

      // 2️⃣ Possibile scopa
      if (centerDeck.length > 0 && combos.length > 0) {
        const totalComboValue = combos.reduce((sum, c) => sum + cardValue(c), 0);
        if (totalComboValue === cardValue(card) && centerDeck.length === 1) {
          return {
            handCardIndex: handCards.indexOf(card),
            handCard: card,
            capturedCards: [...combos[0]]
          };
        }
      }

      // 3️⃣ Prendere un 6
      const sixCapture = combos.find(c => c.rank === '6');
      if (sixCapture) {
        return {
          handCardIndex: handCards.indexOf(card),
          handCard: card,
          capturedCards: [sixCapture]
        };
      }

      // 4️⃣ Prendere più carte
      if (combos.length > 1) {
        return {
          handCardIndex: handCards.indexOf(card),
          handCard: card,
          capturedCards: [...combos[0]]
        };
      }

      // 5️⃣ Prendere almeno una carta
      if (combos.length > 0) {
        return {
          handCardIndex: handCards.indexOf(card),
          handCard: card,
          capturedCards: [...combos[0]]
        };
      }
    }

    // 6️⃣ Nessuna priorità: carta random
    const randomIndex = Math.floor(Math.random() * handCards.length);
    return {
      handCardIndex: randomIndex,
      handCard: handCards[randomIndex],
      capturedCards: []
    };
  }

  private passToNextPlayer() {
    const users: any[] = this.gameForm.get('users')?.value || [];
    const currentPlayerName = this.gameForm.value.peopleInTurn;
    let currentIndex = users.findIndex(u => u.name === currentPlayerName);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextPlayer = users[nextIndex];

    this.gameForm.patchValue({ peopleInTurn: nextPlayer.name });

    if (nextPlayer.playerType !== 'human') {
      setTimeout(() => this.cpuPlay(), 2000); // piccola pausa per vedere le mosse
    }
  }


  action(action: string, card?: any) {
    const users: any[] = this.gameForm.get('users')?.value || [];
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];
    const currentUserName: string = this.gameForm.get('userName')?.value;
    const gameName: string = this.gameForm.get('gameName')?.value?.toLowerCase();
    const currentPlayer: any = users.find((u: any) => u.name === currentUserName);
    const playerInTurnName: string = this.gameForm.get('peopleInTurn')?.value;
    const playerInTurn: any = users.find((u: any) => u.name === playerInTurnName);
    const playerInTurnIndex: number = users.findIndex((u: any) => u.name === playerInTurnName);

    let cardIndex = this.gameForm.value.users[playerInTurnIndex].deck.
      findIndex((e: any) => e.name == card.name);

    if (!currentPlayer || !currentPlayer.deck) return;

    switch (action) {

      case 'userDeckCard':
        const possibleCaptures = this.findCaptureCombinationsFlat(card, centerDeck, true);

        if (possibleCaptures && possibleCaptures.length > 0) {
          this.playedCard = card;
          this.toggleSelectableCards(this.gameForm.value.centerDeck, possibleCaptures);
        } else {
          // Muovo la carta giocata → centerDeck
          this.moveCards(
            this.gameForm.value.users[playerInTurnIndex].deck,
            this.gameForm.value.centerDeck,
            [cardIndex]
          );

          // Alert per giocata senza presa
          this.alertService.triggerAlert(
            'info',
            `Hai giocato ${card.rank} di ${card.suit}.`,
            'info-circle',
            5000
          );

          // Aggiorna turno e controlla se prossimo è CPU
          this.passToNextPlayer();
        }
        break;

      case 'centerDeckCard':
        this.selectedCaptureCards.push(card);

        const userIndices = this.findMatchingIndices(
          [this.playedCard],
          this.gameForm.value.users[playerInTurnIndex].deck
        );
        const centerIndices = this.findMatchingIndices(
          this.selectedCaptureCards,
          this.gameForm.value.centerDeck
        );

        if (this.compareCardSums([this.playedCard], this.selectedCaptureCards) === 'equal') {
          // Muovo la carta giocata → pointsDeck
          this.moveCards(
            this.gameForm.value.users[playerInTurnIndex].deck,
            this.gameForm.value.users[playerInTurnIndex].pointsDeck.deck,
            userIndices
          );

          // Muovo le carte catturate → pointsDeck
          this.moveCards(
            this.gameForm.value.centerDeck,
            this.gameForm.value.users[playerInTurnIndex].pointsDeck.deck,
            centerIndices
          );

          // Aggiorno lastTaker
          this.gameForm.patchValue({ lastTaker: this.gameForm.value.peopleInTurn });

          // Alert per cattura
          let alertText = `Hai preso ${this.selectedCaptureCards.map(c => `${c.rank} di ${c.suit}`).join(', ')} con ${this.playedCard.rank} di ${this.playedCard.suit}!`;

          // Controllo scopa
          if (this.gameForm.value.centerDeck.length === 0) {
            this.gameForm.value.users[playerInTurnIndex].pointsDeck.scopa += 1;
            alertText += ' ...e fai scopa!';
          }

          // Controllo Settebello
          if (this.selectedCaptureCards.some(c => c.rank === '7' && c.suit === 'denari')) {
            alertText = 'Hai preso il Settebello!';
          }

          this.alertService.triggerAlert('success', alertText, 'check-circle', 5000);

          // Reset selezioni
          this.selectedCaptureCards = [];
          this.playedCard = null;
          this.hasSelectableCards = false;

          // Aggiorna turno e verifica CPU
          this.passToNextPlayer();

        } else {
          console.log("Somma non raggiunta");
        }
        break;

      default:
        console.log('Azione non gestita:', action, card);
    }
  }

  private assignPointsToPlayer(player: any, capturedCards: any[], playedCard: any, centerDeck: any[]) {
    const users = this.gameForm.get('users')?.value || [];
    const playedCardIndexInCenter = centerDeck.findIndex(
      (c: any) => c.rank === playedCard.rank && c.suit === playedCard.suit
    );
    if (!player.pointsDeck) player.pointsDeck = { deck: [], scopa: 0 };
    const pointsDeckObj = player.pointsDeck;

    const centerCountBefore = centerDeck.length;

    // 🔹 Sposta le carte catturate dal centro al pointsDeck
    capturedCards.forEach((c: any) => {
      const idx = centerDeck.findIndex((d: any) => d.rank === c.rank && d.suit === c.suit);
      if (idx > -1) {
        this.moveCards(centerDeck, pointsDeckObj.deck, [idx]);
      }
    });

    // 🔹 Aggiungi la carta giocata direttamente al pointsDeck
    pointsDeckObj.deck.push(playedCard);

    // 🔹 Rimuovi la carta dal centro se presente

    if (playedCardIndexInCenter > -1) {
      centerDeck.splice(playedCardIndexInCenter, 1);
    }

    // 🔹 Aggiungi la carta giocata al pointsDeck
    pointsDeckObj.deck.push(playedCard);

    // 🔹 Rimuovi la carta giocata dal centro se era stata messa

    if (playedCardIndexInCenter > -1) {
      centerDeck.splice(playedCardIndexInCenter, 1);
    }

    // 🔹 SCOPA: se il centro era pieno e ora è vuoto
    if (centerCountBefore === capturedCards.length + 1) {
      pointsDeckObj.scopa = (pointsDeckObj.scopa || 0) + 1;
    }

    // Messaggio cattura
    const capturedText = capturedCards.map((c: any) => `${c.rank} di ${c.suit}`).join(', ');
    const scopaText = centerDeck.length === 0 ? ' …e ha fatto SCOPA!' : '';
    const hasSettebello = capturedCards.some((c: any) => c.suit === 'denari' && c.value === 7);

    console.log('💾 Stato pointsDeck:', users.map((e: any) => e.pointsDeck));
    this.alertService.triggerAlert(
      'success',
      `${player.name} ha preso ${capturedText} con ${playedCard.rank} di ${playedCard.suit}${scopaText}${hasSettebello ? ' …e ha preso Settebello!' : ''}`,
      'check-circle',
      7000
    );

    this.gameForm.patchValue({ lastTaker: player.name, users, centerDeck });
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

  private findMatchingIndices(arr1: any[], arr2: any[]): number[] {
    const indices: number[] = [];

    arr2.forEach((item, index) => {
      const exists = arr1.some(
        other => other.rank === item.rank && other.suit === item.suit
      );
      if (exists) {
        indices.push(index); // 👈 qui spingo l'indice di arr2
      }
    });

    return indices;
  }

  private compareCardSums(arr1: any[], arr2: any[]): "equal" | "greater" | "less" {
    const sum1 = arr1.reduce((acc, card) => acc + this.getCardNumericValue(card), 0);
    const sum2 = arr2.reduce((acc, card) => acc + this.getCardNumericValue(card), 0);

    if (sum1 === sum2) return "equal";
    return sum1 > sum2 ? "greater" : "less";
  }


  /* Trova tutte le combinazioni di carte nel deck che possono essere catturate
 * da una carta giocata (in base al suo valore numerico). */
  private findCaptureCombinationsFlat(
    playedCard: any,
    deck: any[],
    flat?: boolean
  ): any[] {
    const targetValue = this.getCardNumericValue(playedCard);
    const results: any[][] = [];

    const findCombos = (remaining: any[], combo: any[] = [], sum: number = 0, start: number = 0) => {
      if (sum === targetValue) {
        results.push([...combo]);
        return;
      }
      if (sum > targetValue) return;

      for (let i = start; i < remaining.length; i++) {
        const cardValue = this.getCardNumericValue(remaining[i]);
        combo.push(remaining[i]);
        findCombos(remaining, combo, sum + cardValue, i + 1);
        combo.pop();
      }
    };

    // Trova tutte le combinazioni possibili
    findCombos(deck);

    if (flat) {
      // "appiattisci" tutte le combinazioni in un unico array
      const flatArray = results.flat();

      // Rimuovi duplicati (controllando rank + suit)
      const unique = flatArray.filter((card, index, self) =>
        index === self.findIndex(c => c.rank === card.rank && c.suit === card.suit)
      );

      // 🔹 Restituisci gli indici rispetto al deck
      return this.findMatchingIndices(unique, deck);
    } else {
      // 🔹 Restituisci le combinazioni come array di array senza flatten
      return results;
    }
  }


  private toggleSelectableCards(deck: any[], selectIndices: any[]) {

    this.hasSelectableCards = true
    this.toggleCards(deck, deck.map((_, i) => i), false);
    this.toggleCards(deck, selectIndices, true);
  }

  /* Abilita o disabilita determinate carte in un mazzo. */
  private toggleCards(deck: any[], indices: number[], selectable: boolean): void {
    indices.forEach(index => {
      if (deck[index]) {
        deck[index].selectable = selectable;
      }
    });
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
      pointsDeck: { deck: [], scopa: 0 },
      scopa: 0,
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
    this.gameForm.value.originalDeck = mainDeck;

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

    // Distribuzione carte nel centro SOLO se il gioco è 'scopa'
    if (gameName === 'scopa') {
      this.dealCardsToCenter(mainDeck, centerDeck, 4); // 4 carte nel centerDeck
      this.gameForm.patchValue({ centerDeck, mainDeck });
    }

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

    // Controllo se il primo giocatore è CPU
    const firstPlayerObj = updatedUsers.find(u => u.name === firstPlayer);
    if (firstPlayerObj?.playerType === 'cpu') {
      setTimeout(() => {
        this.cpuPlay();
      }, 2000); // piccola pausa per vedere la mossa
    }
  }

  private dealCardsToPlayers(users: any[], mainDeck: any[], cardsPerPlayer: number): any[] {
    // Controlla se ci sono abbastanza carte nel mazzo principale
    if ((mainDeck?.length || 0) < users.length * cardsPerPlayer) {
      console.log('💾 Stato pointsDeck:', users.map((e: any) => e.pointsDeck));
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
    console.log('Carte distribuite al centro:', movedCards.map((c: any) => `${c.rank} di ${c.suit}`));
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

  /**
  * Trova nel centerDeck le carte che possono essere raccolte per fare punti. 
  */
  getScopaCardsForValue(targetValue: number): any[] {
    const centerDeck: any[] = this.gameForm.get('centerDeck')?.value || [];

    // Prima verifica se c'è una carta esatta uguale a targetValue
    const exactMatch = centerDeck.filter((c: any) => this.getCardNumericValue(c) === targetValue);
    if (exactMatch.length > 0) return exactMatch;

    // Cerca tutte le combinazioni di carte che sommano al valore target
    const results: any[][] = [];

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

    if (results.length === 0) return [];

    // 🔹 Opzione: restituisci la combinazione con meno carte
    results.sort((a, b) => a.length - b.length);
    return results[0];
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
      console.log('💾 Stato pointsDeck:', users.map((e: any) => e.pointsDeck));
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
