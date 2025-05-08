// face-auth.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaceAuthService } from '../../services/services/face-auth.service';
import { AuthenticationService } from '../../services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-face-auth',
  templateUrl: './face-auth.component.html',
  styleUrls: ['./face-auth.component.css']
})
export class FaceAuthComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  
  isLoading = false;
  errorMessage: string = '';
  showCamera = true;

  constructor(
    private faceAuthService: FaceAuthService,
    private authService: AuthenticationService,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  ngAfterViewInit(): void {
    this.startCamera();
  }

  startCamera(): void {
    this.video = this.videoElement.nativeElement;
    this.canvas = this.canvasElement.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 1280, 
        height: 720,
        facingMode: 'user' 
      }, 
      audio: false 
    }).then((stream) => {
      this.video.srcObject = stream;
      this.video.play();
    }).catch((err) => {
      console.error('Camera error:', err);
      this.errorMessage = 'Veuillez autoriser l\'accès à la caméra';
      this.notifyService.showError(this.errorMessage, 'Erreur');
    });
  }

  captureAndVerify(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    
    this.canvas.toBlob((blob) => {
      if (!blob) {
        this.handleError('Erreur de capture d\'image');
        return;
      }
      
      this.faceAuthService.authenticateWithFace(blob).subscribe({
        next: (response: any) => {
          if (response.token) {
            this.handleSuccess(response);
          } else {
            this.handleError(response.message || 'Échec de la reconnaissance faciale');
          }
        },
        error: (err) => {
          console.error('Auth error:', err);
          this.handleError(err.error?.message || 'Erreur d\'authentification');
        }
      });
    }, 'image/jpeg', 0.9);
  }

  private handleSuccess(response: any): void {
    this.stopCamera();
    
    this.authService.storeTokens({
      token: response.token,
      refreshToken: response.refreshToken
    });
    
    this.authService.setCurrentUser(response.user);
    this.authService.playWelcomeSound(response.user?.firstname);
    this.notifyService.showSuccess('Authentification réussie', 'Bienvenue !');
  
    this.router.navigate(['/home']);
    this.isLoading = false;
  }



  stopCamera(): void {
    if (this.video?.srcObject) {
      (this.video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  private handleError(message: string): void {
    this.isLoading = false;
    
    // Message plus détaillé selon le type d'erreur
    let toastMessage = message;
    let toastTitle = 'Erreur';
    
    if (message.includes('caméra')) {
      toastMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.';
      toastTitle = 'Permission requise';
    } else if (message.includes('reconnaissance')) {
      toastMessage = 'Visage non reconnu. Veuillez essayer à nouveau ou utiliser une autre méthode d\'authentification.';
      toastTitle = 'Reconnaissance échouée';
    }
  
    // Affichage du toast d'erreur
    this.notifyService.showError(toastMessage, toastTitle);
  
    // Réinitialisation du message d'erreur (optionnel)
    this.errorMessage = '';
  }
}