import { Component, OnInit } from "@angular/core";
import { AlertService } from "src/app/core/service/alert.service";

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

  private hideTimeout: any;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.showAlert$.subscribe(() => {
      const msg = this.alertService.currentMessage;

      if (msg.color) {
        this.alertText = `${msg.text} <span class="color-box" style="background-color: ${msg.color}"></span>`;
      } else {
        this.alertText = msg.text;
      }

      this.alertType = msg.type;
      this.alertIcon = msg.icon;
      this.show = true;

      // Cancella eventuale timeout precedente
      if (this.hideTimeout) clearTimeout(this.hideTimeout);

      // Nascondi dopo msg.duration
      this.hideTimeout = setTimeout(() => {
        this.show = false;
        this.hideTimeout = null;
      }, msg.duration);
    });
  }
}
