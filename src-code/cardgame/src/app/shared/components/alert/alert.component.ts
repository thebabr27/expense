import { Component, OnInit } from '@angular/core';
import { AlertMessage, AlertService } from 'src/app/core/service/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  alertText: string = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  alertIcon: string = 'info-circle';
  show: boolean = false;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.showAlert$.subscribe(() => {
      const msg = this.alertService.currentMessage;

      // Usa solo tag inline per innerHTML
      if (msg.color) {
        this.alertText = `${msg.text} <span class="color-box" style="background-color: ${msg.color}"></span>`;
      } else {
        this.alertText = msg.text;
      }

      this.alertType = msg.type;
      this.alertIcon = msg.icon;
      this.show = true;

      // Nascondi automaticamente dopo 3 secondi
      setTimeout(() => this.show = false, 3000);
    });
  }
}
