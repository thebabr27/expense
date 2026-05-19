import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { NavItem } from "../top-nav-layout/top-nav-layout.component";
import { NavigationService } from "../../../_services/navigation.service";

@Component({
  selector: 'app-bottom-nav-layout',
  standalone: true,
  templateUrl: './bottom-nav-layout.component.html',
  styleUrls: ['./bottom-nav-layout.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class BottomNavLayoutComponent {
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