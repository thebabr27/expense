import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';  

export interface TeamNavItem {
  name: string;
  shortName: string;

  colors: {
    main: string;
    second: string;
    third: string;
  };

  goals: number;
}

@Component({
  selector: 'app-teams-nav-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams-nav-layout.component.html',
  styleUrls: ['./teams-nav-layout.component.scss']
})
export class TeamsNavLayoutComponent {

  @Input() teams: TeamNavItem[] = [];

}