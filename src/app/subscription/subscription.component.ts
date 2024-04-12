import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Girl, GirlUser, PaymentTier, SubscriptionDuration, SubscriptionPayment, VerificationStatus } from '../types';
import { MainService } from '../main.service';
import { paymentTierOptions, subcsriptionDurationOptions } from '../consts';
import { InternalService } from '../internal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { formatSpanishDate } from '../helper-functions';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [ButtonModule, InputNumberModule, CalendarModule, ToastModule, CommonModule, FormsModule, ConfirmPopupModule, TableModule, DropdownModule],
  templateUrl: './subscription.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent {
  allGirlUsers: GirlUser[] = [];
  girl: Girl | any;
  originalGirl: Girl | any;

  disabledBecauseOfVerification = false;
  registeringPayment: boolean = false;
  newPayment: SubscriptionPayment = this.genearteTemplatePayment();
  paymentTierOptions: PaymentTier[] = paymentTierOptions;
  subcsriptionDurationOptions: SubscriptionDuration[] = subcsriptionDurationOptions;
  paymentForEdit: SubscriptionPayment | undefined = undefined;
  allGirlPayments: SubscriptionPayment[] = [];

  constructor(
    private mainService: MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private internalService: InternalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.internalService.allGirlUsersData.subscribe((data) => {
      if (data) {
        this.allGirlUsers = data;
      }
    });
  }

  genearteTemplatePayment(): SubscriptionPayment {
    const templatePayment: SubscriptionPayment = {
      paymentTier: PaymentTier.PREMIUM,
      amountPaid: 400000,
      paymentDate: new Date(),
      duration: SubscriptionDuration.MONTH,
      paymentMethod: 'Bank Transfer',
    };
    return templatePayment;
  }

  async registerPayment() {
    const paymentData = { ...this.newPayment, subscriptionId: this.girl.subscriptionId };
    const response = await this.mainService.registerPayment(paymentData, this.girl.subscription, this.girl.id);
    if (response.status === 200) {
      this.messageService.add({
        severity: 'success',
        summary: 'Confirmed',
        detail: `Payemnt registered succesfully`,
        life: 3000,
      });
      this.girl.active = true;
      this.girl.paymentTier = paymentData.paymentTier;
      this.girl.subscription.expiryDate = new Date(response.data.updatedSubscription.expiryDate);
      this.girl.subscription.deactivationDate = new Date(response.data.updatedSubscription.deactivationDate);
      this.newPayment = this.genearteTemplatePayment();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `Error registering Payment`,
        life: 3000,
      });
    }
  }

  async updateSubscription() {
    const response = await this.mainService.updateSubscription(
      this.girl.paymentTier,
      this.girl.subscription.expiryDate,
      this.girl.subscription.deactivationDate,
      this.girl.id,
      this.girl.subscription.id
    );
    if (response.status === 200) {
      this.messageService.add({
        severity: 'success',
        summary: 'Confirmed',
        detail: `Subscription updated Succesfully`,
        life: 3000,
      });
      if (response.data.shouldActivate) {
        this.girl.active = true;
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `Error updating subscription`,
        life: 3000,
      });
    }
  }

  backToMainSubscription() {
    this.girl.paymentTier = cloneDeep(this.originalGirl.paymentTier);
    this.girl.subscription = cloneDeep(this.originalGirl.subscription);
  }

  async confirmActivateGirl(event: Event, girl: Girl) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to activate this girl?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const activateResponse = await this.mainService.changeGirlStatus(girl.id, true);
          if (activateResponse.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: `Girl: ${girl.verification.name} ${girl.verification.lastname} succesfully activated`,
              life: 3000,
            });
            this.girl.active = true;
          } else if (activateResponse.status === 403) {
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: `Error occurred trying to activate girl: ${girl.verification.name} ${girl.verification.lastname}\n${activateResponse.error.data.message}`,
              life: 3000,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: `Error occurred trying to activate girl: ${girl.verification.name} ${girl.verification.lastname}`,
              life: 3000,
            });
          }
        } catch (err) {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: `Error occurred trying to activate girl: ${girl.verification.name} ${girl.verification.lastname} ${err}`,
            life: 3000,
          });
        }
      },
      reject: () => {},
    });
  }

  async confirmDeactivateGirl(event: Event, girl: Girl) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to deactivate this girl?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        const deactivateResponse = await this.mainService.changeGirlStatus(girl.id, false);
        try {
          if (deactivateResponse.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: `Girl: ${girl.verification.name} ${girl.verification.lastname} succesfully deactivated`,
              life: 3000,
            });
            this.girl.active = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: `Error occurred trying to deactivate girl: ${girl.verification.name} ${girl.verification.lastname}`,
              life: 3000,
            });
          }
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: `Error occurred trying to deactivate girl: ${girl.verification.name} ${girl.verification.lastname}`,
            life: 3000,
          });
        }
      },
      reject: () => {},
    });
  }

  async changeGirlStatus(girl: Girl, status: boolean) {
    const girlId = girl.id;
    const response = await this.mainService.changeGirlStatus(girlId, status);
    return response;
  }

  async getAllPaymentsByGirl() {
    const response = await this.mainService.getAllPaymentsMadeByGirl(this.girl.subscription.id);
    this.allGirlPayments = response.data;
  }

  async ngOnInit() {
    try {
      window.scrollTo(0, 0);
      const params = await firstValueFrom(this.route.params);
      if (params) {
        let girlUserId = params['id'];
        girlUserId = parseInt(girlUserId);
        if (girlUserId) {
          if (this.allGirlUsers.length <= 1) {
            // await this.mainService.initiateEverythingGirlPage(girlId);
          }
          const activeGirluser = this.allGirlUsers.find((girlUser: GirlUser) => girlUser.id === girlUserId);
          if (activeGirluser !== undefined) {
            this.girl = cloneDeep(activeGirluser.girl);
            this.originalGirl = cloneDeep(this.girl);
            if (activeGirluser.girl.verification.status !== VerificationStatus.VERIFIED) {
              this.disabledBecauseOfVerification = true;
            }
            this.girl.subscription.expiryDate = new Date(this.girl.subscription.expiryDate);
            this.girl.subscription.deactivationDate = new Date(this.girl.subscription.deactivationDate);
            this.originalGirl.subscription.expiryDate = new Date(this.girl.subscription.expiryDate);
            this.originalGirl.subscription.deactivationDate = new Date(this.girl.subscription.deactivationDate);
            await this.getAllPaymentsByGirl();
          }
        } else {
        }
      }
    } catch (error) {
      console.error('Error with getting girl logic', error);
    }
  }

  selectPaymentForEdit(payment: SubscriptionPayment) {
    this.paymentForEdit = payment;
  }

  async updatePayment() {
    if (this.paymentForEdit) {
      const response = await this.mainService.updatePayment(this.paymentForEdit);
      if (response.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: `Payment Succesfully updated`,
          life: 3000,
        });
        await this.getAllPaymentsByGirl();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: `Error occurred trying to update Payment with ID: ${this.paymentForEdit.id}`,
          life: 3000,
        });
      }
      this.paymentForEdit = undefined;
    }
  }

  async deletePayment(event: Event, payment: SubscriptionPayment) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to deactivate this girl?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        const paymentId = payment.id;
        if (paymentId) {
          const response = await this.mainService.deleteRegisteredPayemnt(paymentId);
          try {
            if (response.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail: `Payment Succesfully deleted`,
                life: 3000,
              });
              await this.getAllPaymentsByGirl();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Rejected',
                detail: `Error occurred trying to delete Payment with ID: ${paymentId}`,
                life: 3000,
              });
            }
          } catch {
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: `Error occurred trying to delete Payment with ID: ${paymentId}`,
              life: 3000,
            });
          }
        }
      },
      reject: () => {},
    });
  }

  stopEditingPayment() {
    this.paymentForEdit = undefined;
  }

  formatDate(date: string) {
    return formatSpanishDate(date);
  }

  goBack() {
    this.router.navigate([`/admin/girls/all`]);
  }
}
