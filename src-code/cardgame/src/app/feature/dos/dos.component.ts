import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { DosDeckService } from 'src/app/core/service/dos-deck.service';
import { DosGameService } from 'src/app/core/service/dos-game.service';
import { DosPeopleService } from 'src/app/core/service/dos-people.service';
import { DosUsersService } from 'src/app/core/service/dos-users.service';

@Component({
  selector: 'app-dos',
  templateUrl: './dos.component.html',
  styleUrls: ['./dos.component.scss']
})
export class DosComponent implements OnInit {
  gamePhase: string = '';
  deck: any = null;
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
    private authService: AuthService,
    private userService: DosUsersService
  ) { }

  ngOnInit(): void {
    this.gameForm = this.fb.group({
      deck: [''],
      centerDeck: [''],
      people: [''],
      user: [''],
      phase: ['']
    });
    this.gameForm.valueChanges.subscribe(value => {
      console.log(value, this.gameForm.value)
    })
    this.dosPeopleService.listenPeople().subscribe(async data => {
      if (data) {
        this.gameForm.patchValue({ people: data })
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

        // 🔹 Shuffle Fisher–Yates
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

        if (!user?.deck || user.deck.length === 0) {
          console.log('Assegno 7 carte iniziali all’utente');
          this.assignCardsToUser(7);
        }
      }
    });
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

  moveCardToCenterDeck(index: number) {
    const userDeck = (this.gameForm.get('user')?.value).deck || [];
    const centerDeck = this.gameForm.get('centerDeck')?.value || [];

    // Prendi la carta cliccata
    const card = userDeck[index];

    // Rimuovi dal deck dell'utente
    userDeck.splice(index, 1);

    // Aggiungi al centerDeck
    centerDeck.push(card);

    // Aggiorna il form
    this.gameForm.patchValue({
      user: { deck: userDeck },
      centerDeck: centerDeck
    });
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


  /**
  * Assegna `count` carte dal deck al user.deck nel form.
  * Gestisce 3 shape di `deck`:
  *  - Array:                deck = [{...}, {...}, ...]
  *  - Wrapped array:        deck = { deck: [{...}, ...], ... }
  *  - Map/object:           deck = { key1: {...}, key2: {...}, ... }
  *
  * Restituisce true se l'assegnazione è andata a buon fine, false altrimenti.
  */
  assignCardsToUser(count = 7): boolean {
    try {
      const deckCtrl = this.gameForm.get('deck');
      const userCtrl = this.gameForm.get('user');

      if (!deckCtrl) {
        console.warn('FormControl "deck" non trovato.');
        return false;
      }

      const rawDeck = deckCtrl.value;
      const rawUser = userCtrl?.value ?? {};

      // 1) nessun deck
      if (!rawDeck || (typeof rawDeck === 'object' && Object.keys(rawDeck).length === 0)) {
        console.warn('Deck vuoto o non definito.');
        return false;
      }

      // 2) se è un array semplice
      if (Array.isArray(rawDeck)) {
        const deckArray = [...rawDeck]; // copia
        if (deckArray.length < count) {
          console.warn('Non ci sono abbastanza carte nel deck.');
          return false;
        }
        const cardsToGive = deckArray.slice(0, count);
        const newDeck = deckArray.slice(count);

        const newUser = { ...rawUser, deck: cardsToGive };
        this.gameForm.patchValue({ deck: newDeck, user: newUser });
        return true;
      }

      // 3) se è wrapped: { deck: [...] , ... }
      if (rawDeck && Array.isArray(rawDeck.deck)) {
        const deckArray = [...rawDeck.deck];
        if (deckArray.length < count) {
          console.warn('Non ci sono abbastanza carte nel deck (wrapped).');
          return false;
        }
        const cardsToGive = deckArray.slice(0, count);
        const newDeckArray = deckArray.slice(count);
        const newDeckObj = { ...rawDeck, deck: newDeckArray };

        const newUser = { ...rawUser, deck: cardsToGive };
        this.gameForm.patchValue({ deck: newDeckObj, user: newUser });
        return true;
      }

      // 4) se è una mappa/object con chiavi Firebase: { key1: card, key2: card, ... }
      if (typeof rawDeck === 'object') {
        const entries = Object.entries(rawDeck); // [ [key, card], ... ]
        if (entries.length < count) {
          console.warn('Non ci sono abbastanza carte nel deck (map).');
          return false;
        }

        const toGiveEntries = entries.slice(0, count);
        const remainingEntries = entries.slice(count);

        // ricava le carte da assegnare aggiungendo eventualmente l'id originale
        const cardsToGive = toGiveEntries.map(([key, card]) => {
          // se la carta già ha un id lo preserviamo, altrimenti aggiungiamo la chiave
          return { ...(card as any), id: (card as any).id ?? key };
        });

        // ricostruisce la mappa rimanente
        const newDeckMap = Object.fromEntries(remainingEntries);

        const newUser = { ...rawUser, deck: cardsToGive };
        this.gameForm.patchValue({ deck: newDeckMap, user: newUser });
        return true;
      }

      console.warn('Formato deck non riconosciuto.');
      return false;
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

  async checkGamePhase(phase: string) {
    const uid = (await this.authService.getCurrentUser() as any).uid
    this.currentUser = await this.userService.getUser(uid);
    switch (phase) {
      case 'start':
        this.gamePhase = 'start';
        break;
      default: console.log(phase)
    }
  }

  selectPlayer(player: any) {
    console.log(player);

  }

  async startGame() {
    await this.dosGameService.savePhase('start');
  }

}
