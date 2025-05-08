import { Component } from '@angular/core';
import { NotificationService } from "../../features/User/services/services/notification.service";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class NotificationComponent {

  notifications$ = this.notificationService.notifications;
  constructor(private notificationService: NotificationService) {}

  getIconClass(type: string) {
    return {
      'success': 'fas fa-check-circle',
      'error': 'fas fa-exclamation-triangle',
      'info': 'fas fa-info-circle',
      'warning': 'fas fa-exclamation-circle'
    }[type];
  }

  close(id: number) {
    this.notificationService.removeNotification(id);
  }
}
