import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AuthLayoutComponent } from './pages/layoutes/auth-layout/auth-layout.component';
import { adminResolver } from './features/admin-dashboard/resolvers/admin.resolver';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { BusinessOwnerGuard } from './features/business-dashboard/guards/business-owner.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'Home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'BusinessDashboard',
        loadComponent: () =>
          import(
            './pages/business-dashboard/business-dashboard.component'
          ).then((m) => m.BusinessDashboardComponent),
        canActivate: [BusinessOwnerGuard],
      },
      {
        path: 'InvestorDashboard',
        loadComponent: () =>
          import(
            './pages/investor-dashboard/investor-dashboard.component'
          ).then((m) => m.InvestorDashboardComponent),
      },

      {
        path: 'BusinessCreation',
        loadComponent: () =>
          import('./pages/business-creation/business-creation.component').then(
            (m) => m.BusinessCreationComponent
          ),
      },
      {
        path: 'Payment',
        loadComponent: () =>
          import(
            './features/project/components/payment-page/payment-page.component'
          ).then((m) => m.PaymentPageComponent),
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadComponent: () =>
          import('./pages/auth-model/auth-model.component').then(
            (m) => m.AuthModelComponent
          ),
      },
      {
        path: 'error',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./shared/componentes/error/error.component').then(
            (m) => m.ErrorComponent
          ),
      },
      {
        path: 'success',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./shared/componentes/success/success.component').then(
            (m) => m.SuccessComponent
          ),
      },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'LandingPage',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'ProjectDetails',
        loadChildren: () =>
          import('./features/project/routes').then(
            (m) => m.PROJECT_DETAILS_ROUTES
          ),
      },
    ],
  },
  {
    path: 'UpgradeRole',
    loadChildren: () =>
      import('./features/upgrade-role/routes').then((m) => m.upgradeRoutes),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: 'OfferPay',
    loadComponent: () =>
      import(
        './features/investor-dashboard/components/offers/offers.component'
      ).then((m) => m.OffersComponent),
  },
  {
    path: 'AdminDashboard',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    resolve: {
      projects: adminResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'Home',
  },
];
