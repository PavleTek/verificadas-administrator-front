import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminUser, AppNotification, City, GirlUser, Service, Girl } from './types';

@Injectable({
  providedIn: 'root',
})
export class InternalService {
  private allGirlUsers = new BehaviorSubject<GirlUser[]>([]);
  private allServices = new BehaviorSubject<Service[]>([]);
  private allCities = new BehaviorSubject<City[]>([]);
  private activeAdminUser = new BehaviorSubject<AdminUser | null>(null);
  private notifications = new BehaviorSubject<AppNotification[]>([]);

  allGirlUsersData = this.allGirlUsers.asObservable();
  allServicesData = this.allServices.asObservable();
  allCitiesData = this.allCities.asObservable();
  activeAdminUserData = this.activeAdminUser.asObservable();
  notificationsData = this.notifications.asObservable();

  constructor() {}

  updateAdminUser(data: AdminUser) {
    this.activeAdminUser.next(data);
  }

  updateNotifications(data: AppNotification[]) {
    this.notifications.next(data);
  }

  updateGirlUsers(data: GirlUser[]) {
    this.allGirlUsers.next(data);
  }

  udpateCities(data: City[]) {
    this.allCities.next(data);
  }

  updateSingleGirlFromGirlUsers(allGirlUsers: GirlUser[], updatedGirl: Girl) {
    const index = allGirlUsers.findIndex((user) => user.girlId === updatedGirl.id);
    const allGirlUsersCopy = allGirlUsers;
    if (index !== -1) {
      const userToUpdate = allGirlUsersCopy[index];
      userToUpdate.girl = updatedGirl;
      allGirlUsersCopy[index] = userToUpdate;
    }
    this.allGirlUsers.next(allGirlUsers);
  }
}
