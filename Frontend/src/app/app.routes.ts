import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AuthModelComponent } from './pages/auth-model/auth-model.component';
import { ProjectCardComponent } from './features/project/components/project-card/project-card.component';

export const routes: Routes = [
    {path: 'LandingPage', component: LandingPageComponent},
    {path: 'auth', component: AuthModelComponent},
    {path: 'projectCard', component: ProjectCardComponent},
    {path: '', redirectTo: 'LandingPage', pathMatch: 'full'},
];
