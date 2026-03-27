import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const res = authService.isLoggedIn();
  return res ? router.navigate(['/subjects']) : true;  // else allow access
};
