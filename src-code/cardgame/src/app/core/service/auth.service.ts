import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public authState$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private router: Router) {
    // Monitora lo stato dell'utente all'avvio
    this.monitorAuthState();
  }

  // Registrazione
  async signUp(email: string, password: string): Promise<User | null> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  // Login
  async signIn(email: string, password: string): Promise<User | null> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  // Logout
  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  // Utente corrente
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Monitora lo stato dell'utente e aggiorna il BehaviorSubject
  monitorAuthState(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);

      if (user) {
        console.log('Utente loggato:', user.email);
        this.router.navigate(['/home']);
      } else {
        console.log('Utente non loggato, redirect a login');
        this.router.navigate(['/login']);
      }
    });
  }
}