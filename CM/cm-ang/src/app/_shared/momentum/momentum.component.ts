import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-momentum',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './momentum.component.html',
  styleUrl: './momentum.component.css'
})
export class MomentumComponent {
  @Input() teams: any;
}
