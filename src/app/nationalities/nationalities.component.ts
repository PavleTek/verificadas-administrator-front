import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Ethnicity, Nationality } from '../types';
import { exportToExcel, uploadExcelFileAndGetJson } from '../helper-functions';
import { MainService } from '../main.service';

@Component({
  selector: 'app-nationalities',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, InputTextareaModule, ToastModule, ButtonModule, ConfirmPopupModule, FileUploadModule],
  templateUrl: './nationalities.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './nationalities.component.scss',
})
export class NationalitiesComponent {
  ethnicities: Ethnicity[] = [];
  filteredEthnicities: Ethnicity[] = [];
  originalEthnicities: Ethnicity[] = [];
  ethnicitySearchName: string = '';

  nationalities: Nationality[] = [];
  filteredNationalities: Nationality[] = [];
  originalNationalities: Nationality[] = [];
  NationalitySearchName: string = '';

  visibleUploadDialog: boolean = false;
  uploadedFiles: any[] = [];
  uploadType: string = '';

  constructor(private mainService: MainService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  async confirmSaveObject(event: Event, object: Ethnicity | Nationality, type: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to save this ${type}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (object.new) {
          const createResponse = await this.saveNewObject(object, type);
          if (createResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `${type}: ${object.name} created`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Error Creating ${type}`, life: 3000 });
          }
        } else {
          const saveEditRespopnse = await this.saveEditObject(object, type);
          if (saveEditRespopnse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `${type}: ${object.name} saved`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Error editing ${type}`, life: 3000 });
          }
        }
      },
      reject: () => {},
    });
  }

  async confirmDeleteObject(event: Event, object: Ethnicity | Nationality, type: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete this ${type}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const deleteResponse = await this.deleteObject(object, type);
          if (deleteResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `${type} deleted`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Failed to delete ${type}`, life: 4000 });
          }
        } catch (err) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Failed to delete ${type}`, life: 4000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmSaveAllEthnicities(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to update all ethnicities?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const updateAllEthnicitiesResponse = await this.mainService.BulkUpdateCENSS('ethnicity', this.ethnicities);
          if (updateAllEthnicitiesResponse.status === 200) {
            this.getAllEthnicities();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `All Ethnicitiies have been updated`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error bulk updating ethnicitiies', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error bulk updating ethnicitiies, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmSaveAllNationalities(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to update all nationalities?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const udpateAllNationalitiesResponse = await this.mainService.BulkUpdateCENSS('nationality', this.nationalities);
          if (udpateAllNationalitiesResponse.status === 200) {
            this.getAllNationalities();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `All nationalities have been updated`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error bulk updating nationalities', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error bulk updating nationalities, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async getAllEthnicities() {
    const response = await this.mainService.getAllEthnicities();
    const ethnicities = response.data;
    const ethnicitiesWithEdit = ethnicities.map((ethnicity: any) => {
      return { ...ethnicity, edit: false };
    });
    this.ethnicities = ethnicitiesWithEdit;
    this.filteredEthnicities = ethnicitiesWithEdit;
    this.originalEthnicities = ethnicities;
    this.filterEthnicities();
  }

  async getAllNationalities() {
    const response = await this.mainService.getAllNationalities();
    const nationalities = response.data;
    const nationalitiesWithEdit = nationalities.map((nationality: any) => {
      return { ...nationality, edit: false };
    });
    this.nationalities = nationalitiesWithEdit;
    this.filteredNationalities = nationalitiesWithEdit;
    this.originalNationalities = nationalities;
    this.filterNationalities();
  }

  editObject(object: Ethnicity | Nationality) {
    object.edit = true;
  }

  cancelEditForEthnicity(ethnicity: Ethnicity) {
    if (!ethnicity.id) {
      const index = this.ethnicities.indexOf(ethnicity);
      if (index !== -1) {
        this.ethnicities.splice(index, 1);
      }
      this.filterEthnicities();
    } else {
      const originalEthnicity = this.originalEthnicities.find((original) => original.id === ethnicity.id);
      if (originalEthnicity) {
        // Reset the edited ethnicities to its original state
        ethnicity.name = originalEthnicity.name;
        ethnicity.edit = false;
      }
    }
  }

  cancelEditForNationality(nationality: Nationality) {
    if (!nationality.id) {
      const index = this.nationalities.indexOf(nationality);
      if (index !== -1) {
        this.nationalities.splice(index, 1);
      }
      this.filterNationalities();
    } else {
      const originalNationality = this.originalEthnicities.find((original) => original.id === nationality.id);
      if (originalNationality) {
        // Reset the edited nationalities to its original state
        nationality.name = originalNationality.name;
        nationality.edit = false;
      }
    }
  }

  filterEthnicities() {
    if (this.ethnicitySearchName !== '') {
      this.filteredEthnicities = this.ethnicities.filter((ethnicity) => {
        return ethnicity.name.toLowerCase().includes(this.ethnicitySearchName.toLowerCase());
      });
    } else {
      this.filteredEthnicities = this.ethnicities;
    }
  }

  filterNationalities() {
    if (this.NationalitySearchName !== '') {
      this.filteredNationalities = this.nationalities.filter((nationality) => {
        return nationality.name.toLowerCase().includes(this.NationalitySearchName.toLowerCase());
      });
    } else {
      this.filteredNationalities = this.nationalities;
    }
  }

  createNewObject(type: string) {
    const newObject: Ethnicity | Nationality = {
      name: '',
      edit: true,
      new: true,
    };
    if (type === 'Nationality') {
      this.nationalities.unshift(newObject);
      this.filteredNationalities = this.nationalities;
    } else {
      this.ethnicities.unshift(newObject);
      this.filteredEthnicities = this.ethnicities;
    }
  }

  async deleteObject(object: Nationality | Ethnicity, type: string) {
    if (object.id) {
      if (type === 'Nationality') {
        const response = await this.mainService.deleteNationality(object.id);
        await this.getAllNationalities();
        return response;
      } else {
        const response = await this.mainService.deleteEthnicity(object.id);
        await this.getAllEthnicities();
        return response;
      }
    }
  }

  async saveEditObject(object: Ethnicity | Nationality, type: string) {
    object.name = object.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    if (type === 'Nationality') {
      const response = await this.mainService.updateNationality(object);
      await this.getAllNationalities();
      return response;
    } else {
      const response = await this.mainService.updateEthnicity(object);
      await this.getAllEthnicities();
      return response;
    }
  }

  async saveNewObject(object: Ethnicity | Nationality, type: string): Promise<any> {
    const capitalizedName = object.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    // Create a new object with the capitalized name
    const newObject: Ethnicity | Nationality = {
      ...object,
      name: capitalizedName,
    };
    if (type === 'Nationality') {
      const response = await this.mainService.createNationality(newObject);
      await this.getAllNationalities();
      return response;
    } else {
      const response = await this.mainService.createEthinicity(newObject);
      await this.getAllEthnicities();
      return response;
    }
  }

  exportToExcel(type: string) {
    if (type === 'ethnicity') {
      exportToExcel(this.ethnicities, 'VerificadasEthnicities');
    } else if (type === 'nationality') {
      exportToExcel(this.nationalities, 'VerificadasNationalities');
    }
  }

  async uploadExcelFile(event: any) {
    const newItems = await uploadExcelFileAndGetJson(event);
    if (this.uploadType === 'ethnicity') {
      this.ethnicities = newItems;
      this.filteredEthnicities = newItems;
    } else if (this.uploadType === 'nationality') {
      this.nationalities = newItems;
      this.filteredNationalities = newItems;
    }
    this.visibleUploadDialog = false;
  }

  cancelUpload() {
    this.visibleUploadDialog = false;
  }

  openUploadDialog(type: string) {
    this.uploadType = type;
    this.uploadedFiles = [];
    this.visibleUploadDialog = true;
  }

  async ngOnInit(): Promise<void> {
    await this.getAllEthnicities();
    await this.getAllNationalities();
  }
}
