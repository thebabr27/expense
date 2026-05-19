import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopNavLayoutComponent } from '../top-nav-layout/top-nav-layout.component';
import { BottomNavLayoutComponent } from '../bottom-nav-layout/bottom-nav-layout.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TopNavLayoutComponent,
    BottomNavLayoutComponent
  ],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent {
  @Input() title: string = '';
  @Input() customClasses: string = '';
}