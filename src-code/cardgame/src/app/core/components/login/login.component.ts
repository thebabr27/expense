import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  user$ = this.authService.authState$;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }); 
  }

  async login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.signIn(email, password);
      this.errorMessage = '';
      this.loginForm.reset();
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  async register() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.signUp(email, password);
      this.errorMessage = '';
      this.loginForm.reset();
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
