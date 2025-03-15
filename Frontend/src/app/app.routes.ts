import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { AuthModalComponent } from './Components/auth-modal/auth-modal.component';
import { ProjectCardComponent } from './Components/project-card/project-card.component';

export const routes: Routes = [
    {path: 'LandingPage', component: LandingPageComponent},
    {path: 'auth', component: AuthModalComponent},
    {path: 'projectCard', component: ProjectCardComponent},
    {path: '', redirectTo: 'LandingPage', pathMatch: 'full'},
];
