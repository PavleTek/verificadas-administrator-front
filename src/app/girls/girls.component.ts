import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SpeedDialModule } from 'primeng/speeddial';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { Component, HostListener } from '@angular/core';

import { paymentTierOptions, verificationStatusOptions } from '../consts';
import { cloneDeep } from 'lodash';
import { cleanPhoneNumberForDisplay, formatAllMultimediaUrlsFromGirl, generatePassword } from '../helper-functions';
import { AdminUser, City, Girl, GirlUser, VerificationStatus } from '../types';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MainService } from '../main.service';
import { AuthService } from '../auth.service';
import { InternalService } from '../internal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-girls',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    InputSwitchModule,
    DividerModule,
    SpeedDialModule,
    MultiSelectModule,
    FormsModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './girls.component.html',
  styleUrl: './girls.component.scss',
})
export class GirlsComponent {
  admin: AdminUser | any;
  items: MenuItem[] = [];

  users: GirlUser[] = [];
  filteredUsers: GirlUser[] = [];
  originalUsers: GirlUser[] = [];

  activeGirlUserForSpeedDial: GirlUser | undefined;
  originalActiveGirl: Girl | boolean = false;
  allCities: City[] = [];

  pendingStatus = VerificationStatus.PENDING;
  scheduledStatus = VerificationStatus.SCHEDULED;
  processingStatus = VerificationStatus.PROCESSING;
  verifiedStatus = VerificationStatus.VERIFIED;

  // Filter Logic
  searchName = '';
  verificationStatusOptions: string[] = verificationStatusOptions;
  selectedVerificationStatusOptions: string[] = [];
  paymentTierOptions: string[] = paymentTierOptions;
  selectedPaymentTierOptions: string[] = [];
  subscriptionActiveFilter: boolean = false;
  pendingMultimediaFilter: boolean = false;

  constructor(
    private mainService: MainService,
    private internalService: InternalService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.internalService.allGirlUsersData.subscribe((data) => {
      if (data) {
        this.users = data;
        this.filteredUsers = data;
        this.originalUsers = data;
      }
    });
    this.internalService.allCitiesData.subscribe((data) => {
      if (data) {
        this.allCities = data;
      }
    });
    this.internalService.activeAdminUserData.subscribe((data) => {
      if (data) {
        this.admin = data;
      }
    });
  }

