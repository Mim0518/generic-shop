import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  formBuilder = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  registerForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  onSubmit() {
    if(this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }
    const {fullName, email, password} = this.registerForm.value;
    this.authService.register(fullName!, email!, password!)
      .subscribe((isAuthenticated) => {
      if(isAuthenticated){
        this.router.navigateByUrl('/');
      }
        this.hasError.set(true);
        setTimeout(() => this.hasError.set(false), 2000);
      })
  }
}
