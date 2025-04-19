import { Routes } from "@angular/router";
import { ProjectDetailsComponent } from "../../pages/project-details/project-details.component";
import { InvestmentSidebarComponent } from "./components/investment-sidebar/investment-sidebar.component";
import { ProjectTabsComponent } from "./components/project-tabs/project-tabs.component";
import { BusinessInfoComponent } from "./components/project-tabs/business-info/business-info.component";
import { MarketAnalysisComponent } from "./components/project-tabs/market-analysis/market-analysis.component";
import { DiscussionComponent } from "./components/project-tabs/discussion/discussion.component";
import { FinancialsComponent } from "./components/project-tabs/financials/financials.component";
import { TeamMembersComponent } from "./components/project-tabs/team-members/team-members.component";
import { UpdatesComponent } from "./components/project-tabs/updates/updates.component";
import { DocumentsComponent } from "./components/project-tabs/documents/documents.component";

export const PROJECT_DETAILS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectDetailsComponent,
    children: [
      {
        path: 'investment-sidebar',
        component: InvestmentSidebarComponent,
      },
      {
        path: '',
        component: ProjectTabsComponent,
        children: [
          { path: '', redirectTo: 'business-info', pathMatch: 'full' },
          { path: 'business-info', component: BusinessInfoComponent },
          { path: 'market-analysis', component: MarketAnalysisComponent },
          { path: 'discussion', component: DiscussionComponent },
          { path: 'financials', component: FinancialsComponent },
          { path: 'team-members', component: TeamMembersComponent },
          { path: 'updates', component: UpdatesComponent },
          { path: 'documents', component: DocumentsComponent }
        ]
      }
    ]
  }
];