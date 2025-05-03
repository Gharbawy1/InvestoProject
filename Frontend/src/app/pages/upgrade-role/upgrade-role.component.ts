import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  RouterModule,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upgrade-role',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './upgrade-role.component.html',
  styleUrls: ['./upgrade-role.component.css']
})
export class UpgradeRoleComponent implements OnInit {
  activeTab: 'Investor' | 'BusinessOwner' = 'Investor';

  blockMessage?: string;
  navigationPath: string[] = ['/'];
  navigationButtonText = 'Go home';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.blockAccess({
        message: 'You must be logged in to be here',
        path: ['/auth'],
        buttonText: 'Login Now',
      });
      return;
    }
    if (user.role !== 'User') {
      this.blockAccess({
        message: 'Only users with the Guest role may come here.',
        path: ['/'],
        buttonText: 'Return to home',
      });
      return;
    }

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const childPath = this.route.snapshot.firstChild?.routeConfig?.path;
        this.activeTab = childPath === 'BusinessOwner'
          ? 'BusinessOwner'
          : 'Investor';
      });

    const initChild = this.route.snapshot.firstChild?.routeConfig?.path;
    this.activeTab = initChild === 'BusinessOwner' ? 'BusinessOwner' : 'Investor';
  }

  navigate(tab: 'Investor' | 'BusinessOwner') {
    this.router.navigate([tab], { relativeTo: this.route });
  }

  public blockAccess(config: {
    message: string;
    path: string[];
    buttonText?: string;
  }) {
    this.blockMessage = config.message;
    this.navigationPath = config.path;
    this.navigationButtonText = config.buttonText ?? 'Go home';
  }

  public goNavigate() {
    this.router.navigate(this.navigationPath);
  }
}
