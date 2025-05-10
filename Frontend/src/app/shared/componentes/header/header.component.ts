import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import {
  INotification,
  INotificationResponse,
} from '../../../core/interfaces/notification';
import { NotificationService } from '../../../core/services/notifications/notification.service';
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
  profilePictureURL: string = '';
  notifications: INotificationResponse[] = [];
  unreadCount = 0;
  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.notificationService.getNotifications().subscribe((notifs) => {
        this.notifications = notifs.data;
      });
    }

    combineLatest([this.authService.isLoggedIn$, this.authService.user$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isLoggedIn, user]) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn && user) {
          this.userName = user.firstName || 'User';
          this.userRole = user.role || '';
          this.profilePictureURL = user.profilePictureURL || '';
        } else {
          this.userName = '';
          this.userRole = '';
        }
      });
  }

  goToDashboard() {
    switch (this.userRole) {
      case 'Investor':
        this.router.navigate(['/InvestorDashboard']);
        break;
      case 'BusinessOwner':
        this.router.navigate(['/BusinessDashboard']);
        break;
      case 'User':
        this.router.navigate(['/UpgradeRole']);
        break;
      case 'Admin':
        this.router.navigate(['/AdminDashboard']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
  markAsRead(id: number) {
    this.notificationService.markNotificationAsRead(id).subscribe((res) => {
      this.notifications = this.notifications.map((notification) => {
        if (notification.id === id) {
          notification.isRead = true;
        }
        return notification;
      });
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  showNotifications = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/LandingPage']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
