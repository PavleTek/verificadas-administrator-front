import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AppNotification, City, GirlUser } from '../types';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalService } from '../internal.service';
import { MainService } from '../main.service';
import { AuthService } from '../auth.service';
import { formatAllMultimediaUrlsFromGirl } from '../helper-functions';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  notifications: AppNotification[] = [];
  constructor(
    private route: ActivatedRoute,
    private internalService: InternalService,
    private mainService: MainService,
    private authService: AuthService,
    private router: Router
  ) {
    this.internalService.notificationsData.subscribe((data) => {
      if (data) {
        this.notifications = data;
      }
    });
  }

  async getAllNotifications() {
    const notificationsResponse = await this.mainService.getAllNotifications();
    if (notificationsResponse.status === 200) {
      return notificationsResponse.data;
    } else {
      return [];
    }
  }

  goToSolveNotification(notification: AppNotification) {
    const type = notification.type;
    if (type === 'AnounceRequest') {
      this.router.navigate([`/admin/girls/createGirl/${notification.searchId}`]);
    } else if (type === 'MultimediaRequest') {
      this.router.navigate([`/admin/girls/multimedia/${notification.searchId}`]);
    }
  }

  async deleteNotification(notificationId: number) {
    const deleteResponse = await this.mainService.deleteNotification(notificationId);
    if (deleteResponse.status === 200) {
      this.notifications = this.notifications.filter((notification: AppNotification) => notification.id !== notificationId);
    }
  }

  async ngOnInit() {
    try {
      window.scrollTo(0, 0);
      let allGirlUsers: GirlUser[] = await this.mainService.getAllGirlUsers();
      allGirlUsers = allGirlUsers.map((girlUser: GirlUser) => {
        let girl = formatAllMultimediaUrlsFromGirl(girlUser.girl);
        return { ...girlUser, girl: girl };
      });
      this.internalService.updateGirlUsers(allGirlUsers);
      const allCities: City[] = await this.mainService.getAllCities();
      this.internalService.udpateCities(allCities);
      await this.authService.getAdminProfile();
      if (this.notifications.length === 0) {
        const newNotifications: AppNotification[] = await this.getAllNotifications();
        this.internalService.updateNotifications(newNotifications);
      }
    } catch (error) {
      console.error('Error with getting girl logic', error);
    }
  }
}
