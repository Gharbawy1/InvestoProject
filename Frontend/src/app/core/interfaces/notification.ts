export interface INotification {
  message: string;
  payload?: string;
  type?: string;
}

export interface INotificationResponse {
  id: number;
  receiverId: string;
  issuerId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  payload: string;
}
