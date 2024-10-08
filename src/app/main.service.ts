import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ClientReview, Service, SubscriptionPayment, City, Ethnicity, Nationality, SpecificLocation, GirlUser, PricingPlan, SeoCategory } from './types';
import { InternalService } from './internal.service';

interface Response {
  status: number;
  data: any;
}
@Injectable({
  providedIn: 'root',
})
export class MainService {
  private baseUrl = environment.baseUrl;
  private baseMultimediaUrl = environment.baseMultimediaUrl;

  constructor(private http: HttpClient, private internalService: InternalService) {}

  async getGirlsByCityId(cityId: string | number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/girls/city/${cityId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getAllGirlUsers(): Promise<any> {
    try {
      const response = await this.http.get<Response>(`${this.baseUrl}/admin-api/users/complete`).toPromise();
      let formatedGirls: GirlUser[] = [];
      if (response) {
        const users = response.data;
        formatedGirls = users.map((user: any) => {
          const girlBdayDate = new Date(user.girl.bday);
          const girl = {
            ...user.girl,
            bday: girlBdayDate,
          };
          return { ...user, girl, edit: false };
        });
      }
      return formatedGirls;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async registerGirlUser(girlUser: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/users`, girlUser).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async setWelcomeSentTrueForUser(userId: number): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/welcomeSent/${userId}`, {}).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async setChangePasswordSentTrueForUser(userId: number): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/changePasswordSent/${userId}`, {}).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateGirlObject(girl: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/girl`, girl).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating Girl Object:', error);
      throw error;
    }
  }

  async updateGirlObjectForClient(girl: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/girl-api/girl`, girl).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating Profile', error);
      throw error;
    }
  }

  async updateGirlPhysicalVerification(girlData: any, girlId: number, adminData: any): Promise<any> {
    const payload = {
      girlData: girlData,
      girlId: girlId,
      adminData: adminData,
    };
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/girlPhysicalVerification`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating Girl Pyhisical verification', error);
      throw error;
    }
  }

