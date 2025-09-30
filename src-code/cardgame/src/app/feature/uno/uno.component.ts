// uno.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-uno',
  templateUrl: './uno.component.html',
  styleUrls: ['./uno.component.scss']
})
export class UnoComponent {
  @Input() gameForm!: FormGroup;
  @Input() minPlayers!: number;
  @Input() nickname!: string;
  @Output() nicknameChange = new EventEmitter<string>();
  @Output() addPlayer = new EventEmitter<void>();
  @Output() addBots = new EventEmitter<void>();
  @Output() startGame = new EventEmitter<void>();

  hoveredCard: any = null;

  onHover(card: any) { this.hoveredCard = card; }
  onLeave() { this.hoveredCard = null; }
  // Deck dell'utente
  userDeck: any[] = [
    { color: 'Rosso', value: '5' },
    { color: 'Verde', value: '2' },
    { color: 'Blu', type: 'reverse' },
    { type: 'wild' }
  ];

  // Avversari (solo numero di carte)
  opponents: any[] = [
    { name: 'Giocatore 2', cards: 5 },
    { name: 'Giocatore 3', cards: 7 }
  ];

  // Center deck
  centerDeck = [
    { color: 'Giallo', value: '9' }
  ];
}
