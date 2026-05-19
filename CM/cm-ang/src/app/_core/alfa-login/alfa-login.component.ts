import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'; 
import { AuthService } from '../../_services/auth.service';
import { ToastService } from '../../_services/toast.service'; 
import { SharedModule } from '../../_shared/shared/shared.module';
import { ButtonSpinnerComponent } from '../../_shared/button-spinner/button-spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alfa-login',
  templateUrl: './alfa-login.component.html',
  styleUrls: ['./alfa-login.component.scss'],
  standalone: true,
  imports: [SharedModule, ButtonSpinnerComponent]
})
export class AlfaLoginComponent implements OnInit {
  @Input() loginForm: any;
  loginSpinnerIsVisible: boolean = false;
  toastText: string = "Utente non registrato";
  private subscription: any;

  emailError: string | null = null;
  passwordError: string | null = null;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pw: ['', Validators.required],
      rememberMe: [false],
    });
  } 
  
  ngOnInit(): void {    
  }
  
  loginWithFacebook() {
    this.auth.loginWithFacebook()
      .then((result:any) => {
        console.log('Login effettuato con successo:');
      })
      .catch((error:any) => {
        console.error('Errore login:', error);
      });
  }
  

  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .then((result:any) => {
        console.log('Login effettuato con successo:');
        this.toastService.triggerToast('error', 'Login effettuato con successo.', 'done');
      })
      .catch((error:any) => {
        console.error('Errore login:', error);
        this.toastService.triggerToast('error', 'Errore login.', 'exclamation-triangle');
      });
  } 

  isUserRegistered() {
    return this.auth.registeredUser;
  }
  
  async login() {
    console.log(("logging in"));
    
    this.emailError = null;
    this.passwordError = null;

    if (this.loginForm.invalid) {
      if (this.loginForm.controls['email'].errors?.['required']) {
        this.emailError = 'Email richiesta';
      } else if (this.loginForm.controls['email'].errors?.['email']) {
        this.emailError = 'Formato email non valido';
      }

      if (this.loginForm.controls['pw'].errors?.['required']) {
        this.passwordError = 'Password richiesta';
      }
      if (this.emailError || this.passwordError) {
        this.toastService.triggerToast('error', 'Errori presenti nel form di login.', 'exclamation-triangle');
      }
      return; // interrompe il login se il form non è valido
    }

    const { email, pw, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.loginSpinnerIsVisible = true;

    try {
      await this.auth.login(email, pw);
      this.loginSpinnerIsVisible = false;

  this.router.navigate(['/home']);
    } catch (err: any) {
      this.loginSpinnerIsVisible = false;

      if (err.field === 'email') {
        this.emailError = err.message;
        this.passwordError = null;
      } else if (err.field === 'password') {
        this.passwordError = err.message;
        this.emailError = null;
      } else {
        this.toastText = err.message;
      }
    }
  }

}
