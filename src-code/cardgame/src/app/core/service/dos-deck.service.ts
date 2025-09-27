import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';

export interface Card {
  id?: string;
  name: string;
  value: number;
  [key: string]: any; // campi extra
} 

@Injectable({
  providedIn: 'root'
})
export class DosDeckService {

  private basePath = 'dos/deck';

  constructor(private dbService: DatabaseService) {}

  // 🔹 Aggiunge una nuova carta (push)
  async addCard(card: Card): Promise<void> {
    await this.dbService.pushData(this.basePath, card);
  }  
  
  // 🔹 Scrive l’intero mazzo in un colpo solo
  async addDeck(deck: Card[]): Promise<void> {
    await this.dbService.writeData(this.basePath, { deck });
  }

  // 🔹 Legge tutte le carte una tantum
  async getAllCards(): Promise<{ [key: string]: Card } | null> {
    return await this.dbService.readData<{ [key: string]: Card }>(this.basePath);
  }

  // 🔹 Ascolta tutte le carte in tempo reale
  listenCards(): Observable<{ [key: string]: Card } | null> {
    return this.dbService.listenToData<{ [key: string]: Card }>(this.basePath);
  }

  // 🔹 Elimina una carta (serve la chiave generata da Firebase)
  async deleteCard(key: string): Promise<void> {
    await this.dbService.writeData(`${this.basePath}/${key}`, null);
  }
}

