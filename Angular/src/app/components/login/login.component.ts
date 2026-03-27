import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(loginForm: NgForm) {
    const { email, password } = loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (success) => { // runs when backend responds
        if (success) {
        this.toastr.success('Login successful');
          loginForm.reset()
          
          setTimeout(() => {
          this.router.navigate(['/subjects']);
        }, 1000);
        } else {
          this.toastr.warning('Invalid email or password');
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong. Please try again.'); // network/server down
      },
    });
  }

  goToSignup(){
    this.router.navigate(['/signup'])
  }
}
