import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AuthLayoutComponent } from './pages/layoutes/auth-layout/auth-layout.component';
import { adminResolver } from './features/admin-dashboard/resolvers/admin.resolver';
import { authGuard } from './core/guards/auth/auth.guard';
import { guestGuard } from './core/guards/guest/guest.guard';
import { businessGuard } from './core/guards/business/business.guard';
import { investorGuard } from './core/guards/investor/investor.guard';
import { userGuard } from './core/guards/user/user.guard';
import { adminGuard } from './core/guards/admin/admin.guard';

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
        canActivate: [businessGuard],
        loadComponent: () =>
          import(
            './pages/business-dashboard/business-dashboard.component'
          ).then((m) => m.BusinessDashboardComponent),
      },

      {
        path: 'BusinessCreation',
        canActivate: [businessGuard],
        loadComponent: () =>
          import('./pages/business-creation/business-creation.component').then(
            (m) => m.BusinessCreationComponent
          ),
      },
      {
        path: 'InvestorDashboard',
        canActivate: [investorGuard],
        loadComponent: () =>
          import(
            './pages/investor-dashboard/investor-dashboard.component'
          ).then((m) => m.InvestorDashboardComponent),
      },
      {
        path: 'Payment',
        canActivate: [investorGuard],
        loadComponent: () =>
          import(
            './features/project/components/payment-page/payment-page.component'
          ).then((m) => m.PaymentPageComponent),
      },
      {
        path: 'AdminDashboard',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
        resolve: {
          projects: adminResolver,
        },
      },
      {
        path: '',
        component: AppLayoutComponent,
        canActivate: [userGuard],
        children: [
          {
            path: 'UpgradeRole',
            loadChildren: () =>
              import('./features/upgrade-role/routes').then(
                (m) => m.upgradeRoutes
              ),
          },
          {
            path: 'UserProfile',
            loadComponent: () =>
              import('./pages/user-profile/user-profile.component').then(
                (m) => m.UserProfileComponent
              ),
          },
        ],
      },
      {
        path: 'error',
        loadComponent: () =>
          import('./shared/componentes/error/error.component').then(
            (m) => m.ErrorComponent
          ),
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./shared/componentes/success/success.component').then(
            (m) => m.SuccessComponent
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
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'Home',
  },
];