  clearFilters() {
    this.selectedVerificationStatusOptions = [];
    this.selectedPaymentTierOptions = [];
    this.subscriptionActiveFilter = false;
    this.pendingMultimediaFilter = false;
    this.searchName = '';
    this.applyFilter();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKeydown(event: KeyboardEvent) {
    this.applyFilter();
  }

  applyFilter() {
    let filteredUsers = cloneDeep(this.users);
    filteredUsers = filteredUsers.filter((user: GirlUser) => {
      const verificationStatus = user.girl.verification.status;
      const paymentTier = user.girl.paymentTier;
      let containsVerificationStatus = true;
      if (this.selectedVerificationStatusOptions.length) {
        containsVerificationStatus = this.selectedVerificationStatusOptions.includes(verificationStatus);
      }
      let containsPaymentTier = true;
      if (this.selectedPaymentTierOptions.length) {
        containsPaymentTier = this.selectedPaymentTierOptions.includes(paymentTier);
      }
      let containsSubstringSearchName = true;
      if (this.searchName !== '') {
        containsSubstringSearchName = user.email.toLowerCase().includes(this.searchName.toLowerCase());
      }
      let validActiveCriteria = true;
      if (this.subscriptionActiveFilter) {
        validActiveCriteria = user.girl.active;
      }
      let validPendingMultimediaCriteria = true;
      if (this.pendingMultimediaFilter) {
        validPendingMultimediaCriteria = user.girl.images.request.length > 0;
      }
      return containsPaymentTier && containsVerificationStatus && containsSubstringSearchName && validActiveCriteria && validPendingMultimediaCriteria;
    });
    this.filteredUsers = filteredUsers;
  }

  startGirlUserCreation() {
    this.router.navigate(['/admin/girls/create']);
  }

  selectSpeedDialGirl(user: GirlUser) {
    this.activeGirlUserForSpeedDial = user;
  }

  selectGirlForMultimedia(user: GirlUser) {
    this.router.navigate([`/admin/girls/multimedia/${user.id}`]);
  }

  selectGirlForSubscription(user: GirlUser) {
    this.router.navigate([`/admin/girls/subscription/${user.id}`]);
  }

  selectGirlForVerificationManagement(user: GirlUser) {
    this.router.navigate([`/admin/girls/verification/${user.id}`]);
  }

  prepareWhatsAppMessage(originalMessage: string): string {
    return encodeURIComponent(originalMessage);
  }

  whatsappGreenColor(girlUser: GirlUser): boolean {
    return girlUser.welcomeSent && girlUser.changePasswordSent;
  }

  cleanPhoneNumber(phoneNumber: string | number) {
    return cleanPhoneNumberForDisplay(phoneNumber);
  }

  async setWelcomeSentTrue(user: GirlUser) {
    const response = await this.mainService.setWelcomeSentTrueForUser(user.id);
    if (response.status === 200) {
      user.welcomeSent = true;
    }
  }

  async setChangePasswordSentTrue(user: GirlUser) {
    const response = await this.mainService.setChangePasswordSentTrueForUser(user.id);
    if (response.status === 200) {
      user.changePasswordSent = true;
    }
  }

  sendWhatsapp(user: GirlUser) {
    if (!user.welcomeSent) {
      const message = this.prepareWhatsAppMessage(user.welcomeMessage);
      const whatsappUrl = `https://wa.me/${user.girl.phoneNumber}?text=${message}`;
      this.setWelcomeSentTrue(user);
      window.open(whatsappUrl, '_blank');
    } else if (!user.changePasswordSent) {
      const message = this.prepareWhatsAppMessage(user.changePasswordMessage);
      const whatsappUrl = `https://wa.me/${user.girl.phoneNumber}?text=${message}`;
      this.setChangePasswordSentTrue(user);
      window.open(whatsappUrl, '_blank');
    } else {
      const whatsappUrl = `https://wa.me/${user.girl.phoneNumber}?text=`;
      window.open(whatsappUrl, '_blank');
    }
  }

  confirmChangePassword(girlUser: GirlUser) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to change this girl password?`,
      icon: 'pi pi-exclamation-triangle',
      header: 'Password Change',
      accept: async () => {
        const newPassword = generatePassword();
        const girlUserId = girlUser.id;
        const response = await this.authService.changePasswordByAdmin(girlUserId, newPassword);
        try {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Password Changed, ready to be sent`,
              life: 3000,
            });
            girlUser.changePasswordMessage = response.data;
            girlUser.changePasswordSent = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: `Error occurred while trying to change the password for ${girlUser.email}`,
              life: 3000,
            });
          }
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: `Error occurred while trying to change the password for ${girlUser.email}`,
            life: 3000,
          });
        }
      },
      reject: () => {},
    });
  }

  confirmDeleteGirlUser() {}

  async ngOnInit(): Promise<void> {
    let allGirlUsers: GirlUser[] = await this.mainService.getAllGirlUsers();
    allGirlUsers = allGirlUsers.map((girlUser: GirlUser) => {
      let girl = formatAllMultimediaUrlsFromGirl(girlUser.girl);
      return { ...girlUser, girl: girl };
    });
    this.internalService.updateGirlUsers(allGirlUsers);
    const allCities: City[] = await this.mainService.getAllCities();
    this.internalService.udpateCities(allCities);
    await this.authService.getAdminProfile();
    this.items = [
      {
        icon: 'pi pi-key',
        command: () => {
          if (this.activeGirlUserForSpeedDial) {
            this.confirmChangePassword(this.activeGirlUserForSpeedDial);
          }
        },
      },
      {
        icon: 'pi pi-refresh',
        command: () => {
          this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        },
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        },
      },
    ];
  }
}
