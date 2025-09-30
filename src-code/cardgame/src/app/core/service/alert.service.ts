import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  duration: number;
  color?: string; // ✅ opzionale, per il quadratino
}
@Injectable({ providedIn: 'root' })
export class AlertService {
  private showAlertSource = new Subject<void>();
  showAlert$ = this.showAlertSource.asObservable(); // Observable per il component

  currentMessage: AlertMessage = { type: 'info', text: '', icon: 'info-circle', duration: 3000 };

  triggerAlert(type: 'success' | 'error' | 'warning' | 'info', text: string, icon: string, duration: number = 3000) {
    this.currentMessage = { type, text, icon, duration };
    this.showAlertSource.next(); // <--- qui
  }
}





