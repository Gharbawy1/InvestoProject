import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import {
  INotification,
  INotificationResponse,
} from '../../interfaces/notification';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ArrayApiResponse,
  ObjectApiResponse,
} from '../../interfaces/ApiResponse';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private isBrowser: boolean;

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  startConnection(): void {
    if (!this.isBrowser) return;

    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token') || '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://investo.runasp.net/notificationHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch((err) => console.error('❌ SignalR connection error:', err));

    this.hubConnection.on(
      'ReceiveNotification',
      (notification: INotificationResponse) => {
        this.showNotification(notification);
      }
    );
  }

  private showNotification(notification: INotificationResponse): void {
    if (!this.isBrowser || !notification) return;

    const storedUser = localStorage.getItem('user'); // أو استخدم authService
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (notification.receiverId !== userId) return; // ✅ فلترة المستهدف

    this.toastr.info(notification.message, 'Notification');
    console.log('📢 الإشعار:', notification.message);

    try {
      const payload = notification.payload
        ? JSON.parse(notification.payload)
        : null;
      console.log('🧾 تفاصيل الإشعار:', payload);
    } catch (e) {
      console.warn('⚠️ فشل في قراءة payload:', e);
    }
  }

  getNotifications(): Observable<ArrayApiResponse<INotificationResponse>> {
    return this.http.get<ArrayApiResponse<INotificationResponse>>(
      `${environment.baseApi}${environment.notification.getAll}`
    );
  }

  markNotificationAsRead(
    id: number
  ): Observable<ObjectApiResponse<INotificationResponse>> {
    return this.http.put<ObjectApiResponse<INotificationResponse>>(
      `${environment.baseApi}${environment.notification.markAsRead(id)}`,
      {}
    );
  }

  stopConnection(): void {
    if (this.isBrowser && this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
