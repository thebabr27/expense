// scopa.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-scopa',
  templateUrl: './scopa.component.html',
  styleUrls: ['./scopa.component.scss']
})
export class ScopaComponent implements OnInit {
  @Input() gameForm!: FormGroup;
  @Input() minPlayers!: number;
  @Input() nickname!: string;
  @Output() nicknameChange = new EventEmitter<string>();
  @Output() addPlayer = new EventEmitter<void>();
  @Output() addBots = new EventEmitter<void>();
  @Output() startGame = new EventEmitter<void>();

  hoveredCard: any = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Mazzo utente finto
    const userDeck = [
      { suit: 'Denari', rank: 'asso' },
      { suit: 'Spade', rank: '7' },
      { suit: 'Coppe', rank: 're' }
    ]; 

    // Center deck
    const centerDeck = [
      { suit: 'Denari', rank: '5' },
      { suit: 'Bastoni', rank: '3' }
    ];

    // Creo il form fake
    this.gameForm = this.fb.group({
      gameName: ['scopa'],
      phase: ['start-playing'],
      users: this.fb.array([
        { name: 'Giocatore 1', deck: userDeck },
        { name: 'Giocatore 2', deck: [{ suit: 'Coppe', rank: '2' }] },
        { name: 'Giocatore 3', deck: [{ suit: 'Bastoni', rank: '7' }] }
      ]),
      userName: ['Giocatore 1'],
      centerDeck: [centerDeck]
    });

  }
  onHover(card: any) { this.hoveredCard = card; }
  onLeave() { this.hoveredCard = null; }
}
