import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AuthLayoutComponent } from './pages/layoutes/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'LandingPage', pathMatch: 'full' },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'LandingPage',
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'BusinessDashboard',
        loadComponent: () =>
          import(
            './pages/business-dashboard/business-dashboard.component'
          ).then((m) => m.BusinessDashboardComponent),
      },
      {
        path: 'InvestorDashboard',
        loadComponent: () =>
          import(
            './pages/investor-dashboard/investor-dashboard.component'
          ).then((m) => m.InvestorDashboardComponent),
      },
      {
        path: 'AdminDashboard',
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
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
        path: 'Payment',
        loadComponent: () =>
          import(
            './features/project/components/payment-page/payment-page.component'
          ).then((m) => m.PaymentPageComponent),
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
    path: 'BusinessCreation',
    loadComponent: () =>
      import('./pages/business-creation/business-creation.component').then(
        (m) => m.BusinessCreationComponent
      ),
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'LandingPage',
  },
];
