import { Routes } from '@angular/router';
import { AppLayoutComponent } from './pages/layoutes/app-layout/app-layout.component';
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
        path: 'profile',
        loadComponent: () =>
          import('./pages/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
          ),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./pages/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
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
    path: 'error',
    loadComponent: () =>
      import('./pages/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'Home',
  },
];
