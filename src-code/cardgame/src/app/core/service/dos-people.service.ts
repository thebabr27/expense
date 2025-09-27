import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';

 

@Injectable({
  providedIn: 'root'
})
export class DosPeopleService {

  private basePath = 'dos/game/people';

  constructor(private dbService: DatabaseService) {}

  // Create o Update (con id specifico)
  async savePerson(person: any, id?: string): Promise<void> {
    const personId = id ?? this.generateId();
    await this.dbService.writeData(`${this.basePath}/${personId}`, { ...person, id: personId });
  }

  // Read singola persona
  async getPerson(id: string): Promise<any | null> {
    return await this.dbService.readData<any>(`${this.basePath}/${id}`);
  }

  // Read tutte le persone una tantum
  async getAllPeople(): Promise<{ [key: string]: any } | null> {
    return await this.dbService.readData<{ [key: string]: any }>(this.basePath);
  }

  // Listen realtime tutte le persone
  listenPeople(): Observable<any | null> {
    return this.dbService.listenToData<{ [key: string]: any }>(this.basePath);
  }

  // Delete singola persona
  async deletePerson(id: string): Promise<void> {
    await this.dbService.writeData(`${this.basePath}/${id}`, null);
  }

  // Utility per generare ID casuale
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}
