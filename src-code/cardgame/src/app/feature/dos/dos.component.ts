import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/core/service/alert.service';
import { DosDeckService } from 'src/app/core/service/dos-deck.service';
import { DosGameService } from 'src/app/core/service/dos-game.service';
import { DosPeopleService } from 'src/app/core/service/dos-people.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dos',
  templateUrl: './dos.component.html',
  styleUrls: ['./dos.component.scss']
})
export class DosComponent implements OnInit, AfterViewInit {
  @ViewChild('modalTrigger', { static: false }) modalTrigger!: ElementRef<HTMLElement>;

  gamePhase: string = '';
  myDeck: any = null;
  nickname: string = '';
  people: any[] = [];
  data: any;
  currentUser: any;
  gameForm!: FormGroup;
  deckCreated = false;
  stackDrawCards: number = 0;

  isCardPlayable = (card: any): boolean => {
    const currentColor = this.gameForm.get('currentColor')?.value;
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    const topCard = centerDeck[centerDeck.length - 1];

    // Se non c'è carta sul centro mazzo, tutte le carte numeriche (non speciali) possono essere giocate
    if (!topCard) return card.value !== undefined;

    // Carta giocabile se:
    return (
      card.color === currentColor ||           // stesso colore o colore scelto dopo Wild/+4
      card.type === 'wild' ||                  // wild sempre giocabile
      card.type === 'wild-draw-four' ||        // +4 sempre giocabile
      (card.value !== undefined && card.value === topCard.value) // stesso valore numerico
    );
  };


  constructor(
    private fb: FormBuilder,
    private dosGameService: DosGameService,
    private dosPeopleService: DosPeopleService,
    private dosDeckService: DosDeckService,
    private alertService: AlertService
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.gameForm = this.fb.group({
      deck: [[]],
      centerDeck: [[]],
      people: [[]],
      userName: ['Marco'],
      users: [[]],
      phase: [''],
      peopleInTurn: [''],
      currentColor: [''],
      direction: [1]
    });

    this.gameForm.valueChanges.subscribe(value => {

      this.calculateMarginForDeckContainer(this.gameForm.value.deck.length);
    })
    this.dosPeopleService.listenPeople().subscribe(async data => {
      if (data) {
        const users = data.map((p: any) => ({
          name: p.name,
          playerType: p.playerType,
          deck: [],
          played: false,
          drawed: false
        }));


        this.gameForm.patchValue({
          people: data,
          users: users,
          peopleInTurn: data[0].name // 🔹 di default parte il primo
        });
      }
    });
    this.dosGameService.listenGames().subscribe(async data => {
      if (data && (data as any).phase) {
        this.gameForm.patchValue({ phase: (data as any).phase });
      }

    })

    this.dosDeckService.listenCards().subscribe(async data => {
      if (data) {
        let deck = (data as any);

        // Se vuoi solo l'array di carte: se è wrapped { deck: [...] }
        if (deck.deck && Array.isArray(deck.deck)) {
          deck = [...deck.deck]; // copia dell'array
        } else if (Array.isArray(deck)) {
          deck = [...deck]; // copia dell'array
        } else {
          console.warn('Deck non in formato array, impossibile mischiare.');
          this.gameForm.patchValue({ deck });
          return;
        }

        // Shuffle Fisher–Yates
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Patcha il form con il deck mescolato
        this.gameForm.patchValue({ deck });
        this.deckCreated = true;
      }

      if (!data && !this.deckCreated) {
        console.log('Nessun deck presente, creo un mazzo di 40 carte');
        await this.createUnoDeck(); // ✅ async solo nel callback
      } else {
        console.log('Deck già presente');
        const user = this.gameForm.get('user')?.value;
        const deck = this.gameForm.get('deck')?.value || [];
        // Controllo nella fase start-waiting
        if (this.gameForm.get('phase')?.value === 'start-waiting') {
          const users = this.gameForm.get('users')?.value || [];
          const deck = this.gameForm.get('deck')?.value || [];

          if (users.length && deck.length) {
            // Assegna 7 carte a ciascun giocatore
            const newUsers = users.map((user: any) => {
              const userDeck = deck.splice(0, 7); // prende 7 carte dal deck
              return { ...user, deck: userDeck };
            });

            this.gameForm.patchValue({
              users: newUsers,
              deck: deck,                  // rimasto nel mazzo principale
              phase: 'start-playing'       // cambio fase
            });

            console.log('Carte iniziali assegnate a tutti i giocatori, fase aggiornata a start-playing');
          }
        }

      }
    });
  }

