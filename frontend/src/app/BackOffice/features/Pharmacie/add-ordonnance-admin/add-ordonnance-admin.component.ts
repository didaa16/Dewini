import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdonnanceService } from 'src/app/services/ordonnance/ordonnance.service';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import SignaturePad from 'signature_pad';
import { AuthenticationService } from 'src/app/FrontOffice/features/User/services/services';

@Component({
  selector: 'app-add-ordonnance-admin',
  templateUrl: './add-ordonnance-admin.component.html',
  styleUrls: ['./add-ordonnance-admin.component.css']
})
export class AddOrdonnanceAdminComponent implements OnInit, AfterViewInit {

  ordonnance: Ordonnance = {
    instructions: '',
    medecinId: 0, // Initialisé à 0, sera remplacé par l'ID réel
    patientId: 0,
    prescriptions: []
  };

  listeMedicaments: Medicament[] = [];
  signaturePad!: SignaturePad;
  signatureDataUrl: string = '';

  constructor(
    private ordonnanceService: OrdonnanceService,
    private medicamentService: MedicamentService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du médecin connecté dès l'initialisation
    const medecinId = this.authService.getUserId();

    if (medecinId && this.authService.isMedecin()) {
      this.ordonnance.medecinId = medecinId; // Pré-remplir l'ID médecin
    }

    this.medicamentService.getAll().subscribe(data => {
      this.listeMedicaments = data;
    });
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById('signatureCanvas') as HTMLCanvasElement;
    this.signaturePad = new SignaturePad(canvas);
  }

  addPrescription(): void {
    this.ordonnance.prescriptions.push({
      medicament: {
        id: 0,
        nom: '',
        description: '',
        quantiteEnStock: 0,
        prix: 0,
        dateExpiration: new Date().toISOString()
      },
      posologie: '',
      duree: ''
    });
  }

  removePrescription(index: number): void {
    this.ordonnance.prescriptions.splice(index, 1);
  }

  submit(): void {
    // Vérification finale du rôle
    if (!this.authService.isMedecin()) {
      alert('❌ Seuls les médecins peuvent créer des ordonnances');
      return;
    }

    // On utilise directement this.ordonnance.medecinId déjà rempli
    const payload = {
      ...this.ordonnance,
      signature: this.signatureDataUrl,
      prescriptions: this.ordonnance.prescriptions.map(p => ({
        medicament: { id: p.medicament.id },
        posologie: p.posologie,
        duree: p.duree
      }))
    };

    this.ordonnanceService.add(payload, this.ordonnance.medecinId).subscribe({
      next: () => {
        alert('✅ Ordonnance enregistrée avec succès');
        this.resetForm();
      },
      error: err => {
        console.error('Erreur:', err);
        alert(`❌ Échec de l'enregistrement: ${err.error?.message || ''}`);
      }
    });
  }

  private resetForm(): void {
    // On conserve le medecinId lors de la réinitialisation
    this.ordonnance = {
      instructions: '',
      medecinId: this.ordonnance.medecinId, // Garde l'ID médecin
      patientId: 0,
      prescriptions: []
    };
    this.signatureDataUrl = '';
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  effacerSignature(): void {
    this.signaturePad.clear();
    this.signatureDataUrl = '';
  }

  sauvegarderSignature(): void {
    if (this.signaturePad.isEmpty()) {
      alert('✋ Veuillez dessiner une signature.');
      return;
    }
    this.signatureDataUrl = this.signaturePad.toDataURL();
    alert('✅ Signature enregistrée !');
  }
}