// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/FrontOffice/features/User/services/services/authentication.service';
import {NotificationService} from "../../../../notification.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // admin.guard.ts
  canActivate(): boolean {
    const isAdmin = this.authService.isAdmin();
    console.log('AdminGuard - isAdmin:', isAdmin); // Log de debug
    return isAdmin;
  }
}
