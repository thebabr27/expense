
import { Router, RouterModule } from '@angular/router';
import { Component, Input } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NavigationService } from '../../../_services/navigation.service';

export interface NavItem {
  label: string;
  route?: string;
  action?: string;
  yellow?: boolean;
}

@Component({
  selector: 'app-top-nav-layout',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './top-nav-layout.component.html',
  styleUrls: ['./top-nav-layout.component.scss']
})
export class TopNavLayoutComponent {
  @Input() items: NavItem[] = [];
  
  constructor(
    private router: Router,
    private navService: NavigationService
  ) { }

  onClick(item: NavItem) {

    if (item.route === '/back') {
      const url = this.navService.back();
      this.router.navigateByUrl(url);
      return;
    }

    if (item.route) {
      this.router.navigateByUrl(item.route);
    }

  }
}