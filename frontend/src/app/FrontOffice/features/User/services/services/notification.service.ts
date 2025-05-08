import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from 'src/app/models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private autoCloseDelay = 5000;


  get notifications() {
    return this.notifications$.asObservable();
  }

  showSuccess(message: string, duration?: number) {
    this.addNotification('success', message, duration);
  }

  showError(message: string, duration?: number) {
    this.addNotification('error', message, duration);
  }

  showInfo(message: string, duration?: number) {
    this.addNotification('info', message, duration);
  }

  showWarning(message: string, duration?: number) {
    this.addNotification('warning', message, duration);
  }

  private addNotification(type: Notification['type'], message: string, duration = this.autoCloseDelay) {
    const notification: Notification = {
      id: Date.now(),
      type,
      message,
      duration
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    if (duration > 0) {
      setTimeout(() => this.removeNotification(notification.id), duration);
    }
  }

  removeNotification(id: number) {
    const filtered = this.notifications$.value.filter(n => n.id !== id);
    this.notifications$.next(filtered);
  }

  constructor() { }
}
