import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  color?: string; // ✅ opzionale, per il quadratino
}

@Injectable({ providedIn: 'root' }) export class AlertService {
  private showAlertSource = new Subject<void>();
  showAlert$ = this.showAlertSource.asObservable(); // Observable per il component

  currentMessage: AlertMessage = { type: 'info', text: '', icon: 'info-circle' };

  triggerAlert(type: 'success' | 'error' | 'warning' | 'info', text: string, icon: string, color?: string) {
    this.currentMessage = { type, text, icon, color };
    this.showAlertSource.next(); // ✅ chiama next sul Subject, non sull'observable
  }
}




