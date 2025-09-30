import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game-layout.component.html',
  styleUrls: ['./game-layout.component.scss']
})
export class GameLayoutComponent implements OnInit {
  @Input() gameForm: any;
  @Input() hoveredCard: any;
  @Input() minPlayers: number = 2;

  // EventEmitter per delegare le azioni al componente genitore
  @Output() addPlayer = new EventEmitter<void>();
  @Output() addBots = new EventEmitter<void>();
  @Output() startGame = new EventEmitter<void>();
  @Output() playerDrawCard = new EventEmitter<string>();
  @Output() moveCardToCenterDeck = new EventEmitter<number>();
  @Output() hoverCard = new EventEmitter<any>();
  @Output() leaveCard = new EventEmitter<void>();

  ngOnInit(): void {
    console.log(this.gameForm)
  }

  // Metodi locali che emettono eventi
  onAddPlayer() { this.addPlayer.emit(); }
  onAddBots() { this.addBots.emit(); }
  onStartGame() { this.startGame.emit(); }
  onPlayerDrawCard(userName: string) { this.playerDrawCard.emit(userName); }
  onMoveCardToCenterDeck(cardIndex: number) { this.moveCardToCenterDeck.emit(cardIndex); }
  onHover(card: any) { this.hoverCard.emit(card); }
  onLeave() { this.leaveCard.emit(); }
  
  // Metodo utile già presente in BaseComponent
  getMyUserDeck() {
    const userName = this.gameForm.get('userName')?.value;
    return (this.gameForm.get('users')?.value || []).find((u: any) => u.name === userName)?.deck || [];
  }

  getCardBackground(card: any) {
    return { 'deck-white': true }; // per SCOPA tutte bianche
  }

  getCardCenterClass(card: any) {
    return `${card.suit.toLowerCase()} ${card.suit.toLowerCase()}-${card.rank.toLowerCase()}`;
  }
}
