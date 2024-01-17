import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SignInResponseDTO, SignUpResponseDTO } from './signResponse.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  @ViewChild('authForm', { static: false }) authForm: NgForm;
  public isLoginMode: boolean = true;
  public isLoading: boolean = false;
  public error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  public onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onSubmit(): void {
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;

    let authObservable:
      | Observable<SignInResponseDTO>
      | Observable<SignUpResponseDTO>;

    if (this.isLoginMode) {
      authObservable = this.authService.signin(this.authForm.value);
    } else {
      authObservable = this.authService.signup(this.authForm.value);
    }

    authObservable.subscribe({
      next: (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      },
      error: (errorMessage: string) => {
        this.error = errorMessage;
        this.isLoading = false;
      },
    });
  }
}
