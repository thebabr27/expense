import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-match-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './match-info.component.html',
  styleUrl: './match-info.component.css'
})
export class MatchInfoComponent {
  @Input() referee: string = '';
  @Input() spectators: number = 0;
  @Input() weather: 'sun' | 'cloud' | 'rain' | 'wind' = 'sun';
  @Input() stadium: string = '';
}