  async updateGirlVerificationInformation(verificationData: any, girlData: any, girlId: number, verificationId: number, adminData: any): Promise<any> {
    const payload = {
      verificationData: verificationData,
      girlData: girlData,
      girlId: girlId,
      verificationId: verificationId,
      adminData: adminData,
    };
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/verification`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating Girl verification information', error);
      throw error;
    }
  }

  // City Logic
  async getAllCities(): Promise<any> {
    try {
      const response = await this.http.get<Response>(`${this.baseUrl}/girl-api/cities`).toPromise();
      let cities: City[] = [];
      if (response) {
        cities = response.data;
      }
      return cities;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createCity(city: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/city`, city).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  }

  async updateCity(city: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/city`, city).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating city:', error);
      throw error;
    }
  }

  async deleteCity(city: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/city/${city.id}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }

  // Specific Location Logic
  async getAllSpecificLocations(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/specificLocation`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createSpecificLocation(specificLocation: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/specificLocation`, specificLocation).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating specific location:', error);
      throw error;
    }
  }

  async updateSpecificLocation(specificLocation: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/specificLocation`, specificLocation).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating specific location:', error);
      throw error;
    }
  }

  async deleteSpecificLocation(specificLocation: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/specificLocation/${specificLocation.id}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting specific location:', error);
      throw error;
    }
  }

  // Ethnicity Logic
  async getAllEthnicities(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/ethnicity`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createEthinicity(ethnicity: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/ethnicity`, ethnicity).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating ethnicity:', error);
      throw error;
    }
  }

  async updateEthnicity(ethnicity: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/ethnicity`, ethnicity).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating ethnicity:', error);
      throw error;
    }
  }

  async deleteEthnicity(ethnicityId: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/ethnicity/${ethnicityId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting ethnicity:', error);
      throw error;
    }
  }

  // Nationality Logic
  async getAllNationalities(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/nationality`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createNationality(nationality: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/nationality`, nationality).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating nationality:', error);
      throw error;
    }
  }

  async updateNationality(nationality: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/nationality`, nationality).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating nationality:', error);
      throw error;
    }
  }

  async deleteNationality(nationalityId: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/nationality/${nationalityId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting nationality:', error);
      throw error;
    }
  }

  // Service Logic
  async getAllServices(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/services`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createService(service: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/service`, service).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  async updateService(service: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/service`, service).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  async deleteService(service: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/service/${service.id}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Blogs Logic
  async getBlogById(blogId: number | string): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/blogs/${blogId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getAllBlogs(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/blogs`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createBlog(blog: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/blogs`, blog).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  async updateBlog(blog: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/blogs`, blog).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  async deleteBlog(blog: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/blogs/${blog.id}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting Blog:', error);
      throw error;
    }
  }

  // Girls Functions
  async getWholeGirlUserById(userId: number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/girlUser/${userId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Safety Logic
  async getAllReviewsByGirl(girlId: number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/clientReviewByGirl/${girlId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async getAllClientsByPhonePrefix(phonePrefix: number | string): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/clientByPhone/${phonePrefix}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async getAllClientReviewsByPhoneNumber(phoneNumber: number | string): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/clientReviewByPhone/${phoneNumber}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async deleteReviewByIdForGirl(reviewId: number): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/girl-api/clientReview/${reviewId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async updateReview(review: ClientReview): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/girl-api/clientReview/`, review).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Subscription Logic
  async changeGirlStatus(girlId: number, desiredStatus: boolean): Promise<any> {
    const payload = { girlId: girlId, desiredActiveStatus: desiredStatus };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/girlStatus/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error Changing girl status', error);
      return error;
    }
  }

  async registerPayment(paymentData: any, subscriptionData: any, girlId: number): Promise<any> {
    const payload = { paymentData, subscriptionData, girlId };
    try {
      const response = await this.http.post(`${this.baseUrl}/subscription-api/payment/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error while registering payment', error);
      return error;
    }
  }

  async updateSubscription(paymentTier: string, expiryDate: any, deactivationDate: any, girlId: number, subscriptionId: number): Promise<any> {
    const payload = { paymentTier, expiryDate, deactivationDate, girlId, subscriptionId };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/girlSubscription/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error while updating girl subscription data', error);
      return error;
    }
  }

  async getAllPaymentsMadeByGirl(subscriptionId: number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/subscription-api/payment/${subscriptionId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to get all payments by girl', error);
      return error;
    }
  }

  async getMostRecentPaymentBySubcriptionId(subscriptionId: number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/subscription-api/lastPayment/${subscriptionId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to the most recent payment', error);
      return error;
    }
  }

  async deleteRegisteredPayemnt(paymentId: number): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/subscription-api/payment/${paymentId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to delete payment', error);
      return error;
    }
  }

  async updatePayment(paymentData: SubscriptionPayment): Promise<any> {
    const payload = { paymentData };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/payment/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to delete payment', error);
      return error;
    }
  }

  async registerPause(pauseStartDate: Date, pauseEndDate: Date, subscriptionId: number): Promise<any> {
    const payload = { pauseStartDate, pauseEndDate, subscriptionId };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/pause/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying register a pause in the subscription', error);
      return error;
    }
  }

  async cancelRegisteredPause(pauseNumber: number, subscriptionId: number, girlId: number): Promise<any> {
    const payload = { pauseNumber, subscriptionId, girlId };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/cancelPause/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying register a pause in the subscription', error);
      return error;
    }
  }

  async updateGirlHidenStatus(girlId: number, desiredHidenStatus: boolean): Promise<any> {
    const payload = { girlId, desiredHidenStatus };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/girlHidenStatus/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to change girl hiden status', error);
      return error;
    }
  }

  async approveImageRequest(girlId: number): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseMultimediaUrl}/multimedia-api/approve/${girlId}`, {}).toPromise();
      return response;
    } catch (error) {
      console.error('Error while approving images', error);
      return error;
    }
  }

  async approveProfilePictureRequest(girlId: number): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseMultimediaUrl}/multimedia-api/approveProfilePicture/${girlId}`, {}).toPromise();
      return response;
    } catch (error) {
      console.error('Error while approving profile picture', error);
      return error;
    }
  }

  // Bulk Update Logic
  async BulkUpdateCENSS(type: string, data: City[] | Ethnicity[] | Nationality | Service[] | SpecificLocation[]): Promise<any> {
    try {
      const payload = { type, data };
      const response = await this.http.post(`${this.baseUrl}/admin-api/bulkUpdateCENSS/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error(`Error while bulk updating objects of type ${type}`, error);
      return error;
    }
  }

  // Pricing Plan Logic
  async getAllPricingPlans(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/pricingPlan`).toPromise();
      return response;
    } catch (error) {
      console.error(`Error while fetching pricing plan data`, error);
      return error;
    }
  }

  async createPricingPlan(pricingPlan: PricingPlan): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/pricingPlan`, pricingPlan).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating new pricing plan', error);
      throw error;
    }
  }

  async updatePricingPlan(pricingPlan: PricingPlan): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/pricingPlan`, pricingPlan).toPromise();
      return response;
    } catch (error) {
      console.error('Error Updating pricing plan', error);
      throw error;
    }
  }

  async deletePricingPlan(pricignPlan: any): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/pricingPlan/${pricignPlan.id}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting Pricing Plan:', error);
      throw error;
    }
  }

  // Seo Category Logic
  async getAllCategories(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/category`).toPromise();
      return response;
    } catch (error) {
      console.error(`Error while fetching seo categories data`, error);
      return error;
    }
  }

  async createSeoCategory(SeoCategory: SeoCategory): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/admin-api/category`, SeoCategory).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating new Seo Category', error);
      throw error;
    }
  }

  async udpateSeoCategory(SeoCategory: SeoCategory): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/admin-api/category`, SeoCategory).toPromise();
      return response;
    } catch (error) {
      console.error('Error Updating Seo category', error);
      throw error;
    }
  }

  async deleteCategory(SeoCategory: SeoCategory): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/category/${SeoCategory.id}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting Category', error);
      throw error;
    }
  }

  async getBanner(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/banner`).toPromise();
      return response;
    } catch (error) {
      console.error(`Error while fetching pricing plan data`, error);
      return error;
    }
  }

  async updateBanner(message: string, title: string): Promise<any> {
    try {
      const payload = { message: message, title: title };
      const response = await this.http.put(`${this.baseUrl}/admin-api/banner`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error Updating BannerF', error);
      throw error;
    }
  }

  async updateBannerShow(showValue: boolean): Promise<any> {
    try {
      const payload = { showBannerValue: showValue };
      const response = await this.http.put(`${this.baseUrl}/admin-api/bannerShow`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error Updating Banner show value', error);
      throw error;
    }
  }

  async cleanMultimediaData(): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseMultimediaUrl}/multimedia-api/cleanMultimedia`, {}).toPromise();
      return response;
    } catch (error) {
      console.error('Error cleaning multimedia data', error);
      throw error;
    }
  }

  async getAllNotifications(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/admin-api/notification`).toPromise();
      return response;
    } catch (error) {
      console.error('Error getting all notifications', error);
      throw error;
    }
  }

  async getAnounceRequestById(anounceRequestId: number | string): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/admin-api/anounceRequest/${anounceRequestId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error gettting anounce request', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string | number): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/notification/${notificationId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error getting all notifications', error);
      throw error;
    }
  }

  async deleteAnounceRequest(anounceRequestId: string | number): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/anounceRequest/${anounceRequestId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error gettting all anounce requests', error);
      throw error;
    }
  }

  async deleteUserById(userId: string | number): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/admin-api/user/${userId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error Deleting user', error);
      throw error;
    }
  }
}
