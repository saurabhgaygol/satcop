import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
   
 const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data?.['role'];
  const isLoggedIn = auth.isLoggedIn();
  const role = auth.getUserRole();

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  if (role === expectedRole) {
    return true;
  }

  alert('Access Denied');
  router.navigate(['/login']);
  return false;
};





