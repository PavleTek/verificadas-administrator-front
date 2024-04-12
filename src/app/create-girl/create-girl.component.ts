import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

import { AnounceRequest, City, PaymentTier } from '../types';
import { firstValueFrom } from 'rxjs';
import { formatPhoneNumber, generatePassword } from '../helper-functions';
import { paymentTierOptions } from '../consts';
import { MainService } from '../main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalService } from '../internal.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-girl',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, ToastModule, InputMaskModule, InputSwitchModule, DropdownModule, CalendarModule],
  providers: [MessageService],
  templateUrl: './create-girl.component.html',
  styleUrl: './create-girl.component.scss',
})
export class CreateGirlComponent {
  allCities: City[] = [];
  email: string = '';
  name: string = '';
  phoneNumber: string = '';
  bday: Date = new Date(2000, 0, 1);
  password: string = '';
  city: City | undefined = undefined;
  showRequest: boolean = false;
  anounceRequest: AnounceRequest | undefined = undefined;
  paymentTierOptions: string[] = paymentTierOptions;
  selectedPaymentTier: PaymentTier = PaymentTier.PREMIUM;

  constructor(
    private mainService: MainService,
    private messageService: MessageService,
    private internalService: InternalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.internalService.allCitiesData.subscribe((data) => {
      if (data) {
        this.allCities = data;
      }
    });
  }

  generateRandomPassword() {
    this.password = generatePassword();
  }

  cancelGirlCreation() {
    this.router.navigate([`/admin/girls/all`]);
  }

  createWelcomeMessage(email: string, password: string) {
    return `¡Bienvenida a Verificadas.cl!\n\nNos complace informarle que su cuenta ha sido creada exitosamente con el correo electrónico: ${email} y su contraseña temporal es:\n\n${password}\n\nPor motivos de seguridad, le recomendamos encarecidamente cambiar su contraseña temporal por una propia una vez que haya ingresado a su cuenta.`;
  }

  async createNewGirlUser() {
    const age = this.getAgeFromBday(this.bday);
    const formattedPhoneNumber = formatPhoneNumber(this.phoneNumber);
    if (this.city !== undefined && age >= 18 && this.email !== '' && this.password !== '' && formattedPhoneNumber) {
      const requestBody = {
        email: this.email,
        name: this.name,
        phoneNumber: formattedPhoneNumber,
        paymentTier: this.selectedPaymentTier,
        bday: this.bday,
        password: this.password,
        cityId: this.city.id,
        welcomeMessage: this.createWelcomeMessage(this.email, this.password),
        anounceRequestId: this.anounceRequest !== undefined ? this.anounceRequest.id : 0,
      };
      const response = await this.mainService.registerGirlUser(requestBody);
      if (response.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: `Girl with email ${this.email} succesfully created, redirecting to girls in 3 seconds`,
          life: 3000,
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Error Creating Girl: error: ${response.data} `, life: 3000 });
      }
      setTimeout(() => {
        this.router.navigate([`/dashboard/girls/all`]);
      }, 3000);
    }
  }

  getAgeFromBday(bday: Date) {
    var today = new Date();
    var age = today.getFullYear() - bday.getFullYear();
    var monthDiff = today.getMonth() - bday.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) {
      age--;
    }

    return age;
  }

  async ngOnInit() {
    this.city = this.allCities[0];
    this.password = generatePassword();
    try {
      window.scrollTo(0, 0);
      const params = await firstValueFrom(this.route.params);
      if (params) {
        let anounceRequestId = params['id'];
        anounceRequestId = parseInt(anounceRequestId);
        if (anounceRequestId) {
          const anounceRequestResponse = await this.mainService.getAnounceRequestById(anounceRequestId);
          if (anounceRequestResponse.status === 200) {
            const anounceRequest: AnounceRequest = anounceRequestResponse.data;
            this.anounceRequest = anounceRequest;
            this.name = anounceRequest.name;
            this.email = anounceRequest.email;
            this.phoneNumber = anounceRequest.phoneNumber;
            if (anounceRequest.paymentTier === 'Economico') {
              this.selectedPaymentTier = PaymentTier.ECONOMIC;
            } else if (anounceRequest.paymentTier === 'Intermedio') {
              this.selectedPaymentTier = PaymentTier.REGULAR;
            } else if (anounceRequest.paymentTier === 'Premium') {
              this.selectedPaymentTier = PaymentTier.PREMIUM;
            }
          }
        } else {
        }
      }
    } catch (error) {
      console.error('Error with getting girl logic', error);
    }
  }
}
