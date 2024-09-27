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
import { Service } from '../types';
import { exportToExcel, uploadExcelFileAndGetJson } from '../helper-functions';
import { MainService } from '../main.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextareaModule, InputTextModule, ToastModule, ButtonModule, ConfirmPopupModule, FileUploadModule],
  templateUrl: './services.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  services: Service[] = [];
  filteredServices: Service[] = [];
  originalServices: Service[] = [];
  searchName = '';
  visibleUploadDialog: boolean = false;
  uploadedFiles: any[] = [];
  constructor(private mainService: MainService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirmSaveService(event: Event, service: Service) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save this service?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (service.new) {
          const createResponse = await this.saveNewService(service);
          if (createResponse.status === 200) {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: `Service: ${service.name} created`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error Creating Service', life: 3000 });
          }
        } else {
          const saveEditRespopnse = await this.saveEditService(service);
          if (saveEditRespopnse.status === 200) {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: `Service: ${service.name} saved`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error editing service', life: 3000 });
          }
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error editing service', life: 3000 });
      },
    });
  }

  async confirmDeleteService(event: Event, service: Service) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Service?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const deleteResponse = await this.deleteService(service);
          if (deleteResponse.status === 200) {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Service deleted', life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete Service', life: 4000 });
          }
        } catch (err) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete Service', life: 4000 });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have canceled service deletion', life: 4000 });
      },
    });
  }

  async getAllServices() {
    const response = await this.mainService.getAllServices();
    const services = response.data;
    const servicesWithEdit = services.map((service: any) => {
      return { ...service, edit: false };
    });
    this.services = servicesWithEdit;
    this.filteredServices = servicesWithEdit;
    this.originalServices = services;
    this.filterServices();
  }

  editService(service: Service) {
    service.edit = true;
  }

  cancelEdit(service: Service) {
    if (!service.id) {
      const index = this.services.indexOf(service);
      if (index !== -1) {
        this.services.splice(index, 1);
      }
      this.filterServices();
    } else {
      const originalService = this.originalServices.find((original) => original.id === service.id);
      if (originalService) {
        // Reset the edited service to its original state
        service.name = originalService.name;
        service.description = originalService.description;
        service.edit = false;
      }
    }
  }

  filterServices() {
    if (this.searchName !== '') {
      this.filteredServices = this.services.filter((service) => {
        return service.name.toLowerCase().includes(this.searchName.toLowerCase());
      });
    } else {
      this.filteredServices = this.services;
    }
  }

  createService() {
    const newService: Service = {
      name: '',
      description: '',
      edit: true,
      new: true,
    };
    this.services.unshift(newService);
    this.filteredServices = this.services;
  }

  async deleteService(service: Service) {
    if (service.id) {
      const response = await this.mainService.deleteService(service);
      await this.getAllServices();
      return response;
    }
  }

  async saveEditService(service: Service) {
    const response = await this.mainService.updateService(service);
    await this.getAllServices();
    return response;
  }

  async saveNewService(service: Service): Promise<any> {
    const capitalizedServiceName = service.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create a new Service object with the capitalized name
    const newService: Service = {
      ...service,
      name: capitalizedServiceName,
    };

    const response = await this.mainService.createService(newService);
    await this.getAllServices();
    return response;
  }

  exportToExcel(): void {
    const dataForWorksheet = this.services.map((service: Service) => {
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
      };
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForWorksheet);
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'VerificadasServices');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const downloadLink: HTMLAnchorElement = document.createElement('a');
    const url = URL.createObjectURL(data);
    downloadLink.href = url;
    downloadLink.download = fileName + '.xlsx';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  uploadExcelFile(event: any): void {
    const file: File = event.files[0];
    if (!file) {
      console.error('No file provided');
      return;
    }

    const fileReader: FileReader = new FileReader();

    fileReader.onload = (fileEvent) => {
      const target = fileEvent?.target;
      if (target && target.result) {
        const data: ArrayBuffer | string = target.result as ArrayBuffer | string;
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers: string[] = excelData[0];
        excelData.shift();

        const newServices = excelData
          .map((row: any[]) => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          })
          .filter((item: any) => item.name !== undefined);

        this.services = newServices.map((service: any) => {
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            metaTitle: service.metaTitle,
            metaDescription: service.metaDescription,
            edit: false,
          };
        });
        this.filteredServices = this.services;
      } else {
        console.error('Failed to read file');
      }
    };

    fileReader.readAsArrayBuffer(file);
    this.visibleUploadDialog = false;
  }

  cancelUpload() {
    this.visibleUploadDialog = false;
  }

  openUploadDialog() {
    this.visibleUploadDialog = true;
  }

  async confirmUpdateAllServices(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to update all services?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await this.mainService.BulkUpdateCENSS('service', this.services);
          if (response.status === 200) {
            this.getAllServices();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `All services have been updated`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error bulk updating services', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error bulk updating services, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getAllServices();
  }
}
