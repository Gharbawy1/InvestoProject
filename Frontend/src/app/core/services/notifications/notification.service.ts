import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { INotification } from '../../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  constructor(private toastr: ToastrService) {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://investo.runasp.net/notificationHub', {
        accessTokenFactory: () =>
          localStorage.getItem('token') ||
          sessionStorage.getItem('token') ||
          '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR error:', err));

    this.hubConnection.on(
      'ReceiveNotification',
      (notification: INotification) => {
        this.showNotification(notification);
      }
    );
  }

  private showNotification(notification: INotification): void {
    this.toastr.info(notification.message, 'Notification');
    console.log('الإشعار:', notification.message);
    try {
      const payload = notification.payload
        ? JSON.parse(notification.payload)
        : null;
      console.log('تفاصيل الإشعار:', payload);
    } catch (e) {
      console.warn('فشل في قراءة payload:', e);
    }
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
