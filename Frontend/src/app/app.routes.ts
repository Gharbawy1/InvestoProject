import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
import { AuthModelComponent } from './pages/auth-model/auth-model.component';

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
        path:'ProjectDetails',
        loadComponent: () => import('./pages/project-details/project-details.component').then((m) => m.ProjectDetailsComponent)
      },
      {
        path: 'InvestorDashboard',
        loadComponent: () => import('./pages/investor-dashboard/investor-dashboard.component').then((m) => m.InvestorDashboardComponent)
      }
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth-model/auth-model.component').then((m) => m.AuthModelComponent),
  },
  { path: '', redirectTo: 'LandingPage', pathMatch: 'full' },
];
