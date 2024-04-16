import { Component, ElementRef, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { Girl, GirlUser } from '../types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { MainService } from '../main.service';
import { InternalService } from '../internal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatGirlImagesToUrls, getImageUrlFromImageName } from '../helper-functions';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [ButtonModule, GalleriaModule, ToastModule, ConfirmPopupModule],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class MultimediaComponent {
  allGirlUsers: GirlUser[] = [];
  girl: Girl | any;
  @ViewChild('specificComponent') specificComponent: ElementRef | any;

  private baseImageUrl = environment.baseImageUrl;
  loadingApproveImages: boolean = false;
  totalImages: number = 1;
  activeGaleriaImages: string[] = [];
  displayCustom: boolean = false;
  activeIndex: number = 0;
  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(
    private mainService: MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private elementRef: ElementRef,
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

  imageUrl(imageFileName: string): string {
    const imageUrl = this.baseImageUrl + imageFileName;
    return imageUrl;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.isClickedInsideAllowedElements(event.target)) {
      this.displayCustom = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydown(event: KeyboardEvent) {
    this.displayCustom = false;
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onLeftArrowKeydown(event: KeyboardEvent) {
    this.activeIndex = (this.activeIndex - 1 + this.totalImages) % this.totalImages;
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onRightArrowKeydown(event: KeyboardEvent) {
    this.activeIndex = (this.activeIndex + 1) % this.totalImages;
  }

  isClickedInsideAllowedElements(target: any): boolean {
    if (target.closest('#customImageDisplay') !== null) {
      return true;
    }
    if (this.isButtonOrAncestor(target)) {
      return true;
    }
    const gridElementPending = this.elementRef.nativeElement.querySelector('#imageGridPending');
    const gridElementActive = this.elementRef.nativeElement.querySelector('#imageGridActive');
    const gridEleementPPR = this.elementRef.nativeElement.querySelector('#profilePictureRequestContainer');
    const gridEleementPPA = this.elementRef.nativeElement.querySelector('#activeProfilePictureContainer');
    if (
      (gridElementPending && gridElementPending.contains(target)) ||
      (gridElementActive && gridElementActive.contains(target)) ||
      (gridEleementPPR && gridEleementPPR.contains(target)) ||
      (gridEleementPPA && gridEleementPPA.contains(target))
    ) {
      return true;
    }
    return false;
  }

  isButtonOrAncestor(element: any): boolean {
    // Traverse up the DOM tree from the clicked element
    while (element) {
      if (element.tagName && element.tagName.toLowerCase() === 'button') {
        return true; // If a button element is found, return true
      }
      element = element.parentNode; // Move to the parent node
    }
    return false; // If no button element is found, return false
  }

  openImage(index: number, imagesType: string) {
    if (imagesType === 'request') {
      this.activeGaleriaImages = this.girl.images.request;
      this.totalImages = this.girl.images.request.length;
    } else if (imagesType === 'active') {
      this.activeGaleriaImages = this.girl.images.active;
      this.totalImages = this.girl.images.active.length;
    } else if (imagesType === 'profilePictureRequest') {
      this.activeGaleriaImages = [this.girl.requestProfilePicture];
      this.totalImages = 1;
    } else if (imagesType === 'activeProfilePicture') {
      this.activeGaleriaImages = [this.girl.profilePicture];
      this.totalImages = 1;
    }
    this.activeIndex = index;
    this.displayCustom = true;
  }

  approveImages(event: Event, girlId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to approve this girl images?',
      icon: 'pi pi-question-circle',
      accept: async () => {
        try {
          this.loadingApproveImages = true;
          const approveImagesResponse = await this.mainService.approveImageRequest(girlId);
          this.loadingApproveImages = false;
          if (approveImagesResponse.status === 200) {
            const formattedImages = formatGirlImagesToUrls(approveImagesResponse.data);
            this.girl.images = formattedImages;
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Images set to active`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error approving images', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Error approving images ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  approveProfilePicture(event: Event, girlId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to approve this girl profile picture?',
      icon: 'pi pi-question-circle',
      accept: async () => {
        try {
          const approveProfilePictureResponse = await this.mainService.approveProfilePictureRequest(girlId);
          if (approveProfilePictureResponse.status === 200) {
            const approvedProfilePicture = getImageUrlFromImageName(approveProfilePictureResponse.data);
            this.girl.profilePicture = approvedProfilePicture;
            this.girl.requestProfilePicture = undefined;
            this.internalService.updateSingleGirlFromGirlUsers(this.allGirlUsers, this.girl);
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `profile picture set to active`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error approving profile picture', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Error approving profile picture ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  rejectImages(event: Event) {}

  goBack() {
    this.router.navigate([`/admin/girls/all`]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['girl']) {
      if (this.girl !== undefined) {
        const formattedImages = formatGirlImagesToUrls(this.girl.images);
        this.girl = { ...this.girl, images: formattedImages };
      }
    }
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
            this.girl = { ...activeGirluser.girl };
          }
        } else {
        }
      }
    } catch (error) {
      console.error('Error with getting girl logic', error);
    }
  }
}
