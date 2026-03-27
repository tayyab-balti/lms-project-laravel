import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  gender: string = '';
  phoneNumber: string = '';

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  get passwordMismatch(): boolean {
    return (
      this.confirmPassword !== null &&
      this.confirmPassword !== undefined &&
      this.password !== this.confirmPassword
    );
  }

  onSignup(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    this.isLoading = true;

    const user = {
      fullName: form.value.fullName,
      email: form.value.email,
      password: form.value.password,
      gender: form.value.gender || null,
      phoneNumber: form.value.phoneNumber || null,
    };

    // const user = {
    //   fullName: this.fullName,
    //   email: this.email,
    //   password: this.password,
    //   gender: this.gender || null,
    //   phoneNumber: this.phoneNumber || null,
    // };

    // Send POST request to the backend API for signup
    this.authService.signup(user).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Signup successful!');
        form.reset();
        setTimeout(() => this.goToLogin(), 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('A server error occurred.');
        this.toastr.error(
          error.error?.message ||
            'Signup failed. Please check your connection.',
        );
      },
      complete: () => {
        console.log('Signup request completed');
      },
    });
  }
}
