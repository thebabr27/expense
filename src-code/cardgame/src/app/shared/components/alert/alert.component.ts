import { Component, OnInit } from '@angular/core';
import { AlertMessage, AlertService } from 'src/app/core/service/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  alertText: string = '';
  alertType: AlertMessage['type'] = 'info';
  alertIcon: string = 'info-circle';
  show: boolean = false;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.showAlert$.subscribe(() => {
      const msg = this.alertService.currentMessage;
      this.alertText = msg.text;
      this.alertType = msg.type;
      this.alertIcon = msg.icon;
      this.show = true;

      // Nascondi automaticamente dopo 3 secondi
      setTimeout(() => this.show = false, 3000);
    });
  }
}