import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-list',
  standalone: true,
  imports: [],
  templateUrl: './empty-list.component.html',
  styleUrl: './empty-list.component.css'
})
export class EmptyListComponent {
  @Input() text = 'Nessun elemento in questa lista';

}
