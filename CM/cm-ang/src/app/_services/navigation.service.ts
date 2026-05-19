import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  private history: string[] = [];

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.history.push(e.urlAfterRedirects);
      });

  }

  back(): string {
    this.history.pop(); // current
    return this.history.pop() || '/home';
  }
}