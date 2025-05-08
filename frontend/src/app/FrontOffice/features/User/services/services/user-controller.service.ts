import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';
import { ApiConfiguration } from '../api-configuration';
import { BaseService } from '../base-service';

@Injectable({ providedIn: 'root' })
export class UserControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }
  private currentUser: User | null = null;
  static readonly GetUserByIdPath = '/users/{id}';

  getUserById(params: { id: number }): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Fetching user with ID:', params.id);
    return this.http.get<User>(`${environment.apiBaseUrl}/users/${params.id}`, { headers })
        .pipe(
            tap(response => console.log('User data received:', response)),
            catchError(error => {
                console.error('Error fetching user:', error);
                return throwError(error);
            })
        );
  }

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(`${environment.apiBaseUrl}/users`, { headers })
        .pipe(
            tap(response => console.log('All users data received:', response)),
            catchError(error => {
                console.error('Error fetching all users:', error);
                return throwError(error);
            })
        );
  }

  updateUser(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Sending update request for user ID:', userData.id);
    console.log('Payload:', userData);

    return this.http.put(
      `${environment.apiBaseUrl}/users/${userData.id}`,
      userData,
      { headers }
    ).pipe(
      tap(response => {
        console.log('Update successful:', response);
        if (userData.password) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('currentUser');
      }
      }),
      catchError(error => {
        console.error('Update error:', error);
        return throwError(error);
      })
    );
  }

  getProfilePicture(userId: number): string | null {
    return localStorage.getItem(`profile_image_${userId}`);
  }

  getSafeProfilePicUrl(url: string | undefined): string {
    if (!url) {
      return this.getDefaultProfilePicUrl();
    }

    if (url.startsWith('temp_') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) {
      return `${environment.apiBaseUrl}/uploads/${url}`;
    }

    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }

    return this.getDefaultProfilePicUrl();
  }

  getDefaultProfilePicUrl(): string {
    return 'assets/images/default-profile.png';
  }

  handleImageError(event: Event, userId?: number): void {
    const imgElement = event.target as HTMLImageElement;

    if (userId) {
      const localImage = this.getProfilePicture(userId);
      if (localImage) {
        imgElement.src = localImage;
        return;
      }
    }

    imgElement.src = this.getDefaultProfilePicUrl();
  }

  getUserIdsByRole(role: string): number[] {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.users) {
          return payload.users
            .filter((user: any) =>
              user.roles?.includes(role) ||
              user.roles?.includes(`ROLE_${role}`) ||
              user.roles?.some((r: any) => r.name === role || r.name === `ROLE_${role}`)
            )
            .map((user: any) => user.id);
        }
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      return users
        .filter((user: any) =>
          user.roles?.includes(role) ||
          user.roles?.includes(`ROLE_${role}`)
        )
        .map((user: any) => user.id);
    }

    console.warn('Using mock users data');
    return [1, 2, 3]; // IDs mockés
  }

  getConnectedUser(): User | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user;
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser = payload.user;
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
