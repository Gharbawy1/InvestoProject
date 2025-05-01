import { Routes, RouterModule } from '@angular/router';
import { UpgradeRoleComponent } from './../../pages/upgrade-role/upgrade-role.component';
import { InvestorUpgradeComponent } from './components/investor-upgrade/investor-upgrade.component';
import { OwnerUpgradeComponent } from './components/owner-upgrade/owner-upgrade.component';

export const upgradeRoutes: Routes = [
  {
    path: '',
    component: UpgradeRoleComponent,
    children: [
      { path: '', redirectTo: 'Investor', pathMatch: 'full' },
      { path: 'Investor', component: InvestorUpgradeComponent },
      { path: 'BusinessOwner', component: OwnerUpgradeComponent }
    ]
  }
];