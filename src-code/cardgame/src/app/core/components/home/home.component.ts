import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user$ = this.authService.authState$;

  constructor(
      private authService: AuthService,
  ) {}

  async logout() {
    await this.authService.signOut();
  }
}
