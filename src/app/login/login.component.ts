import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  failed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (data) => {
        this.authService.saveToken(data.token);
        this.authService.saveUser(data);
        this.router.navigate(['/admin']);
      },
      (err) => {
        this.password = '';
        this.failed = true;
      }
    );
  }

  enterSubmit(e: any) {
    if (e.keyCode === 13) this.login();
  }

  async ngOnInit(): Promise<void> {
    const isGirlLoggedIn = await this.authService.isAdminLoggedIn();
    if (isGirlLoggedIn) {
      this.router.navigate(['/admin/home ']);
    }
  }
}
