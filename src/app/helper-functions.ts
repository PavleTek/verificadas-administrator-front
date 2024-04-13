import { MultimediaObject, TimeBracket, Service, SpecificLocation, Ethnicity, Nationality, City, Girl } from './types';
import { environment } from '../environments/environment';
import * as XLSX from 'xlsx';

export function getTextFromTimeBracket(timeBracket: TimeBracket | undefined) {
  if (timeBracket !== undefined) {
    if (timeBracket.startTime === '00:00' && timeBracket.endTime === '24:00') {
      return '24h';
    } else {
      return `De: ${timeBracket.startTime}\nHasta: ${timeBracket.endTime}`;
    }
  } else {
    return undefined;
  }
}

export function formatPrice(price: Number) {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return '$ ' + formattedPrice;
}

export function formatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, '');
}

export function formatSpanishDate(dateOrString: Date | string): string {
  let date: Date;
  if (typeof dateOrString === 'string') {
    date = new Date(dateOrString);
  } else {
    date = dateOrString;
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleString('es-ES', options);
}

export function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&';
  let newGeneratedPassword = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    newGeneratedPassword += charset.charAt(Math.floor(Math.random() * n));
  }
  return newGeneratedPassword;
}

export function getAgeFromBday(bday: Date) {
  var today = new Date();
  var age = today.getFullYear() - bday.getFullYear();
  var monthDiff = today.getMonth() - bday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) {
    age--;
  }

  return age;
}

export function getImageUrlFromImageName(imageName: string): string {
  const baseUrl: string = environment.baseImageUrl;
  const imageUrl: string = baseUrl + '/' + imageName;
  return imageUrl;
}

export function formatAllMultimediaUrlsFromGirl(girl: Girl): Girl {
  let formatedMultimediaGirl = girl;
  const formattedImages = formatGirlImagesToUrls(girl.images);
  let activeProfilePicture = '';
  let requestProfilePicture;
  if (girl.profilePicture !== '') {
    activeProfilePicture = getImageUrlFromImageName(girl.profilePicture);
  }
  if (girl.requestProfilePicture !== undefined && girl.requestProfilePicture !== null && girl.requestProfilePicture !== '') {
    requestProfilePicture = getPendingImageUrlFromImageName(girl.requestProfilePicture);
  }
  formatedMultimediaGirl.images = formattedImages;
  formatedMultimediaGirl.requestProfilePicture = requestProfilePicture;
  formatedMultimediaGirl.profilePicture = activeProfilePicture;
  return formatedMultimediaGirl;
}

export function formatGirlImagesToUrls(images: MultimediaObject): MultimediaObject {
  const requestImages = Array.isArray(images.request) ? images.request.map((image) => getPendingImageUrlFromImageName(image)) : [];
  const activeImages = Array.isArray(images.active) ? images.active.map((image) => getImageUrlFromImageName(image)) : [];
  const bluredFaceImages = Array.isArray(images.bluredFace) ? images.bluredFace.map((image) => getImageUrlFromImageName(image)) : [];
  return { request: requestImages, active: activeImages, bluredFace: bluredFaceImages };
}

export function getPendingImageUrlFromImageName(imageName: string): string {
  const baseUrl: string = environment.basePendingimageUrl;
  const imageUrl: string = baseUrl + '/' + imageName;
  return imageUrl;
}

export function cleanPhoneNumberForDisplay(phoneNumber: number | string) {
  const stringPhoneNumber = phoneNumber.toString();
  return '+' + stringPhoneNumber.substring(0, 2) + ' ' + stringPhoneNumber.substring(2);
}

export function exportToExcel(data: SpecificLocation[] | Ethnicity[] | Nationality[] | City[], fileName: string): void {
  const dataForWorksheet: any = data.map((item: Service | SpecificLocation | Ethnicity | Nationality | City) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForWorksheet);
  const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, fileName);
}

export function saveAsExcelFile(buffer: any, fileName: string): void {
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

export async function uploadExcelFileAndGetJson(event: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const file: File = event.files[0];
    if (!file) {
      console.error('No file provided');
      reject('No file provided');
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

        const newItems = excelData
          .map((row: any[]) => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          })
          .filter((item: any) => item.name !== undefined);

        resolve(newItems);
      } else {
        console.error('Failed to read file');
        reject('Failed to read file');
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
}
