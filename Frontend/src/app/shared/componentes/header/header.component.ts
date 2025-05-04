import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserDetails } from '../../../core/interfaces/UserDetails';
import { AuthService } from '../../../core/services/auth/auth.service';
import { stat } from 'fs';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private destroy$ = new Subject<void>();
  isLoggedIn: boolean = false;
  userName: string = '';
  userRole: string = '';

  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    combineLatest([this.authService.isLoggedIn$, this.authService.user$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isLoggedIn, user]) => {
        this.isLoggedIn = isLoggedIn;

        if (isLoggedIn && user) {
          this.userName = user.firstName || 'User';
          this.userRole = user.role || '';
        } else {
          this.userName = '';
          this.userRole = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToDashboard() {
    switch (this.userRole) {
      case 'Investor':
        this.router.navigate(['/InvestorDashboard']);
        break;
      case 'businessOwner':
        this.router.navigate(['/BusinessDashboard']);
        break;
      case 'User':
        this.router.navigate(['/UpgradeRole']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/LandingPage']);
  }
}
