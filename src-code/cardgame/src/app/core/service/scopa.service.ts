import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ScopaService {

  private readonly formPath = '/games/scopa/form';

  constructor(
    private dbService: DatabaseService,
    private toastService: ToastService
  ) {}

  // Salva l'intero form
  async saveForm(formData: any): Promise<void> {
    try {
      await this.dbService.writeData(this.formPath, JSON.stringify(formData));
      this.toastService.triggerToast('success', 'Form salvato correttamente', 'check');
    } catch (err) {
      console.error(err);
      this.toastService.triggerToast('error', 'Errore nel salvataggio del form', 'exclamation-triangle');
    }
  }

  // Recupera il form salvato
  async getForm(): Promise<any | null> {
    try {
      const data = await this.dbService.readData<string>(this.formPath);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(err);
      this.toastService.triggerToast('error', 'Errore nel recupero del form', 'exclamation-triangle');
      return null;
    }
  }

  // Push di un giocatore
  async addPlayer(player: any): Promise<void> {
    try {
      await this.dbService.pushData(this.formPath + '/users', player);
      this.toastService.triggerToast('success', `Giocatore ${player.name} aggiunto`, 'person-plus');
    } catch (err) {
      console.error(err);
      this.toastService.triggerToast('error', `Errore nell'aggiunta del giocatore ${player.name}`, 'exclamation-triangle');
    }
  }

  // Ascolto in tempo reale del form
  listenToForm() {
    return this.dbService.listenToData<string>(this.formPath);
  }
}
