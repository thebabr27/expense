import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module'; 
import { FullScreenModalService } from '../../_services/full-screen-modal.service';

@Component({
  selector: 'app-fullscreen-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './full-screen-modal.component.html',
  styleUrl: './full-screen-modal.component.css'
})
export class FullScreenModalComponent {

  constructor(
    public modal: FullScreenModalService
  ) { }

}