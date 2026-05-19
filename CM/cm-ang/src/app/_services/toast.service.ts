import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private showToastSource = new Subject<void>();
  showToast$ = this.showToastSource.asObservable();

  currentMessage: ToastMessage = { type: 'info', text: '', icon : 'cart' };

  triggerToast(type: ToastMessage['type'], text: string, icon: string) {
    this.currentMessage = { type, text, icon };
    this.showToastSource.next(); // notifica i listener
  }
}