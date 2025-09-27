import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from './database.service';

export interface Game {
  id?: string;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class DosGameService {

  private basePath = 'dos/game';

  constructor(private dbService: DatabaseService) {}

  // Create o Update (con id specifico)
  async saveGame(game: any, id?: string): Promise<void> {
    const gameId = id ?? this.generateId();
    await this.dbService.writeData(`${this.basePath}/${gameId}`, { ...game, id: gameId });
  } 
  
  // Nuovo metodo: salva solo la fase del gioco
  async savePhase(phase: string): Promise<void> {
    await this.dbService.writeData(`${this.basePath}/phase`, phase);
  }

  // Read singolo game
  async getGame(id: string): Promise<Game | null> {
    return await this.dbService.readData<Game>(`${this.basePath}/${id}`);
  }

  // Read tutti i game una tantum
  async getAllGames(): Promise<{ [key: string]: Game } | null> {
    return await this.dbService.readData<{ [key: string]: Game }>(this.basePath);
  }

  // Listen realtime a tutti i game
  listenGames(): Observable<{ [key: string]: Game } | null> {
    return this.dbService.listenToData<{ [key: string]: Game }>(this.basePath);
  }

  // Delete singolo game
  async deleteGame(id: string): Promise<void> {
    await this.dbService.writeData(`${this.basePath}/${id}`, null);
  }

  // Utility per creare ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}