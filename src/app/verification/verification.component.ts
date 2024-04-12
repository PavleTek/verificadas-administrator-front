import { Component } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminUser, Girl, GirlUser } from '../types';
import {
  bottomSizeOptions,
  chestSizeOptions,
  contextureOptions,
  eyeColorOptions,
  hairColorOptions,
  retoqueOptions,
  verificationStatusOptions,
} from '../consts';
import { MainService } from '../main.service';
import { InternalService } from '../internal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [InputNumberModule, InputMaskModule, InputTextModule, InputSwitchModule, ToastModule, DropdownModule, CalendarModule, CommonModule, FormsModule],
  templateUrl: './verification.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './verification.component.scss',
})
export class VerificationComponent {
  allGirlUsers: GirlUser[] = [];
  girl: Girl | any;
  originalGirl: Girl | any;
  admin: AdminUser | any;

  eyeColorOptions: string[] = eyeColorOptions;
  hairColorOptions: string[] = hairColorOptions;
  contextureOptions: string[] = contextureOptions;
  bottomSizeOptions: string[] = bottomSizeOptions;
  chestSizeOptions: string[] = chestSizeOptions;
  verificationStatusOptions: string[] = verificationStatusOptions;
  retoqueOptions: any[] = retoqueOptions;

  constructor(
    private mainService: MainService,
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

  async updatePhysicalVerification() {
    const updateGirlData = {
      height: this.girl.height,
      weight: this.girl.weight,
      chestCm: this.girl.chestCm,
      waistCm: this.girl.waistCm,
      bottomCm: this.girl.bottomCm,
      editLevel: this.girl.editLevel,
      attributes: this.girl.attributes,
      barbie: this.girl.barbie,
    };
    try {
      const response = await this.mainService.updateGirlPhysicalVerification(updateGirlData, this.girl.id, this.admin);
      if (response.status === 200) {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Girl physical verification updated', life: 3000 });
        this.originalGirl = cloneDeep(this.girl);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to update girl physical verification', life: 3000 });
      }
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Failed to update girl physical verification, Error: ${err}`, life: 3000 });
    }
  }

  async updateInformationVerification() {
    const girlData = {
      bday: this.girl.bday,
    };
    const verificationData = this.girl.verification;
    const girlId = this.girl.id;
    const verificationId = this.girl.verification.id;
    try {
      const response = await this.mainService.updateGirlVerificationInformation(verificationData, girlData, girlId, verificationId, this.admin);
      if (response.status === 200) {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Girl verification information updated', life: 3000 });
        this.originalGirl = cloneDeep(this.girl);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to Update girl verification information', life: 3000 });
      }
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Failed to Update girl verification information, Error: ${err}`, life: 3000 });
    }
  }

  cancelVerificationInformationUpdate() {
    this.girl.verification = cloneDeep(this.originalGirl.verification);
    this.girl.bday = cloneDeep(this.originalGirl.bday);
  }

  cancelPhysicalVerificationUpdate() {
    const originalGirlCopy = cloneDeep(this.originalGirl);
    this.girl.chestCm = originalGirlCopy.chestCm;
    this.girl.bottomCm = originalGirlCopy.bottomCm;
    this.girl.waistCm = originalGirlCopy.waistCm;
    this.girl.height = originalGirlCopy.height;
    this.girl.weight = originalGirlCopy.weight;
    this.girl.barbie = originalGirlCopy.barbie;
    this.girl.attributes = originalGirlCopy.attributes;
    this.girl.editLevel = originalGirlCopy.editLevel;
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
            this.originalGirl = cloneDeep(activeGirluser.girl);
          }
        } else {
        }
      }
    } catch (error) {
      console.error('Error with getting girl logic', error);
    }
  }

  goBack() {
    this.router.navigate([`/admin/girls/all`]);
  }
}