  getMyUserDeck(): any[] {
    const users = this.gameForm.get('users')?.value || [];
    const myName = this.gameForm.get('userName')?.value

    const me = users.find((u: any) => u.name === myName);
    return me?.deck || [];
  }

  getCurrentUserDeck(): any[] {
    const users = this.gameForm.get('users')?.value || [];
    const currentTurn = this.gameForm.get('peopleInTurn')?.value;

    const user = users.find((u: any) => u.name === currentTurn);
    return user?.deck || [];
  }

  chooseColor(color: string) {
    const myName = this.gameForm.get('userName')?.value;
    const users = this.gameForm.get('users')?.value || [];
    const people = this.gameForm.get('people')?.value || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];

    const userIndex = users.findIndex((u: any) => u.name === myName);
    if (userIndex === -1) return;
    const user = users[userIndex];

    // Trova la carta Wild/+4 giocata
    const wildIndex = user.deck.findIndex((c: any) => c.type === 'wild' || c.type === 'wild-draw-four');
    if (wildIndex === -1) return;
    const card = user.deck[wildIndex];

    // Rimuovi carta dal deck dell’utente
    const newUserDeck = [...user.deck];
    newUserDeck.splice(wildIndex, 1);

    const newUsers = [...users];
    newUsers[userIndex] = { ...user, deck: newUserDeck, played: true, drawed: false };

    const newCenterDeck = [...centerDeck, card];

    // Aggiorna form con carta giocata e colore scelto
    this.gameForm.patchValue({
      currentColor: color,
      users: newUsers,
      centerDeck: newCenterDeck
    });

    // Mostra alert con quadratino colore
    const colorMap: Record<string, string> = {
      Rosso: '#FF4C4C',
      Verde: '#4CAF50',
      Blu: '#2196F3',
      Giallo: '#FFEB3B'
    };
    const colorSquare = `<span style="display:inline-block;width:12px;height:12px;margin-left:5px;border-radius:3px;background-color:${colorMap[color]}"></span>`;
    this.alertService.triggerAlert(
      'info',
      `Hai scelto il colore: ${colorSquare} ${color}`,
      'palette'
    );

    // Se stackDrawCards > 0, applica pesca automatica al prossimo giocatore se non ha +2/+4
    if (this.stackDrawCards > 0) {
      const currentIndex = people.findIndex((p: any) => p.name === myName);
      const direction = this.gameForm.get('direction')?.value || 1;
      const nextIndex = (currentIndex + direction + people.length) % people.length;
      const nextPlayerName = people[nextIndex]?.name || null;

      if (nextPlayerName) {
        const nextUserIndex = newUsers.findIndex((u: any) => u.name === nextPlayerName);
        const nextUser = newUsers[nextUserIndex];

        const nextHasCounter =
          (card.type === 'draw-two' && nextUser.deck.some((c: any) => c.type === 'draw-two')) ||
          (card.type === 'wild-draw-four' && nextUser.deck.some((c: any) => c.type === 'wild-draw-four'));

        if (!nextHasCounter) {
          const deck = this.gameForm.get('deck')?.value || [];
          const drawnCards = deck.splice(0, this.stackDrawCards);
          const updatedDeck = [...nextUser.deck, ...drawnCards];

          newUsers[nextUserIndex] = { ...nextUser, deck: updatedDeck };

          this.gameForm.patchValue({ users: newUsers, deck });
          this.alertService.triggerAlert(
            'warning',
            `${nextPlayerName} pesca ${drawnCards.length} carte per effetto di ${card.name}`,
            'exclamation-circle'
          );

          // reset stackDrawCards
          this.stackDrawCards = 0;
        }
      }
    }

    // Chiudi il modal
    const modalEl = document.getElementById('colorModal');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();

