import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

import { MainService } from '../main.service';
import { InternalService } from '../internal.service';
import { Girl, GirlUser, VerificationStatus, PaymentTier } from '../types';
import { formatAllMultimediaUrlsFromGirl } from '../helper-functions';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
  styleUrl: './home.component.scss',
  providers: [MessageService],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  allUsers: GirlUser[] = [];
  goalQuantity: number = 300;
  activeUsersQuantity: number = 0;
  pendingVerificationQuantity: number = 0;
  specialQuantity: number = 0;
  premiumQuantity: number = 0;
  regularQuantity: number = 0;
  economicQuantity: number = 0;

  userPercentage: number = 0;
  activeUsersWidth: number = 0;
  pendingVerificationWidth: number = 0;
  specialWidth: number = 0;
  premiumWidth: number = 0;
  regularWidth: number = 0;
  economicWidth: number = 0;
  remainingUsersWidth: number = 0;

  constructor(private mainService: MainService, private internalService: InternalService, private messageService: MessageService) {
    this.internalService.allGirlUsersData.subscribe((data) => {
      if (data) {
        this.allUsers = data;
        this.activeUsersQuantity = 0;
        this.pendingVerificationQuantity = 0;
        this.specialQuantity = 0;
        this.premiumQuantity = 0;
        this.regularQuantity = 0;
        this.economicQuantity = 0;
        data.forEach((user: GirlUser) => {
          if (user.girl.active) {
            this.activeUsersQuantity += 1;
          }
          if (user.girl.verification.status !== VerificationStatus.VERIFIED) {
            this.pendingVerificationQuantity += 1;
          }
          if (user.girl.paymentTier === PaymentTier.SPECIAL) {
            this.specialQuantity += 1;
          } else if (user.girl.paymentTier === PaymentTier.PREMIUM) {
            this.premiumQuantity += 1;
          } else if (user.girl.paymentTier === PaymentTier.REGULAR) {
            this.regularQuantity += 1;
          } else if (user.girl.paymentTier === PaymentTier.ECONOMIC) {
            this.economicQuantity += 1;
          }
        });
        this.userPercentage = (this.allUsers.length / 300) * 100;
        const totalUsers = data.length;
        const remainingUsers = 300 - totalUsers;
        this.specialWidth = (this.specialQuantity / 300) * 100;
        this.premiumWidth = (this.premiumQuantity / 300) * 100;
        this.regularWidth = (this.regularQuantity / 300) * 100;
        this.economicWidth = (this.economicQuantity / 300) * 100;
        this.remainingUsersWidth = (remainingUsers / 300) * 100;
      }
    });
  }

  async cleanMultimediaData() {
    try {
      const response = await this.mainService.cleanMultimediaData();
      if (response.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Multimedia Data cleaned`,
          life: 3000,
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error cleaning multimedia Data, Error: ${response.data}`, life: 3000 });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error cleaning multimedia Data, Error: ${error}`, life: 3000 });
    }
  }

  async generateRoutesInBackend() {
    try {
      const response = await this.mainService.generateRoutesInBackend();
      if (response.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Routes Updated Successfully`,
          life: 3000,
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error generating routes, Error: ${response.data}`, life: 3000 });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error generating routes, Error: ${error}`, life: 3000 });
    }
  }

  async ngOnInit(): Promise<void> {
    let allGirlUsers: GirlUser[] = await this.mainService.getAllGirlUsers();
    allGirlUsers = allGirlUsers.map((girlUser: GirlUser) => {
      let girl = formatAllMultimediaUrlsFromGirl(girlUser.girl);
      return { ...girlUser, girl: girl };
    });
    this.internalService.updateGirlUsers(allGirlUsers);
  }
}
