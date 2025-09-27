import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';

@Injectable()
export class DomainRedirectInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const targetDomain = environment.targetDomain; // sostituisci con il dominio da intercettare

    if (req.url.startsWith(targetDomain)) {
      // Qui puoi fare un redirect lato Angular
      console.log(`Intercepted request to ${targetDomain}, redirecting...`);
      
      // Esempio: reindirizzo l'utente a una pagina
      this.router.navigate(['/']);
      
      // Puoi anche bloccare la request
      return new Observable(); // oppure next.handle(req) se vuoi lasciarla continuare
    }

    return next.handle(req);
  }
}
