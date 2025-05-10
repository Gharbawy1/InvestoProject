import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { LoadingService } from './core/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotificationService } from './core/services/notifications/notification.service';
import { privateDecrypt } from 'crypto';
import { AuthService } from './core/services/auth/auth.service';
import { INotificationResponse } from './core/interfaces/notification';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'InvestGo';
  notifications: INotificationResponse[] = [];
  userId: string | undefined = '';

  constructor(
    private router: Router,
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof ResolveStart || event instanceof NavigationStart) {
        this.loadingService.busy();
      } else if (
        event instanceof ResolveEnd ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.idle();
      }
    });
  }
  ngOnInit(): void {
    this.authService.user$.subscribe((res) => {
      this.userId = res?.id;

      if (this.userId) {
        this.notificationService.startConnection();

        this.notificationService.getNotifications().subscribe((res) => {
          this.notifications = res.data.filter(
            (n) => n.receiverId === this.userId
          );
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationService.stopConnection();
  }
}
