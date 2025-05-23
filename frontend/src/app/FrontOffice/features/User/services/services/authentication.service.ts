/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { authenticate } from '../fn/authentication/authenticate';
import { Authenticate$Params } from '../fn/authentication/authenticate';
import { AuthenticationResponse } from '../models/authentication-response';
import { confirm } from '../fn/authentication/confirm';
import { Confirm$Params } from '../fn/authentication/confirm';
import { refreshToken } from '../fn/authentication/refresh-token';
import { RefreshToken$Params } from '../fn/authentication/refresh-token';
import { register } from '../fn/authentication/register';
import { Register$Params } from '../fn/authentication/register';
import { requestPasswordReset } from '../fn/authentication/request-password-reset';
import { RequestPasswordReset$Params } from '../fn/authentication/request-password-reset';
import { resetPassword } from '../fn/authentication/reset-password';
import { ResetPassword$Params } from '../fn/authentication/reset-password';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models';
import { UserControllerService } from './user-controller.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {


  handleAuthentication() {
    throw new Error('Method not implemented.');
  }
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private jwtHelper = new JwtHelperService();

  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    private router: Router,
    private userService: UserControllerService
  ) {
    super(config, http);

    // Initialisation sécurisée
    try {
      const userJson = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(
        userJson && userJson !== 'undefined' ? JSON.parse(userJson) : null
      );
    } catch (e) {
      console.error('Error initializing user data', e);
      this.currentUserSubject = new BehaviorSubject<any>(null);
      localStorage.removeItem('currentUser');
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  static readonly ResetPasswordPath = '/auth/reset-password';
  static readonly RequestPasswordResetPath = '/auth/request-password-reset';
  static readonly RegisterPath = '/auth/register';
  static readonly RefreshTokenPath = '/auth/refresh-token';
  static readonly AuthenticatePath = '/auth/authenticate';
  static readonly ConfirmPath = '/auth/activate-account';
  private readonly GITHUB_AUTH_URL = `${environment.apiBaseUrl}/oauth2/authorization/github`;
  private readonly GITHUB_CALLBACK_URL = `${environment.apiBaseUrl}/login/oauth2/code/github`;

  private readonly FACEBOOK_AUTH_URL = `${environment.apiBaseUrl}/oauth2/authorization/facebook`;
private readonly FACEBOOK_CALLBACK_URL = `${environment.apiBaseUrl}/login/oauth2/code/facebook`;

private audioEnabled = true;
  private welcomeAudio!: HTMLAudioElement;

private initWelcomeAudio(): void {
  this.welcomeAudio = new Audio();
  this.welcomeAudio.src = `${environment.apiBaseUrl}/auth/welcome`; // Endpoint Spring Boot
  this.welcomeAudio.load();
  this.welcomeAudio.volume = 0.7; // Volume par défaut (70%)
}

private loadAudioPreference(): void {
  const savedPref = localStorage.getItem('audioPreferences');
  if (savedPref) {
    const { enabled, volume } = JSON.parse(savedPref);
    this.audioEnabled = enabled !== false; // true par défaut si non spécifié
    this.welcomeAudio.volume = volume || 0.7;
  }
}

/**
 * Joue le message d'accueil audio
 */
playWelcomeSound(userName?: string): void {
  if (!this.audioEnabled) return;

  try {
    // Réinitialise la lecture si déjà en cours
    this.welcomeAudio.currentTime = 0;

    // Option : Personnalisation avec le nom d'utilisateur
    if (userName) {
      // Alternative TTS si disponible
      this.speakText( `Welcome ${userName  || 'dear user'} to DewiniApp! Thank you for trusting us with your healthcare journey.
        We're honored to support your wellbeing. May you find health and comfort through our services.
        For any medical concerns. our team is here to assist you. Wishing you wellness and peace.`);
    } else {
      this.welcomeAudio.play().catch(e => {
        console.warn('Audio playback prevented:', e);
        // Fallback TTS
        this.speakText('Welcome to our medical platform!');
      });
    }
  } catch (e) {
    console.error('Audio error:', e);
  }
}

/**
 * Fallback Text-to-Speech
 */
private speakText(text: string): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Légèrement plus lent
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Active/Désactive l'audio
 */
toggleAudio(enabled: boolean): void {
  this.audioEnabled = enabled;
  localStorage.setItem('audioPreferences', JSON.stringify({
    enabled,
    volume: this.welcomeAudio.volume
  }));
}

/**
 * Modifie le volume (0 à 1)
 */
setAudioVolume(volume: number): void {
  this.welcomeAudio.volume = Math.min(1, Math.max(0, volume));
  localStorage.setItem('audioPreferences', JSON.stringify({
    enabled: this.audioEnabled,
    volume
  }));
}
 public handleAuthCallback(token: string, refreshToken: string): Observable<any> {
    try {
      if (!token || !refreshToken) {
        throw new Error('Invalid tokens');
      }

      this.storeAuthTokens(token, refreshToken);
      const user = this.getUserFromToken(token);

      if (!user) {
        throw new Error('Failed to decode user from token');
      }

      this.storeUserData(user);
      this.playWelcomeSound(user.firstname);

      return of(user);
    } catch (e) {
      console.error('Authentication error', e);
      this.clearStorage();
      return throwError(() => e);
    }
  }

loginWithFacebook(): void {
  localStorage.setItem('preAuthUrl', this.router.url);
  window.location.href = this.FACEBOOK_AUTH_URL;
}

  private readonly GOOGLE_AUTH_URL = `${environment.apiBaseUrl}/oauth2/authorization/google`;
  private readonly GOOGLE_CALLBACK_URL = `${environment.apiBaseUrl}/login/oauth2/code/google`;

  loginWithGoogle(): void {
    localStorage.setItem('preAuthUrl', this.router.url);
    window.location.href = this.GOOGLE_AUTH_URL;
  }

  resetPassword$Response(params: ResetPassword$Params, context?: HttpContext): Observable<StrictHttpResponse<{ [key: string]: string }>> {
    return resetPassword(this.http, this.rootUrl, params, context);
  }

  resetPassword(params: ResetPassword$Params, context?: HttpContext): Observable<{ [key: string]: string }> {
    return this.resetPassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<{ [key: string]: string }>) => r.body)
    );
  }

  requestPasswordReset$Response(params: RequestPasswordReset$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return requestPasswordReset(this.http, this.rootUrl, params, context);
  }

  requestPasswordReset(params: RequestPasswordReset$Params, context?: HttpContext): Observable<string> {
    return this.requestPasswordReset$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>) => r.body)
    );
  }
  register(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/auth/register`,
      formData,
      {
        reportProgress: true,
        observe: 'response'
      }
    ).pipe(
      map(response => response.body),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
}
  refreshToken$Response(params: RefreshToken$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return refreshToken(this.http, this.rootUrl, params, context);
  }

  refreshToken(params: RefreshToken$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.refreshToken$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>) => r.body)
    );
  }

  authenticate$Response(params: Authenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return authenticate(this.http, this.rootUrl, params, context);
  }

  authenticate(params: Authenticate$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>) => r.body)
    );
  }

  confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return confirm(this.http, this.rootUrl, params, context);
  }

  confirm(params: Confirm$Params, context?: HttpContext): Observable<string> {
    return this.confirm$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>) => r.body)
    );
  }




  isAdmin(): boolean {
    const role = this.getUserRoleFromToken();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }
  getCurrentUser(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  private storeAuthTokens(token: string, refreshToken: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  loginWithGitHub(): void {
    localStorage.setItem('preAuthUrl', this.router.url);
    window.location.href = `${environment.apiBaseUrl}/oauth2/authorization/github`;
  }

  handleGitHubCallback(token: string, refreshToken: string): Observable<any> {
    this.storeAuthTokens(token, refreshToken);

    const user = this.getUserFromToken(token);
    if (!user) {
      return throwError(() => new Error('Unable to decode user from token'));
    }

    this.storeUserData(user);

    // Add logic to redirect to the home page
    const redirectUrl = localStorage.getItem('preAuthUrl') || '/home'; // If no previous URL is stored, default to '/home'
    localStorage.removeItem('preAuthUrl');
    this.router.navigateByUrl(redirectUrl);

    return of(user);
}


 private storeUserData(user: any): void {
    if (user) {
      try {
        const userData = JSON.stringify(user);
        localStorage.setItem('currentUser', userData);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error storing user data', e);
        this.clearStorage();
      }
    } else {
      this.clearStorage();
    }
  }





  handleGoogleCallback(token: string, refreshToken: string): Observable<any> {
    this.storeAuthTokens(token, refreshToken);

    const user = this.getUserFromToken(token);
    if (!user) {
      return throwError(() => new Error('Unable to decode user from token'));
    }

    this.storeUserData(user);

    // Add logic to redirect to the home page
    const redirectUrl = localStorage.getItem('preAuthUrl') || '/home'; // If no previous URL is stored, default to '/home'
    localStorage.removeItem('preAuthUrl');
    this.router.navigateByUrl(redirectUrl);

    return of(user);
  }

  handleFacebookCallback(token: string, refreshToken: string): Observable<any> {
    this.storeAuthTokens(token, refreshToken);

    const user = this.getUserFromToken(token);
    if (!user) {
      return throwError(() => new Error('Unable to decode user from token'));
    }

    this.storeUserData(user);

    // Add logic to redirect to the home page
    const redirectUrl = localStorage.getItem('preAuthUrl') || '/home'; // If no previous URL is stored, default to '/home'
    localStorage.removeItem('preAuthUrl');
    this.router.navigateByUrl(redirectUrl);

    return of(user);
  }





  saveToken(token: string): void {
    localStorage.setItem('token', token);
    const user = this.getUserFromToken(token);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

 // Modification de getUserFromToken pour plus de robustesse
 private getUserFromToken(token: string): any {
  try {
    const payload = this.jwtHelper.decodeToken(token);
    return payload ? {
      id: payload.userId || payload.sub,
      email: payload.email || payload.sub,
      roles: payload.roles || payload.authorities || []
    } : null;
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
}


  private apiUrl = `${environment.apiBaseUrl}/api/face-auth`;
  canUseFaceAuth(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/can-use-face-auth/${userId}`);
  }

  verifyUserFace(userId: number, image: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('image', image, 'webcam-image.jpg');

    return this.http.post(`${this.apiUrl}/verify`, formData);
  }
  loginWithFace(userId: number, image: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('image', image, 'face-image.jpg');

    return this.http.post(`${this.apiUrl}/auth-with-face`, formData).pipe(
      tap((response: any) => {
        this.storeTokens({
          token: response.token,
          refreshToken: response.refreshToken
        });
        this.setCurrentUser(response.user);
      })
    );
  }
  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  storeTokens(tokens: { token: string, refreshToken: string }): void {
    localStorage.setItem('token', tokens.token);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
// Correction de la méthode loadUserFromStorage
private loadUserFromStorage(): void {
  try {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  } catch (e) {
    console.error('Error loading user from storage', e);
    this.clearStorage();
  }
}
  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }




  isMedecin(): boolean {
    return this.getUserRoleFromToken() === 'MEDECIN';
  }

  isUserOrMedecin(): boolean {
    const role = this.getUserRoleFromToken();
    return role === 'USER' || role === 'MEDECIN';
  }

  getUserRoleFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'GUEST';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token payload:', payload);
      const roles = payload?.authorities || [];
      const mainRole = roles[0] || 'USER';
      return mainRole.replace('ROLE_', '').toUpperCase();
    } catch (e) {
      console.error('Error decoding token:', e);
      return 'GUEST';
    }
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.userId || null;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }



  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = this.jwtHelper.decodeToken(token);
      return payload?.userId || null;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }


  getUserIdsByRole(role: string): number[] {
  // Solution 1: Depuis le token JWT
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

  // Solution 2: Depuis le localStorage
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

  // Solution 3: Données mockées (dev seulement)
  console.warn('Using mock users data');
  return [1, 2, 3]; // IDs mockés
}


getConnectedUserName(): string {
  const user = this.currentUserSubject.value;
  if (user) {
    const firstName = user.firstname || '';
    const lastName = user.lastname || '';
    return `${firstName} ${lastName}`.trim();
  }
  return '';
}

getCurrentUserr(): User | null {
  const userData = localStorage.getItem('currentUser');
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return {
      id: user.id,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      address: user.address || user.adresse || '',
      // autres propriétés...
    };
  } catch (e) {
    console.error('Error parsing user data', e);
    return null;
  }
}

getUserIdd(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = this.jwtHelper.decodeToken(token);
    return payload?.userId || null;
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
}

getCurrentUserId(): number | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    const payload = this.jwtHelper.decodeToken(token);
    // Priorité aux différents champs possibles pour l'ID
    return payload?.userId || payload?.id || payload?.sub || null;
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
}


}
