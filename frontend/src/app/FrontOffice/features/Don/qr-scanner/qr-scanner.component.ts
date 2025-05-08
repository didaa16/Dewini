import { Component } from '@angular/core';
import { DonService } from "../../User/services/services/don-service.service";
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent {
  scannerEnabled = true;

  constructor(
    private donService: DonService,
    private http: HttpClient
  ) {}

  async onCodeResult(resultString: string) {
    this.scannerEnabled = false;

    try {
      // Vérifier si c'est une URL de l'application (pour les tests)
      if (resultString.includes('/qr-data/')) {
        this.http.get<any>(resultString).subscribe({
          next: (qrData) => this.showDonDetails(qrData),
          error: () => this.handleInvalidQR()
        });
      }
      // Sinon, essayer de parser comme JSON direct
      else {
        try {
          const qrData = JSON.parse(resultString);
          this.showDonDetails(qrData);
        } catch {
          this.handleInvalidQR();
        }
      }
    } catch (e) {
      this.handleInvalidQR();
    }
  }

  private handleInvalidQR() {
    Swal.fire({
      title: 'QR Code invalide',
      text: 'Le QR code scanné ne correspond pas à un don valide',
      icon: 'error'
    }).then(() => {
      this.scannerEnabled = true;
    });
  }

  showDonDetails(qrData: any) {
    Swal.fire({
      title: `Détails du Don - ${qrData.centreNom}`,
      html: `
        <div class="text-left">
          <p><strong>Type de don:</strong> ${qrData.typeDon}</p>
          <p><strong>Date:</strong> ${qrData.dateDon}</p>
          <p><strong>Centre:</strong> ${qrData.centreNom}</p>
          <p><strong>Adresse:</strong> ${qrData.centreAdresse}</p>
        </div>
      `,
      confirmButtonText: 'Fermer'
    }).then(() => {
      this.scannerEnabled = true;
    });
  }
}
