import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Succès') {
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true
    });
  }

  showError(message: string, title: string = 'Erreur') {
    this.toastr.error(message, title, {
      timeOut: 5000, // Plus long pour les erreurs
      disableTimeOut: false,
      tapToDismiss: false
    });
  }

  showInfo(message: string, title: string = 'Information') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Avertissement') {
    this.toastr.warning(message, title);
  }
}