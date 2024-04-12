import { Router } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { InternalService } from './internal.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
interface TokenVerificationResponse {
  valid: boolean;
  data: any;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router, private internalService: InternalService, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-api/login`, user);
  }

  async isAdminLoggedIn(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const result = await this.http.post<TokenVerificationResponse>(`${this.baseUrl}/user-api/verifyTokenAdmin`, { data: '' }).toPromise();
          if (result) {
            return result.valid;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      this.router.navigate(['/login']);
    }
  }

  getJwtToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(TOKEN_KEY);
    } else return '';
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(USER_KEY);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem(USER_KEY);
      if (user) {
        debugger;
        return JSON.parse(user);
      }
      return {};
    }
  }

  async getUserProfile(): Promise<any> {
    const userProfile = await this.http.get<any>(`${this.baseUrl}/user-api/profile`).toPromise();
    return userProfile;
  }

  async getAdminProfile(): Promise<any> {
    const admin = await this.http.get<any>(`${this.baseUrl}/user-api/profile`).toPromise();
    if (admin) {
      this.internalService.updateAdminUser(admin);
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<any> {
    try {
      const payload = { oldPassword, newPassword };
      const response = await this.http.put(`${this.baseUrl}/user-api/change-password/${userId}`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      return { status: 500, data: error };
    }
  }

  async changePasswordByAdmin(userId: number, newPassword: string): Promise<any> {
    try {
      const payload = { newPassword };
      const response = await this.http.put(`${this.baseUrl}/admin-api/change-password/${userId}`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      return { status: 500, data: error };
    }
  }
}
