import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, SelectControlValueAccessor } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { ConfirmationService, MessageService } from 'primeng/api';
import { City, SpecificLocation, SeoCategory } from '../types';
import { exportToExcel, uploadExcelFileAndGetJson } from '../helper-functions';
import { MainService } from '../main.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextareaModule, InputTextModule, ToastModule, ButtonModule, ConfirmPopupModule, FileUploadModule],
  templateUrl: './locations.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './locations.component.scss',
})
export class LocationsComponent {
  cities: City[] = [];
  filteredCities: City[] = [];
  originalCities: City[] = [];
  citySearchName: string = '';

  specifiLocations: SpecificLocation[] = [];
  filteredSpecificLocations: SpecificLocation[] = [];
  originalSpecificLocations: SpecificLocation[] = [];
  specificLocationSearchName: string = '';

  categories: SeoCategory[] = [];

  visibleUploadDialog: boolean = false;
  uploadedFiles: any[] = [];
  uploadType: string = '';

  constructor(private mainService: MainService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirmSaveSeoCategory(event: Event, category: SeoCategory) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save this Seo Category?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (category.new) {
          const createResponse = await this.saveNewCategory(category);
          if (createResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Seo Category: ${category.name} created`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error creating Seo Category', life: 3000 });
          }
        } else {
          const saveEditRespopnse = await this.saveEditSeoCategory(category);
          if (saveEditRespopnse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Seo Category: ${category.name} saved`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error editing Seo Category', life: 3000 });
          }
        }
      },
      reject: () => {},
    });
  }

  confirmSaveCity(event: Event, city: City) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save this City?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (city.new) {
          const createResponse = await this.saveNewCity(city);
          if (createResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `City: ${city.name} created`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error creating City', life: 3000 });
          }
        } else {
          const saveEditRespopnse = await this.saveEditCity(city);
          if (saveEditRespopnse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `City: ${city.name} saved`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error editing City', life: 3000 });
          }
        }
      },
      reject: () => {},
    });
  }

  confirmSaveAllCities(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to update all cities?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const updateAllCitiesResponse = await this.mainService.BulkUpdateCENSS('city', this.cities);
          if (updateAllCitiesResponse.status === 200) {
            this.getAllCities();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `All Cities have been updated`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error bulk updating cities', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error bulk updating cities, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  confirmSaveSpecificLocation(event: Event, specificLocation: SpecificLocation) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save this Specific Location?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (specificLocation.new) {
          const createResponse = await this.saveNewSpecificLocation(specificLocation);
          if (createResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Specific Location: ${specificLocation.name} created`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error Creating Specific Location', life: 3000 });
          }
        } else {
          const saveEditRespopnse = await this.saveEditSpecificLocation(specificLocation);
          if (saveEditRespopnse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Specific Location: ${specificLocation.name} saved`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error editing Specific Location', life: 3000 });
          }
        }
      },
      reject: () => {},
    });
  }

  confirmSaveAllSpecificLocations(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to update all specific locations?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const udpateAllSpecificLocationsResponse = await this.mainService.BulkUpdateCENSS('specificLocation', this.specifiLocations);
          if (udpateAllSpecificLocationsResponse.status === 200) {
            this.getAllSpecificLocations();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `All Specific Locations have been updated`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error bulk updating specific locations', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error bulk updating specific locations, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmDeleteCity(event: Event, city: City) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this City?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const deleteResponse = await this.deleteCity(city);
          if (deleteResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'City deleted', life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete City', life: 4000 });
          }
        } catch (err) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete City', life: 4000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmDeleteSpecificLocation(event: Event, specificLocation: City) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Specific Location?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const deleteResponse = await this.deleteSpecificLocation(specificLocation);
          if (deleteResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Specific Location deleted', life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete Specific Location', life: 3000 });
          }
        } catch (err) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete City', life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmDeleteSeoCategory(event: Event, category: SeoCategory) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Seo Category?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const deleteResponse = await this.deleteSeoCategory(category);
          if (deleteResponse.status === 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Seo Category deleted', life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete Seo Category', life: 3000 });
          }
        } catch (err) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Failed to delete Seo Category', life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async getAllCities() {
    const citiesResponse = await this.mainService.getAllCities();
    const cities = citiesResponse;
    const citiesWithEdit = cities.map((city: any) => {
      return { ...city, edit: false };
    });
    this.cities = citiesWithEdit;
    this.filteredCities = citiesWithEdit;
    this.originalCities = cities;
    this.fitlerCities();
  }

  async getAllCategories() {
    this.categories = [];
    const categoriesResponse = await this.mainService.getAllCategories();
    const categories = categoriesResponse.data;
    const categoriesWithEdit = categories.map((category: any) => {
      return { ...category, edit: false };
    });
    this.categories = categoriesWithEdit;
  }

  async getAllSpecificLocations() {
    const response = await this.mainService.getAllSpecificLocations();
    const locations = response.data;
    const specificLocationsWithEdit = locations.map((location: any) => {
      return { ...location, edit: false };
    });
    this.specifiLocations = specificLocationsWithEdit;
    this.originalSpecificLocations = locations;
    this.filteredSpecificLocations = specificLocationsWithEdit;
    this.filterSpecificLocations();
  }

  editObject(object: City | SpecificLocation) {
    object.edit = true;
  }

  cancelEditForCity(city: City) {
    if (!city.id) {
      const index = this.cities.indexOf(city);
      if (index !== -1) {
        this.cities.splice(index, 1);
      }
      this.fitlerCities();
    } else {
      const originalCity = this.originalCities.find((original) => original.id === city.id);
      if (originalCity) {
        // Reset the edited cities to its original state
        city.name = originalCity.name;
        city.metaTitle = originalCity.metaTitle;
        city.metaDescription = originalCity.metaDescription;
        city.edit = false;
      }
    }
  }

  cancelEditForSpecificLocation(location: SpecificLocation) {
    if (!location.id) {
      const index = this.cities.indexOf(location);
      if (index !== -1) {
        this.specifiLocations.splice(index, 1);
      }
      this.filterSpecificLocations();
    } else {
      console.log('helol is this working actually?');
      const originalSpecificLocation = this.originalSpecificLocations.find((original) => original.id === location.id);
      if (originalSpecificLocation) {
        console.log(originalSpecificLocation);
        // Reset the edited cities to its original state
        location.name = originalSpecificLocation.name;
        location.metaTitle = originalSpecificLocation.metaTitle;
        location.metaDescription = originalSpecificLocation.metaDescription;
        location.edit = false;
      }
    }
  }

  fitlerCities() {
    if (this.citySearchName !== '') {
      this.filteredCities = this.cities.filter((city) => {
        return city.name.toLowerCase().includes(this.citySearchName.toLowerCase());
      });
    } else {
      this.filteredCities = this.cities;
    }
  }

  filterSpecificLocations() {
    if (this.specificLocationSearchName !== '') {
      this.filteredSpecificLocations = this.specifiLocations.filter((location) => {
        return location.name.toLowerCase().includes(this.specificLocationSearchName.toLowerCase());
      });
    } else {
      this.filteredSpecificLocations = this.specifiLocations;
    }
  }

  createCity() {
    const newCity: City = {
      name: '',
      edit: true,
      new: true,
    };
    this.cities.unshift(newCity);
    this.filteredCities = this.cities;
  }

  createSpecificLocation() {
    const newSpecificLocation: SpecificLocation = {
      name: '',
      edit: true,
      new: true,
    };
    this.specifiLocations.unshift(newSpecificLocation);
    this.filteredSpecificLocations = this.specifiLocations;
  }

  createSeoCategory() {
    const newSeoCategory: SeoCategory = {
      name: '',
      metaTitle: '',
      metaDescription: '',
      edit: true,
      new: true,
    };
    this.categories.unshift(newSeoCategory);
  }

  async deleteCity(city: City) {
    if (city.id) {
      const response = await this.mainService.deleteCity(city);
      await this.getAllCities();
      return response;
    }
  }

  async deleteSeoCategory(category: SeoCategory) {
    if (category.id) {
      const response = await this.mainService.deleteCategory(category);
      await this.getAllCategories();
      return response;
    }
  }

  async deleteSpecificLocation(specificLocation: SpecificLocation) {
    if (specificLocation.id) {
      const response = await this.mainService.deleteSpecificLocation(specificLocation);
      await this.getAllSpecificLocations();
      return response;
    }
  }

  async saveEditCity(city: City) {
    city.name = city.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const response = await this.mainService.updateCity(city);
    await this.getAllCities();
    return response;
  }

  exportToExcel(type: string) {
    if (type === 'city') {
      exportToExcel(this.cities, 'VerificadasCities');
    } else if (type === 'specificLocation') {
      exportToExcel(this.specifiLocations, 'VerificadasSpecificLocations');
    }
  }

  async uploadExcelFile(event: any) {
    const newItems = await uploadExcelFileAndGetJson(event);
    if (this.uploadType === 'city') {
      this.cities = newItems;
      this.filteredCities = newItems;
    } else if (this.uploadType === 'specificLocation') {
      this.specifiLocations = newItems;
      this.filteredSpecificLocations = newItems;
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

  async saveEditSpecificLocation(specificLocation: SpecificLocation) {
    const response = await this.mainService.updateSpecificLocation(specificLocation);
    await this.getAllSpecificLocations();
    return response;
  }

  async saveEditSeoCategory(seoCategory: SeoCategory) {
    const response = await this.mainService.udpateSeoCategory(seoCategory);
    await this.getAllCategories();
    return response;
  }

  async saveNewCity(city: City): Promise<any> {
    const capitalizedCityName = city.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create a new City object with the capitalized name
    const newCity: City = {
      ...city,
      name: capitalizedCityName,
    };

    const response = await this.mainService.createCity(newCity);
    await this.getAllCities();
    return response;
  }

  async saveNewCategory(seoCategory: SeoCategory): Promise<any> {
    const capitalizedCategoryName = seoCategory.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create a new City object with the capitalized name
    const newCategory: SeoCategory = {
      ...seoCategory,
      name: capitalizedCategoryName,
    };

    const response = await this.mainService.createSeoCategory(newCategory);
    await this.getAllCategories();
    return response;
  }

  async saveNewSpecificLocation(specificLocation: SpecificLocation): Promise<any> {
    const capitalizedLocationName = specificLocation.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create a new City object with the capitalized name
    const newSpecificLocation: SpecificLocation = {
      ...specificLocation,
      name: capitalizedLocationName,
    };

    const response = await this.mainService.createSpecificLocation(newSpecificLocation);
    await this.getAllSpecificLocations();
    return response;
  }

  async ngOnInit(): Promise<void> {
    await this.getAllCities();
    await this.getAllSpecificLocations();
    await this.getAllCategories();
  }
}
