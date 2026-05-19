import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-button-spinner',
  templateUrl: './button-spinner.component.html',
  styleUrls: ['./button-spinner.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ButtonSpinnerComponent {
  @Input() isVisible: boolean = false;

}
