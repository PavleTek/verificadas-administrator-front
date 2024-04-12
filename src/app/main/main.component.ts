import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppNotification } from '../types';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { InternalService } from '../internal.service';
import { MainService } from '../main.service';

import { CommonModule, Location } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule, StyleClassModule, InputTextModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  currentView: string = '';
  notifications: AppNotification[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private internalService: InternalService,
    private mainService: MainService
  ) {
    this.internalService.notificationsData.subscribe((data) => {
      if (data) {
        this.notifications = data;
      }
    });
  }

  logOutUser() {
    this.authService.logout();
  }

  goToEthinicityView() {
    this.router.navigate(['/admin/nationality']);
  }

  goToHomeView() {
    this.router.navigate(['/admin/home']);
  }

  goToNotificationsView() {
    this.router.navigate(['/admin/notifications']);
  }

  goToServiceView() {
    this.router.navigate(['/admin/service']);
  }

  goToCityView() {
    this.router.navigate(['/admin/locations']);
  }

  goToGirlsView() {
    this.router.navigate(['/admin/girls']);
  }

  goToReportsView() {
    this.router.navigate(['/admin/reports']);
  }

  goToPricing() {
    this.router.navigate(['/admin/pricing']);
  }

  async getAllNotifications() {
    const notificationsResponse = await this.mainService.getAllNotifications();
    if (notificationsResponse.status === 200) {
      return notificationsResponse.data;
    } else {
      return [];
    }
  }

  async ngOnInit() {
    const completePath = this.location.path();
    const view = completePath.split('/')[2];
    if (view === 'home') {
      this.goToHomeView();
    } else if (view === 'girls') {
      this.goToGirlsView();
    } else if (view === 'reports') {
      this.goToReportsView();
    } else if (view === 'locations') {
      this.goToCityView();
    } else if (view === 'service') {
      this.goToServiceView();
    } else if (view === 'nationality') {
      this.goToEthinicityView();
    } else if (view === 'pricing') {
      this.goToPricing();
    } else if (view === 'notifications') {
      this.goToNotificationsView();
    }
    this.currentView = view;
    const newNotifications: AppNotification[] = await this.getAllNotifications();
    this.internalService.updateNotifications(newNotifications);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const completePath = this.location.path();
        const view = completePath.split('/')[2];
        this.currentView = view;
      }
    });
  }
}