    // Continua il turno normalmente
    this.continueTurnAfterWild(myName);
  };



  getCurrentUser(): any {
    const users = this.gameForm.get('users')?.value || [];
    const currentTurn = this.gameForm.get('peopleInTurn')?.value;

    return users.find((u: any) => u.name === currentTurn) || null;
  }



  /**
 * Calcola il margin-left da applicare al container del deck
 * per centrare la carta di mezzo
 */
  calculateMarginForDeckContainer(deckLength: number): string {
    if (!deckLength || deckLength <= 1) return '0px';

    const middleIndex = Math.floor(deckLength / 2); // indice della carta di mezzo
    const offset = 30; // pixel di sovrapposizione tra carte

    // sposta il container a sinistra del numero di carte prima della centrale
    const margin = -middleIndex * offset;
    return `${margin}px`;
  }

  private setUserPlayed(userName: string, value: boolean) {
    const users = this.gameForm.get('users')?.value || [];
    const userIndex = users.findIndex((u: any) => u.name === userName);
    if (userIndex === -1) return;

    const user = users[userIndex];
    const newUsers = [...users];
    newUsers[userIndex] = { ...user, played: value };

    this.gameForm.patchValue({ users: newUsers });
  }

  // ===================
  // APPLICA REGOLE + CALCOLO PROSSIMO GIOCATORE
  // ===================
  applyCardRule = (card: any, currentIndex: number, peopleLength: number): number => {
    let direction = this.gameForm.get('direction')?.value || 1;
    let nextIndex = currentIndex;

    switch (card.type) {
      case 'skip':
        nextIndex = (currentIndex + direction * 2 + peopleLength) % peopleLength;
        const nextPlayerNameSkip = this.people[nextIndex]?.name || '';
        this.alertService.triggerAlert(
          'info',
          'Carta SKIP: il turno del prossimo giocatore salta! Tocca a ' + nextPlayerNameSkip,
          'forward'
        );
        break;

      case 'reverse':
        direction *= -1;
        this.gameForm.patchValue({ direction });
        nextIndex = (currentIndex + direction + peopleLength) % peopleLength;
        const nextPlayerNameReverse = this.people[nextIndex]?.name || '';
        this.alertService.triggerAlert(
          'info',
          'Carta REVERSE: il giro del turno invertito! Tocca a ' + nextPlayerNameReverse,
          'repeat'
        );
        break;

      default:
        nextIndex = (currentIndex + direction + peopleLength) % peopleLength;
        break;
    }

    return nextIndex;
  };

  // ===================
  // METODO PRINCIPALE AGGIORNATO
  // ===================

  moveCardToCenterDeck(index: number, sourceUserName: string) {
    const users = this.gameForm.get('users')?.value || [];
    const people = this.gameForm.get('people')?.value || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    const myName = this.gameForm.get('userName')?.value;
    if (!myName) return;

    const userIndex = users.findIndex((u: any) => u.name === sourceUserName);
    if (userIndex === -1) return;
    const user = users[userIndex];

    const card = user.deck[index];
    if (!card) return;

    const topCard = centerDeck[centerDeck.length - 1];
    const activeColor = this.gameForm.get('currentColor')?.value || topCard?.color;

    // 🔹 Controllo validità carta
    let isValid = false;
    if (!topCard) {
      isValid = !!card.value && !card.type;
    } else {
      isValid =
        card.color === activeColor ||
        card.value === topCard.value ||
        card.type === 'wild' ||
        card.type === 'wild-draw-four';
    }

    if (!isValid) {
      this.alertService.triggerAlert(
        'error',
        `Carta non valida: ${card.name} non può essere giocata sopra ${topCard?.name || 'null'}`,
        'x-circle'
      );
      return;
    }

    // 🔹 Aggiorna deck utente e centro mazzo
    const newUserDeck = [...user.deck];
    newUserDeck.splice(index, 1);
    const newUsers = [...users];
    newUsers[userIndex] = { ...user, deck: newUserDeck, played: true, drawed: false };
    const newCenterDeck = [...centerDeck, card];

    // 🔹 Wild / +4 giocata da umano → mostra popup
    if (sourceUserName === myName && (card.type === 'wild' || card.type === 'wild-draw-four')) {
      if (this.modalTrigger) this.modalTrigger.nativeElement.click();
      return;
    } else if (card.color) {
      this.gameForm.patchValue({ currentColor: card.color });
    }

    // 🔹 Gestione +2/+4 e stack
    if (card.type === 'draw-two' || card.type === 'wild-draw-four') {
      this.stackDrawCards += card.type === 'draw-two' ? 2 : 4;

      const direction = this.gameForm.get('direction')?.value || 1;
      const currentIndex = people.findIndex((p: any) => p.name === sourceUserName);
      let nextIndex = (currentIndex + direction + people.length) % people.length;
      let nextPlayerName = people[nextIndex]?.name;

      const nextUserIndex = newUsers.findIndex((u: any) => u.name === nextPlayerName);
      const nextUser = newUsers[nextUserIndex];

      // Controlla se il prossimo può rispondere
      const canCounter =
        (card.type === 'draw-two' && nextUser.deck.some((c: any) => c.type === 'draw-two')) ||
        (card.type === 'wild-draw-four' && nextUser.deck.some((c: any) => c.type === 'wild-draw-four'));

      if (!canCounter) {
        const deck = this.gameForm.get('deck')?.value || [];
        const drawnCards = deck.splice(0, this.stackDrawCards);
        const updatedDeck = [...nextUser.deck, ...drawnCards];

        newUsers[nextUserIndex] = { ...nextUser, deck: updatedDeck };
        this.gameForm.patchValue({ users: newUsers, deck });

        this.alertService.triggerAlert(
          'warning',
          `${nextPlayerName} pesca ${drawnCards.length} carte per effetto di ${card.name}`,
          'exclamation-circle'
        );

        // reset stack
        this.stackDrawCards = 0;

        // Passa turno al giocatore successivo
        nextIndex = (nextIndex + direction + people.length) % people.length;
        nextPlayerName = people[nextIndex]?.name;
      }
    }

    // 🔹 Calcola prossimo giocatore normale (SKIP/REVERSE ecc.) 
    let nextPlayerName: string | null = null;
    if (!card.type?.includes('draw')) {
      const currentIndex = people.findIndex((p: any) => p.name === sourceUserName);
      const nextIndex = this.applyCardRule(card, currentIndex, people.length);
      nextPlayerName = people[nextIndex]?.name || null;
    }

    // 🔹 Reset stato played/drawed al prossimo giocatore
    if (nextPlayerName) {
      const nextUserIndex = newUsers.findIndex((u: any) => u.name === nextPlayerName);
      if (nextUserIndex !== -1) {
        newUsers[nextUserIndex] = { ...newUsers[nextUserIndex], played: false, drawed: false };
      }
    }

    // 🔹 Aggiorna form
    this.gameForm.patchValue({
      users: newUsers,
      user: myName === sourceUserName ? newUsers[userIndex] : this.gameForm.get('user')?.value,
      centerDeck: newCenterDeck,
      peopleInTurn: nextPlayerName
    });

    // 🔹 Toast CPU / giocatore
    this.alertService.triggerAlert(
      'info',
      `${sourceUserName} gioca ${card.name} ${card.color ? '(' + card.color + ')' : ''}`,
      'info'
    );

    // 🔹 Controlla UNO / fine partita
    if (newUserDeck.length === 1) {
      this.alertService.triggerAlert('info', `${sourceUserName} dice UNO!`, 'alert-circle');
    } else if (newUserDeck.length === 0) {
      this.alertService.triggerAlert('success', `${sourceUserName} ha vinto la partita!`, 'trophy');
      return;
    }

    // 🔹 Se prossimo è CPU → fallo giocare
    if (nextPlayerName) {
      const nextPlayer = newUsers.find((u: any) => u.name === nextPlayerName);
      if (nextPlayer?.playerType === 'cpu') {
        setTimeout(() => this.cpuPlay(nextPlayerName as string), 1500);
      }
    }
  }


  // ===================
  // PLAYER PESCA (se non ha carte giocabili)
  // ===================
  playerDrawCard = (playerName: string) => {
    const users = this.gameForm.get('users')?.value || [];
    const people = this.gameForm.get('people')?.value || [];
    const deck = this.gameForm.get('deck')?.value || [];
    const userIndex = users.findIndex((p: any) => p.name === playerName);
    if (userIndex === -1) return;
    const user = users[userIndex];

    if (deck.length > 0) {
      const drawnCard = deck[0];
      const newDeck = deck.slice(1);
      const updatedUserDeck = [...user.deck, drawnCard];

      const newUsers = [...users];
      newUsers[userIndex] = { ...user, deck: updatedUserDeck, played: true, drawed: true };

      this.gameForm.patchValue({ deck: newDeck, users: newUsers });

      this.alertService.triggerAlert('warning', `${playerName} pesca una carta`, 'card');

      // Controlla se la carta pescata è giocabile
      const topCard = this.gameForm.get('centerDeck')?.value?.slice(-1)[0];
      const currentColor = this.gameForm.get('currentColor')?.value || topCard?.color;
      console.log(topCard, currentColor)
      const playable =
        drawnCard.color === currentColor ||
        drawnCard.value === topCard?.value ||
        drawnCard.type === 'wild' ||
        drawnCard.type === 'wild-draw-four';

      if (playable) {
        setTimeout(() => this.moveCardToCenterDeck(updatedUserDeck.length - 1, playerName), 1500);
      } else {
        // Carta non giocabile → passa turno al prossimo
        const currentIndex = people.findIndex((p: any) => p.name === playerName);
        const direction = this.gameForm.get('direction')?.value || 1;
        const nextIndex = (currentIndex + direction + people.length) % people.length;
        const nextPlayer = people[nextIndex]?.name || null;

        // Reset stato played/drawed per il player che ha pescato
        newUsers[userIndex] = { ...newUsers[userIndex], played: false, drawed: false };

        this.gameForm.patchValue({ users: newUsers, peopleInTurn: nextPlayer });

        // Se prossimo è CPU → fallo giocare
        if (nextPlayer) {
          const nextCpu = newUsers.find((p: any) => p.name === nextPlayer);
          if (nextCpu?.playerType === 'cpu') setTimeout(() => this.cpuPlay(nextPlayer as string), 1500);
        }
      }
    }
  };

  continueTurnAfterWild = (playerName: string) => {
    // Qui puoi chiamare applyCardRule e decidere il prossimo giocatore
    const users = this.gameForm.get('users')?.value || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    const people = this.gameForm.get('people')?.value || [];

    const card = centerDeck[centerDeck.length - 1]; // carta appena giocata
    if (!card) return;

    const currentIndex = people.findIndex((p: any) => p.name === playerName);
    const nextIndex = this.applyCardRule(card, currentIndex, people.length);
    const nextPlayerName = people[nextIndex]?.name || null;

    this.gameForm.patchValue({ peopleInTurn: nextPlayerName });

    // Se il prossimo è CPU
    if (nextPlayerName) {
      const nextPlayer = users.find((p: any) => p.name === nextPlayerName);
      if (nextPlayer?.playerType === 'cpu') {
        setTimeout(() => this.cpuPlay(nextPlayerName as string), 1500);
      }
    }
  };


  // ===================
  // METODO CPU
  // ===================
  private cpuPlay(cpuName: string) {
    const users = this.gameForm.get('users')?.value || [];
    const people = this.gameForm.get('people')?.value || [];
    const cpuIndex = users.findIndex((u: any) => u.name === cpuName);
    if (cpuIndex === -1) return;
    const cpu = users[cpuIndex];

    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    const topCard = centerDeck[centerDeck.length - 1];
    const currentColor = this.gameForm.get('currentColor')?.value || topCard?.color;

    // Cerca carta giocabile considerando colore, valore e carte speciali
    const playableIndex = cpu.deck.findIndex((c: any) =>
      c.color === currentColor ||
      c.value === topCard?.value ||
      c.type === 'wild' ||
      c.type === 'wild-draw-four' ||
      (topCard?.type === 'draw-two' && c.type === 'draw-two') ||
      (topCard?.type === 'wild-draw-four' && c.type === 'wild-draw-four')
    );

    if (playableIndex !== -1) {
      const card = cpu.deck[playableIndex];

      // Se è Wild o +4 → scegli colore random e mostra alert
      if (card.type === 'wild' || card.type === 'wild-draw-four') {
        const colors = ['Rosso', 'Verde', 'Blu', 'Giallo'];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];
        const colorMap: Record<string, string> = {
          Rosso: '#FF4C4C',
          Verde: '#4CAF50',
          Blu: '#2196F3',
          Giallo: '#FFEB3B'
        };
        const colorSquare = `<span style="display:inline-block;width:12px;height:12px;margin-left:5px;border-radius:3px;background-color:${colorMap[chosenColor]}"></span>`;

        this.gameForm.patchValue({ currentColor: chosenColor });

        this.alertService.triggerAlert(
          'info',
          `${cpuName} gioca ${card.name} e sceglie il colore: ${colorSquare} ${chosenColor}`,
          'info'
        );
      }

      // Aggiorna stackDrawCards solo se +2/+4
      if (card.type === 'draw-two') this.stackDrawCards += 2;
      if (card.type === 'wild-draw-four') this.stackDrawCards += 4;

      // Gioca la carta
      this.moveCardToCenterDeck(playableIndex, cpuName);

      // 🔹 Mostra alert / toast che la CPU ha giocato una carta
      const displayCardName = card.name || (card.type === 'wild' ? 'Wild' : card.type);
      this.alertService.triggerAlert(
        'info',
        `${cpuName} ha giocato ${displayCardName}${card.color ? ` (${card.color})` : ''}`,
        'info'
      );

    } else {
      // CPU pesca
      const deck = this.gameForm.get('deck')?.value || [];
      if (deck.length > 0) {
        const drawnCard = deck[0];
        const newDeck = deck.slice(1);
        const newCpuDeck = [...cpu.deck, drawnCard];
        users[cpuIndex] = { ...cpu, deck: newCpuDeck };

        this.gameForm.patchValue({ deck: newDeck, users });
        this.alertService.triggerAlert('warning', `${cpuName} pesca una carta`, 'card');

        // Se la carta pescata è giocabile → gioca automaticamente
        const topCardAfterDraw = centerDeck[centerDeck.length - 1];
        const colorAfterDraw = this.gameForm.get('currentColor')?.value || topCardAfterDraw?.color;
        const playableAfterDraw =
          drawnCard.color === colorAfterDraw ||
          drawnCard.value === topCardAfterDraw?.value ||
          drawnCard.type === 'wild' ||
          drawnCard.type === 'wild-draw-four' ||
          (topCardAfterDraw?.type === 'draw-two' && drawnCard.type === 'draw-two') ||
          (topCardAfterDraw?.type === 'wild-draw-four' && drawnCard.type === 'wild-draw-four');

        if (playableAfterDraw) {
          setTimeout(() => this.moveCardToCenterDeck(newCpuDeck.length - 1, cpuName), 1500);
        }
      }
    }
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

  assignCardsToUser(count = 7, userName: string): boolean {
    try {
      const deckCtrl = this.gameForm.get('deck');
      const usersCtrl = this.gameForm.get('users');

      if (!deckCtrl || !usersCtrl) return false;

      const deck = [...deckCtrl.value];
      const users = [...usersCtrl.value];

      const userIndex = users.findIndex((u: any) => u.name === userName);
      if (userIndex === -1) return false;

      if (deck.length < count) {
        console.warn('Non ci sono abbastanza carte nel deck.');
        return false;
      }

      const cardsToGive = deck.slice(0, count);
      const newDeck = deck.slice(count);

      users[userIndex] = {
        ...users[userIndex],
        deck: [...(users[userIndex].deck || []), ...cardsToGive]
      };

      this.gameForm.patchValue({
        deck: newDeck,
        users: users
      });

      return true;
    } catch (err) {
      console.error('Errore in assignCardsToUser:', err);
      return false;
    }
  }


  // Crea un mazzo standard di 40 carte
  private async createDeck() {
    const suits = ['Cuori', 'Quadri', 'Fiori', 'Picche'];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 10 carte per seme → 4*10 = 40 carte
    const deck: any[] = [];

    for (const suit of suits) {
      for (const num of numbers) {
        deck.push({ name: `${num} di ${suit}`, value: num });
      }
    }

    // Scrive tutte le carte nel database 
    await this.dosDeckService.addDeck(deck);

    console.log('Mazzo creato!');
  }

  private async createUnoDeck() {
    const colors = ['Rosso', 'Verde', 'Blu', 'Giallo'];
    const deck: any[] = [];

    // Numeri
    for (const color of colors) {
      // Uno 0 per colore
      deck.push({ name: `0 ${color}`, value: 0, color });

      // Due copie per ogni numero 1-9
      for (let num = 1; num <= 9; num++) {
        deck.push({ name: `${num} ${color}`, value: num, color });
        deck.push({ name: `${num} ${color}`, value: num, color });
      }

      // Carte azione (2 copie per colore)
      for (let i = 0; i < 2; i++) {
        deck.push({ name: `+2 ${color}`, type: 'draw-two', color });
        deck.push({ name: `Reverse ${color}`, type: 'reverse', color });
        deck.push({ name: `Skip ${color}`, type: 'skip', color });
      }
    }

    // Carte Jolly (senza colore)
    for (let i = 0; i < 4; i++) {
      deck.push({ name: 'Wild', type: 'wild' });
      deck.push({ name: 'Wild +4', type: 'wild-draw-four' });
    }

    // Salva tutto il deck nel db
    await this.dosDeckService.addDeck(deck);

    console.log(`Mazzo UNO creato con ${deck.length} carte!`);
  }


  addPeople() {
    this.people.push(this.nickname)
  }

  selectPlayer(player: any) {
    console.log(player);

  }

  async startGame() {
    await this.dosGameService.savePhase('start');
  }

}
