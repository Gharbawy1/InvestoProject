import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AuthLayoutComponent } from './pages/layoutes/auth-layout/auth-layout.component';
import { adminResolver } from './features/admin-dashboard/resolvers/admin.resolver';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  // Protected Routes
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
        resolve: {
          projects: adminResolver,
        },
      },
      {
        path: 'ProjectDetails',
        loadChildren: () =>
          import('./features/project/routes').then(
            (m) => m.PROJECT_DETAILS_ROUTES
          ),
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
      {
        path: 'error',
        component: ErrorPageComponent,
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
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: 'LandingPage',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
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
    path: 'UpgradeRole',
    loadChildren: () =>
      import('./features/upgrade-role/routes')
        .then(m => m.upgradeRoutes)
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'Home',
  },
];
