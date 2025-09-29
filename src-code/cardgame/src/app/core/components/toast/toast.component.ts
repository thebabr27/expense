import { Component, Input, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from 'src/app/core/service/toast.service';
declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toastText: string = ""; 
  toastType: ToastMessage['type'] = 'error'; // default
  toastIcon: string = 'cart';

  constructor(private toastService: ToastService) {}
  
  ngOnInit(): void { 
    // subscribe al service
    this.toastService.showToast$.subscribe(() => {
      this.toastText = this.toastService.currentMessage.text;
      this.toastType = this.toastService.currentMessage.type;
      this.toastIcon = this.toastService.currentMessage.icon;

      // mostra il toast Bootstrap
      const toastEl = document.getElementById('liveToast');
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    });
  }

  getType() {
    return this.toastService.currentMessage.type
  }

  getIcon() {
    return this.toastService.currentMessage.icon
  }

  getMessage() {
    return this.toastService.currentMessage.text
  }
}
