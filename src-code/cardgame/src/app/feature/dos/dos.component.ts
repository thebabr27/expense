import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/core/service/alert.service';
import { DosDeckService } from 'src/app/core/service/dos-deck.service';
import { DosGameService } from 'src/app/core/service/dos-game.service';
import { DosPeopleService } from 'src/app/core/service/dos-people.service';

@Component({
  selector: 'app-dos',
  templateUrl: './dos.component.html',
  styleUrls: ['./dos.component.scss']
})
export class DosComponent implements OnInit {
  gamePhase: string = '';
  myDeck: any = null;
  nickname: string = '';
  people: any[] = [];
  data: any;
  currentUser: any;
  gameForm!: FormGroup;
  deckCreated = false;

  constructor(
    private fb: FormBuilder,
    private dosGameService: DosGameService,
    private dosPeopleService: DosPeopleService,
    private dosDeckService: DosDeckService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.gameForm = this.fb.group({
      deck: [[]],
      centerDeck: [[]],
      people: [[]],
      userName: ['Marco'],
      users: [[]],
      phase: [''],
      peopleInTurn: [''],
      currentColor: ['']
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
          played: false
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

  drawCard(userName: string) {
    const deck = this.gameForm.get('deck')?.value || [];
    const users = this.gameForm.get('users')?.value || [];
    if (!deck.length) return;

    const userIndex = users.findIndex((u: any) => u.name === userName);
    if (userIndex === -1) return;

    const user = users[userIndex];
    const drawnCard = deck[0];
    const newDeck = deck.slice(1);

    const newUserDeck = [...user.deck, drawnCard];

    const newUsers = [...users];
    newUsers[userIndex] = { ...user, deck: newUserDeck, played: false }; // 👈 ha pescato, non ancora giocato

    this.gameForm.patchValue({
      deck: newDeck,
      users: newUsers
    });

    console.log(`${userName} pesca una carta: ${drawnCard.name}`);
  }

  // Calcola il prossimo giocatore standard
  private getNextPlayerIndex(currentIndex: number, totalPlayers: number): number {
    return (currentIndex + 1) % totalPlayers;
  }

  // Applica la regola della carta giocata (skip / reverse / default)
  private applyCardRule(card: any, currentIndex: number, totalPlayers: number): number {
    if (card.type === 'skip') {
      return (currentIndex + 2) % totalPlayers;
    }
    if (card.type === 'reverse') {
      return (currentIndex - 1 + totalPlayers) % totalPlayers;
    }
    return this.getNextPlayerIndex(currentIndex, totalPlayers);
  }

  // Metodo principale aggiornato con toast
  moveCardToCenterDeck(index: number, sourceUserName: string) {
    const users = this.gameForm.get('users')?.value || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];
    const people = this.gameForm.get('people')?.value || [];

    const myName = this.gameForm.get('userName')?.value;
    if (!myName) return;

    // Trova l'utente
    const userIndex = users.findIndex((u: any) => u.name === sourceUserName);
    if (userIndex === -1) return;
    const user = users[userIndex];

    // Carta selezionata
    const card = user.deck[index];
    if (!card) return;

    // ✅ Controllo regole UNO (usando currentColor se esiste)
    let activeColor = card.color;
    if (centerDeck.length > 0) {
      const topCard = centerDeck[centerDeck.length - 1];
      activeColor = this.gameForm.get('currentColor')?.value || topCard.color;
      const isValid =
        card.color === activeColor ||
        card.value === topCard.value ||
        card.type === 'wild' ||
        card.type === 'wild-draw-four';

      if (!isValid) {
        this.alertService.triggerAlert(
          'error',
          `Carta non valida: ${card.name} non può essere giocata sopra ${topCard.name}`,
          'x-circle'
        );
        return;
      }
    }

    // 🔹 Aggiorna deck dell’utente
    const newUserDeck = [...user.deck];
    newUserDeck.splice(index, 1);

    const newUsers = [...users];
    newUsers[userIndex] = { ...user, deck: newUserDeck, played: true }; // ✅ ha giocato

    const newCenterDeck = [...centerDeck, card];

    // 🔹 Calcola prossimo giocatore con regola applicata
    let nextPlayerName: string | null = null;
    if (people.length > 0) {
      const currentIndex = people.findIndex((p: any) => p.name === sourceUserName);
      const nextIndex = this.applyCardRule(card, currentIndex, people.length);
      nextPlayerName = people[nextIndex]?.name || null;
    }

    // 🔹 Reset stato played al prossimo giocatore
    if (nextPlayerName) {
      const nextUserIndex = newUsers.findIndex((u: any) => u.name === nextPlayerName);
      if (nextUserIndex !== -1) {
        newUsers[nextUserIndex] = { ...newUsers[nextUserIndex], played: false };
      }
    }

    // 🔹 Aggiorna stato globale
    this.gameForm.patchValue({
      users: newUsers,
      user: myName === sourceUserName ? newUsers[userIndex] : this.gameForm.get('user')?.value,
      centerDeck: newCenterDeck,
      peopleInTurn: nextPlayerName
    });

    // 🔹 Cambio colore se Wild giocata da avversario
    if (sourceUserName !== myName && (card.type === 'wild' || card.type === 'wild-draw-four')) {
      const colorCounts: { [key: string]: number } = {};
      newUserDeck.forEach(c => {
        if (c.color) colorCounts[c.color] = (colorCounts[c.color] || 0) + 1;
      });
      const newColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b, 'Rosso');

      this.gameForm.patchValue({ currentColor: newColor });

      this.alertService.triggerAlert(
        'info',
        `${sourceUserName} ha cambiato colore della Wild a ${newColor}!`,
        'palette'
      );
    }

    // 🔹 Se il prossimo è CPU → fallo giocare
    if (nextPlayerName) {
      const nextPlayer = newUsers.find((u: any) => u.name === nextPlayerName);
      if (nextPlayer?.playerType === 'cpu') {
        setTimeout(() => this.cpuPlay(nextPlayerName!), 500);
      }
    }
  }

  private cpuPlay(cpuName: string) {
    const users = this.gameForm.get('users')?.value || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];

    const cpu = users.find((u: any) => u.name === cpuName);
    if (!cpu) return;

    const topCard = centerDeck[centerDeck.length - 1];
    const currentColor = this.gameForm.get('currentColor')?.value || topCard.color;

    const playableIndex = cpu.deck.findIndex((c: any) =>
      c.color === currentColor ||
      c.value === topCard.value ||
      c.type === 'wild' ||
      c.type === 'wild-draw-four'
    );

    if (playableIndex !== -1) {
      // ✅ ha una carta giocabile
      this.moveCardToCenterDeck(playableIndex, cpuName);
    } else {
      // 🚨 pesca
      const deck = this.gameForm.get('deck')?.value || [];
      if (deck.length > 0) {
        const drawnCard = deck[0];
        const newDeck = deck.slice(1);
        const newCpuDeck = [...cpu.deck, drawnCard];

        const newUsers = [...users];
        const cpuIndex = newUsers.findIndex((u: any) => u.name === cpuName);
        if (cpuIndex !== -1) newUsers[cpuIndex] = { ...cpu, deck: newCpuDeck };

        this.gameForm.patchValue({ deck: newDeck, users: newUsers });

        this.alertService.triggerAlert('warning', `${cpuName} pesca una carta`, 'card');

        // Se la carta pescata è giocabile → la gioca
        if (
          drawnCard.color === currentColor ||
          drawnCard.value === topCard.value ||
          drawnCard.type === 'wild' ||
          drawnCard.type === 'wild-draw-four'
        ) {
          setTimeout(() => this.moveCardToCenterDeck(newCpuDeck.length - 1, cpuName), 500);
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
