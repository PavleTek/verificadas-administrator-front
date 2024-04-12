import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const isLogedIn = await this.authService.isAdminLoggedIn();
    if (isLogedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
