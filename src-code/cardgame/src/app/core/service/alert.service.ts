import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private showAlertSource = new Subject<void>();
  showAlert$ = this.showAlertSource.asObservable();

  currentMessage: AlertMessage = { type: 'info', text: '', icon: 'info-circle' };

  triggerAlert(type: AlertMessage['type'], text: string, icon: string) {
    this.currentMessage = { type, text, icon };
    this.showAlertSource.next();
  }
}
