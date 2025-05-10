import { Routes } from '@angular/router';
import { ProjectDetailsComponent } from '../../pages/project-details/project-details.component';
import { InvestmentSidebarComponent } from './components/investment-sidebar/investment-sidebar.component';
import { BusinessInfoComponent } from './components/project-tabs/business-info/business-info.component';
import { DiscussionComponent } from './components/project-tabs/discussion/discussion.component';
import { TeamMembersComponent } from './components/project-tabs/team-members/team-members.component';
import { UpdatesComponent } from './components/project-tabs/updates/updates.component';
import { DocumentsComponent } from './components/project-tabs/documents/documents.component';
import { OfferComponent } from './components/project-tabs/offer/offer.component';
import { OverviewComponent } from './components/project-tabs/overview/overview.component';
import { ProjectResolver } from './resolver/project.resolver';

export const PROJECT_DETAILS_ROUTES: Routes = [
  {
    path: ':id',
    component: ProjectDetailsComponent,
    resolve: { projectData: ProjectResolver },
    children: [
      { path: 'investment-sidebar', component: InvestmentSidebarComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'business-info', component: BusinessInfoComponent },
      { path: 'discussion', component: DiscussionComponent },
      { path: 'team-members', component: TeamMembersComponent },
      { path: 'updates', component: UpdatesComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'offer', component: OfferComponent },
    ],
  },
];
