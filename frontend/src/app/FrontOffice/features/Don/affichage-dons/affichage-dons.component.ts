import { Component, OnInit } from '@angular/core';
import { DonService } from "../../User/services/services/don-service.service";
import { Don } from 'src/app/models/don.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import {AuthenticationService} from "../../User/services/services/authentication.service";

@Component({
  selector: 'app-affichage-dons',
  templateUrl: './affichage-dons.component.html',
  styleUrls: ['./affichage-dons.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      transition('* => *', [
        style({ transform: 'scale(1)' }),
        animate('300ms ease-out', style({ transform: 'scale(1.05)' })),
        animate('300ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AffichageDonsComponent implements OnInit {
  dons: Don[] = [];
  filteredDons: Don[] = [];
  loading = true;
  error: string | null = null;
  participatingDonId: number | null = null;
  searchTerm: string = '';

  constructor(
    private donService: DonService,
    private toastr: ToastrService,
    private authService : AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.loadDons();
  }

  loadDons(): void {
    this.loading = true;
    this.error = null;

    const userId = this.authService.getCurrentUserId(); // Temporaire en attendant l'intégration avec l'auth

    this.donService.getDonByAdress(userId).subscribe({
      next: (data) => {
        this.dons = data;
        this.filteredDons = [...this.dons];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des dons';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterDons(): void {
    if (!this.searchTerm) {
      this.filteredDons = [...this.dons];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredDons = this.dons.filter(don =>
      don.typeDon.toLowerCase().includes(searchTermLower)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDons = [...this.dons];
  }

  showQRCode(qrData: string): void {
    const modalContent = `
      <div class="text-center">
        <h4 class="mb-3">Votre QR Code de participation</h4>
        <img src="${qrData}" class="img-fluid mb-3" alt="QR Code">
        <p>Présentez ce code au centre pour confirmer votre participation</p>
        <button class="btn btn-primary" onclick="window.print()">
          <i class="bi bi-printer-fill"></i> Imprimer
        </button>
      </div>
    `;

    Swal.fire({
      html: modalContent,
      confirmButtonText: 'Fermer',
      showCancelButton: false,
      customClass: {
        popup: 'qr-code-modal'
      }
    });
  }

  participer(donId: number): void {
    this.participatingDonId = donId;
    const idUser = this.authService.getCurrentUserId();
    this.donService.addDonneurToDon(donId, idUser).subscribe({
      next: (updatedDon) => {
        const index = this.dons.findIndex(d => d.idDon === donId);
        if (index !== -1) {
          this.dons[index] = updatedDon;
          const currentDonation = updatedDon.donneurs.find(
            (d: any) => d.id.utilisateurId === idUser
          );

          if (currentDonation?.qrCode) {
            this.showQRCode(currentDonation.qrCode);
          }
        }
        this.participatingDonId = null;
        this.toastr.success('Merci pour votre participation !', 'Succès', {
          positionClass: 'toast-bottom-right',
          progressBar: true,
          timeOut: 3000
        });
      },
      error: (err) => {
        this.error = 'Erreur lors de la participation';
        this.participatingDonId = null;
        console.error(err);
        this.toastr.error('Une erreur est survenue', 'Erreur', {
          positionClass: 'toast-bottom-right',
          progressBar: true
        });
      }
    });
  }
}
