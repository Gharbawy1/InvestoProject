import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { LoginFormComponent } from './Components/login-form/login-form.component';

export const routes: Routes = [
    {path: 'LandingPage', component: LandingPageComponent},
    {path: 'login', component: LoginFormComponent},
    {path: '', redirectTo: 'LandingPage', pathMatch: 'full'},
];
