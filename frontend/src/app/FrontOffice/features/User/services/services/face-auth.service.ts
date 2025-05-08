import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FaceAuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/face-auth`;
  private authUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private router: Router // Ajout du Router

  ) { }

  canUseFaceAuth(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/can-use-face-auth/${userId}`);
  }

  verifyUserFace(image: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('image', image, 'webcam-image.jpg');
    
    return this.http.post(`${this.apiUrl}/verify`, formData);
  }

  authenticateWithFace(image: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('image', image, 'face-image.jpg');
    
    return this.http.post(`${this.authUrl}/auth-with-face`, formData).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          // Stockage des tokens et données utilisateur
          this.authService.storeTokens({
            token: response.token,
            refreshToken: response.refreshToken
          });
          this.authService.setCurrentUser(response.user);
          
          // Redirection vers la page home
          this.router.navigate(['/home']);
        }
      })
    );
  }
}