import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';
 

@Injectable({
  providedIn: 'root'
})
export class DosUsersService {

  private basePath = 'dos/users';

  constructor(private dbService: DatabaseService) { }

  // Legge i dati di un utente singolo una tantum
  async getUser(uid: string): Promise<any | null> {
    return await this.dbService.readData<any>(`${this.basePath}/${uid}`);
  }

  // Ascolta i dati di un utente in tempo reale
  listenUser(uid: string): Observable<any | null> {
    return this.dbService.listenToData<any>(`${this.basePath}/${uid}`);
  }

  // Scrive o aggiorna i dati di un utente
  async saveUser(uid: string, data: Partial<any>): Promise<void> {
    await this.dbService.writeData(`${this.basePath}/${uid}`, data);
  }

  // Cancella l'utente (opzionale)
  async deleteUser(uid: string): Promise<void> {
    await this.dbService.writeData(`${this.basePath}/${uid}`, null);
  }
}
