import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { jwtInterceptor } from './jwt.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideRouter(routes), provideClientHydration(), provideHttpClient(withInterceptors([jwtInterceptor]), withFetch())],
};
