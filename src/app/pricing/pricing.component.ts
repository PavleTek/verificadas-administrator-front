import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { Banner, PricingPlan } from '../types';
import { MainService } from '../main.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [InputTextModule, InputNumberModule, InputTextareaModule, CommonModule, ButtonModule, FormsModule, DividerModule, ToastModule, ConfirmPopupModule],
  templateUrl: './pricing.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  economicPricingPlan: PricingPlan | any;
  regularPricingPlan: PricingPlan | any;
  premiumPricingPlan: PricingPlan | any;
  createPricingPlan: boolean = false;
  newPricingPlan: PricingPlan = {
    id: 0,
    name: '',
    price: 0,
    discount: 0,
    discountMessage: '',
  };
  banner: Banner | any;
  constructor(private mainService: MainService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  startCreatingNewPricingPlan() {
    this.createPricingPlan = true;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  cancelCreationOfNewPricingPlan() {
    this.newPricingPlan = {
      name: '',
      price: 0,
      id: 0,
      discount: 0,
      discountMessage: '',
    };
    this.createPricingPlan = false;
  }

  async initiateBanner() {
    const response = await this.mainService.getBanner();
    this.banner = response.data;
  }

  closeBanner() {
    this.banner = undefined;
  }

  async saveNewPricingPlan() {
    try {
      this.newPricingPlan.name = this.capitalizeFirstLetter(this.newPricingPlan.name);
      if (this.newPricingPlan.discountMessage.length > 2) {
        this.newPricingPlan.discountMessage = this.capitalizeFirstLetter(this.newPricingPlan.discountMessage);
      }
      const response = await this.mainService.createPricingPlan(this.newPricingPlan);
      if (response.status === 200) {
        this.initiatePricings();
      }
    } catch (error) {
      console.error(error);
    }
  }

  confirmUpdatePricingPlan(event: Event, pricingPlan: PricingPlan) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to edit this pricing plan?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const response = await this.mainService.updatePricingPlan(pricingPlan);
        if (response.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Pricing Plan update succesfully`, life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error updating pricing plan', life: 3000 });
        }
      },
    });
  }

  confirmSaveNewPricingPlan(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to create this pricing plan?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const response = await this.mainService.createPricingPlan(this.newPricingPlan);
        if (response.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Pricing Plan created succesfully`, life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error creating pricing plan', life: 3000 });
        }
      },
    });
  }

  confirmDeletePricingPlan(event: Event, pricingPlan: PricingPlan) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to create this pricing plan?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const response = await this.mainService.deletePricingPlan(pricingPlan);
        if (response.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Pricing Plan deleted succesfully`, life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error deleting pricing plan', life: 3000 });
        }
      },
    });
  }

  confirmUpdateBanner(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want update the Banner',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const response = await this.mainService.updateBanner(this.banner.message, this.banner.title);
        if (response.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Banner updated Succesfully`, life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error udpating Banner pricing plan', life: 3000 });
        }
      },
    });
  }

  async updatePricingPlan(pricingPlan: PricingPlan) {
    const response = await this.mainService.updatePricingPlan(pricingPlan);
  }

  async initiatePricings() {
    const response = await this.mainService.getAllPricingPlans();
    const pricingPlans = response.data;
    this.premiumPricingPlan = pricingPlans.find((pricingPlan: PricingPlan) => pricingPlan.name === 'Premium');
    this.regularPricingPlan = pricingPlans.find((pricingPlan: PricingPlan) => pricingPlan.name === 'Regular');
    this.economicPricingPlan = pricingPlans.find((pricingPlan: PricingPlan) => pricingPlan.name === 'Economica');
  }

  async ngOnInit() {
    await this.initiatePricings();
    await this.initiateBanner();
  }
}
