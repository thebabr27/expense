import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  
import { FullScreenModalComponent } from './_shared/full-screen-modal/full-screen-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , FullScreenModalComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cm-ang';
  
}
