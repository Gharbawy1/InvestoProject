import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
import { AuthModelComponent } from './pages/auth-model/auth-model.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './pages/business-dashboard/business-dashboard.component'
          ).then((m) => m.BusinessDashboardComponent),
      },
      {
        path: 'InvestorDashboard',
        loadComponent: () => import('./pages/investor-dashboard/investor-dashboard.component').then((m) => m.InvestorDashboardComponent)
      },
      {
        path : 'AdminDashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
      }
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth-model/auth-model.component').then((m) => m.AuthModelComponent),
  },
  { path: '', redirectTo: 'LandingPage', pathMatch: 'full' },
  {
    path: 'Payment',
    loadComponent: () => import('./features/project/components/payment-page/payment-page.component').then((m) => m.PaymentPageComponent)
  },
  {
    path:'ProjectDetails',
    loadChildren: () => import('./features/project/routes').then(m => m.PROJECT_DETAILS_ROUTES)
  },
  {
    path : 'BusinessCreation',
    loadComponent: () => import('./pages/business-creation/business-creation.component').then((m) => m.BusinessCreationComponent)
  },
  
];
