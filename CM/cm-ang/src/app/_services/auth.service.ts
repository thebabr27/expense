
import { Injectable } from '@angular/core';
import 'firebase/auth';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  createUserWithEmailAndPassword,
  User,
  FacebookAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,

} from '@angular/fire/auth';
import { Database, ref, get, set } from '@angular/fire/database';
import { BehaviorSubject, from } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service'; 

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  registeredUser: boolean = false;

  private roleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.roleSubject.asObservable();

  public loginError$ = new BehaviorSubject<{ field: string, message: string } | null>(null);

  constructor(
    private auth: Auth,
    private db: Database,
    private router: Router,
    private toastService: ToastService
  ) {
    this.monitorAuthState();
  }

  /** Invia email di reset */
  sendPasswordResetEmail(email: string, continueUrl?: string) {
    const actionCodeSettings = continueUrl
      ? { url: continueUrl, handleCodeInApp: false }
      : undefined;
    return sendPasswordResetEmail(this.auth, email, actionCodeSettings);
  }

  /** Verifica che il codice sia valido e ritorna la email associata */
  verifyPasswordResetCode(oobCode: string) {
    return verifyPasswordResetCode(this.auth, oobCode);
  }

  /** Conferma la nuova password */
  confirmPasswordReset(oobCode: string, newPassword: string) {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  monitorAuthState(): void {
    onAuthStateChanged(this.auth, async (user) => {
      this.userSubject.next(user);

      if (user) {
        console.log('Utente autenticato:', user.email);
        this.router.navigate(['/home']); // Redirect al home
 

      } else {
        console.log('Nessun utente autenticato');
        this.roleSubject.next(null);
        this.router.navigate(['/login']); // Redirect al login
      }
    });
  }


  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async isAdmin(): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !(currentUser as any).uid) return false;
    let role = '';
    await this.roleSubject.asObservable().subscribe(data => {
      if (data) {
        role = data;
      }
    })
    return role === 'admin';
  }

  async register(form: RegisterForm): Promise<UserCredential> {
    try {
      const { email, password, firstName, lastName } = form;

      // Crea l'utente in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Salva dati utente nel Realtime Database
      await set(ref(this.db, `users/${uid}`), {
        role: 'user',       // ruolo di default
        status: 'active',   // status di default
        email: email,
        firstName: sessionStorage.getItem('firstName') || '',
        lastName: sessionStorage.getItem('lastName') || '',
        createdAt: Date.now()
      });

      this.roleSubject.next('user');
      console.log(`Utente registrato: ${firstName} ${lastName} con ruolo: user e status: active`);

      return userCredential;

    } catch (err: any) {
      let message = err.message || 'Errore sconosciuto durante la registrazione';

      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'Questa email è già in uso.';
          break;
        case 'auth/invalid-email':
          message = 'Email non valida.';
          break;
        case 'auth/weak-password':
          message = 'La password è troppo debole.';
          break;
      }

      this.toastService.triggerToast('error', message, 'exclamation-triangle fs-4');
      console.error('Errore durante la registrazione:', err);

      return Promise.reject(err);
    }
  }

  async loginWithFacebook(): Promise<void> {
    const provider = new FacebookAuthProvider();

    try {
      const credential = await signInWithPopup(this.auth, provider);
      const user = credential.user;

      // Aggiorna il comportamento del tuo service
      this.userSubject.next(user);

      // Controlla se l'utente esiste già in Realtime DB
      const userRef = ref(this.db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        const displayName = user.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        await set(userRef, {
          email: user.email ?? null,
          firstName: sessionStorage.getItem('firstName') || '',
          lastName: sessionStorage.getItem('lastName') || '',
          status: 'active',
          role: 'user',
          createdAt: Date.now()
        });
      }

    } catch (err: any) {
      console.error('Errore login Facebook:', err);
      this.toastService.triggerToast('error', err.message || 'Errore login Facebook', 'exclamation-triangle fs-4');
    }
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Restituisce una Promise
    return signInWithRedirect(this.auth, provider);
  }


  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // recupero ruolo ecc. come prima...

      this.loginError$.next(null); // login riuscito → reset errori
      return userCredential;

    } catch (error: any) {
      let field: 'email' | 'password' | 'generic' = 'generic';
      let message = error.message || 'Errore sconosciuto';

      switch (error.code) {
        case 'auth/wrong-password':
          message = 'Password errata. Controlla e riprova.';
          this.toastService.triggerToast('error', message, 'exclamation-triangle');
          break;
        case 'auth/user-not-found':
          message = 'Utente non trovato. Registrati per proseguire.';
          this.toastService.triggerToast('error', message, 'exclamation-triangle');
          break;
        case 'auth/too-many-requests':
          message = 'Troppi tentativi falliti. Riprova più tardi.';
          this.toastService.triggerToast('error', message, 'exclamation-triangle');
          break;
        default:
      }

      this.loginError$.next({ field, message });
      return Promise.reject(error);
    }
  }


  logout(): Promise<void> {
    this.roleSubject.next(null);
    return signOut(this.auth);
  }
}