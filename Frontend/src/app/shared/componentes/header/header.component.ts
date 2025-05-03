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
  isLoggedIn = false;
  userName: string = '';
  userRole: string = '';

  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.authService.user$.subscribe((user) => {
          this.userName = user?.firstName || 'User';
          this.userRole = user?.role || '';
        });
      } else {
        this.userName = '';
        this.userRole = '';
      }
    });
  }

  getRole(): string | undefined {
    return this.authService.getCurrentUser()?.role.toLowerCase();
  }

  goToDashboard() {
    switch (this.getRole()) {
      case 'investor':
        this.router.navigate(['/InvestorDashboard']);
        break;
      case 'businessowner':
        this.router.navigate(['/BusinessDashboard']);
        break;
      case 'user':
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
  }
}
