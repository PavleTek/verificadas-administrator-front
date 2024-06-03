import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { LocationsComponent } from './locations/locations.component';
import { ServicesComponent } from './services/services.component';
import { PricingComponent } from './pricing/pricing.component';
import { NationalitiesComponent } from './nationalities/nationalities.component';
import { LoginComponent } from './login/login.component';
import { GirlsComponent } from './girls/girls.component';
import { VerificationComponent } from './verification/verification.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { CreateGirlComponent } from './create-girl/create-girl.component';
import { ReportsComponent } from './reports/reports.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogViewComponent } from './blog-view/blog-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'service', component: ServicesComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'nationality', component: NationalitiesComponent },
      {
        path: 'blogs',
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          { path: 'all', component: BlogsComponent },
          { path: 'view/:id', component: BlogViewComponent },
        ],
      },
      {
        path: 'girls',
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          { path: 'all', component: GirlsComponent },
          { path: 'create', component: CreateGirlComponent },
          { path: 'create/:id', component: CreateGirlComponent },
          { path: 'multimedia/:id', component: MultimediaComponent },
          { path: 'verification/:id', component: VerificationComponent },
          { path: 'subscription/:id', component: SubscriptionComponent },
        ],
      },
      { path: 'notifications', component: NotificationsComponent },
    ],
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
];
