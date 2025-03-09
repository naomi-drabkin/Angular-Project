import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/services/ApiAuth/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // המשתמש מחובר, אפשר להיכנס לנתיב
  } else {
    router.navigate(['/login']); // המשתמש לא מחובר, מפנה לדף התחברות
    return false;
  }

};
