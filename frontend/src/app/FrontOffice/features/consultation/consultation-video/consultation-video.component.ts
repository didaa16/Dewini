import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ActivatedRoute } from '@angular/router';
import { EmailService } from "../../User/services/services/email.service";
import { animate, style, transition, trigger } from '@angular/animations';
declare var bootstrap: any;

@Component({
  selector: 'app-consultation-video',
  templateUrl: './consultation-video.component.html',
  styleUrls: ['./consultation-video.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('buttonHover', [
      transition(':enter', [
        style({ transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ConsultationVideoComponent implements OnInit, AfterViewInit {
  private hasDevicePermissions = false;
  consultationLink: string = '';
  showSendLinkButton = false;
  patientEmail: string = '';
  private modal: any;
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.consultationLink = window.location.href;
    this.showSendLinkButton = true;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.initializeModal();
    this.checkDevicePermissions().then(() => {
      if (this.hasDevicePermissions) {
        this.initZegoKit();
      } else {
        this.error = 'Impossible d\'accéder à la caméra ou au microphone. Veuillez vérifier vos permissions.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    if (!document.getElementById('displayYear')) {
      const yearSpan = document.createElement('span');
      yearSpan.id = 'displayYear';
      document.body.appendChild(yearSpan);
    }
  }

  private initializeModal(): void {
    const modalElement = document.getElementById('sendLinkModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      this.error = 'Erreur lors de l\'initialisation du modal';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async checkDevicePermissions(): Promise<void> {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.hasDevicePermissions = true;
    } catch (error) {
      console.error('Error getting media permissions:', error);
      this.hasDevicePermissions = false;
    }
  }

  async initZegoKit(): Promise<void> {
    try {
      const roomID = this.route.snapshot.queryParams['roomID'] || (Math.floor(Math.random() * 10000) + "");
      const userID = Math.floor(Math.random() * 10000) + "";
      const userName = "userName" + userID;
      const appID = 1452671263;
      const serverSecret = "48583229452fb527e854f15b8e7998da";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

      const container = document.querySelector("#zegoContainer") as HTMLElement | null;
      if (!container) {
        this.error = 'Conteneur de vidéo non trouvé';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      this.consultationLink = window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID;
      this.showSendLinkButton = true;

      await zp.joinRoom({
        container: container,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference
        },
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: true
      });

      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error initializing ZegoKit:', error);
      this.error = 'Erreur lors de l\'initialisation de la vidéoconférence';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  sendLinkToPatient(): void {
    if (this.modal) {
      this.modal.show();
      this.cdr.detectChanges();
    } else {
      this.error = 'Modal non initialisé';
      this.cdr.detectChanges();
    }
  }

  confirmSendLink(): void {
    if (!this.patientEmail || !this.consultationLink) {
      this.error = 'Veuillez entrer l\'email du patient';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.emailService.sendConsultationLink(this.patientEmail, this.consultationLink)
      .subscribe({
        next: () => {
          if (this.modal) {
            this.modal.hide();
          }
          this.patientEmail = '';
          this.loading = false;
          alert('Le lien a été envoyé avec succès au patient!');
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          console.error('Erreur lors de l\'envoi du lien:', error);
          this.error = 'Erreur lors de l\'envoi du lien';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
