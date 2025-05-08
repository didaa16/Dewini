import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdonnanceService } from 'src/app/services/ordonnance/ordonnance.service';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model';
import { Prescription } from 'src/app/models/models_pharma/prescription.model';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import SignaturePad from 'signature_pad';
import { AuthenticationService, UserControllerService } from '../../User/services/services';
import { User } from '../../User/services/models/user';

@Component({
  selector: 'app-add-ordonnance',
  templateUrl: './add-ordonnance.component.html',
  styleUrls: ['./add-ordonnance.component.css']
})
export class AddOrdonnanceComponent implements OnInit {
  ordonnance: Ordonnance = {
    instructions: '',
    medecinId: 0,
    patientId: 0,
    prescriptions: []
  };

  listeMedicaments: Medicament[] = [];
  allUsers: User[] = [];
  signaturePad!: SignaturePad;
  signatureDataUrl: string = '';
  loading = false;
  error = '';

  constructor(
    private ordonnanceService: OrdonnanceService,
    private medicamentService: MedicamentService,
    private authService: AuthenticationService,
    private userService: UserControllerService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadMedicaments();
    this.loadAllUsers();
  }

  loadCurrentUser(): void {
    const medecinId = this.authService.getUserId();
    if (medecinId && this.authService.isMedecin()) {
      this.ordonnance.medecinId = medecinId;
    }
  }

  loadAllUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.allUsers = users;
        console.log('Users loaded:', this.allUsers); // Add this for debugging
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  loadMedicaments(): void {
    this.loading = true;
    this.medicamentService.getAll().subscribe({
      next: (data: Medicament[]) => {
        this.listeMedicaments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des médicaments', err);
        this.error = 'Erreur lors du chargement des médicaments';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById('signatureCanvas') as HTMLCanvasElement;
    this.signaturePad = new SignaturePad(canvas);
  }

  getMedecinName(): string {
    if (!this.ordonnance.medecinId) return 'Non spécifié';
    const medecin = this.allUsers.find(u => u.id === this.ordonnance.medecinId);
    return medecin ? `${medecin.firstname} ${medecin.lastname}` : `Médecin ID: ${this.ordonnance.medecinId}`;
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
    if (!this.authService.isMedecin()) {
      this.error = 'Seuls les médecins peuvent créer des ordonnances';
      return;
    }

    if (!this.signatureDataUrl) {
      this.error = 'Veuillez enregistrer votre signature';
      return;
    }

    this.loading = true;
    const payload: Ordonnance = {
      ...this.ordonnance,
      signature: this.signatureDataUrl,
      prescriptions: this.ordonnance.prescriptions.map(p => ({
        medicament: { id: p.medicament.id },
        posologie: p.posologie,
        duree: p.duree,
        medecinId: this.authService.getCurrentUser(),
      }))
    };

    // Send the patient ID from the form, medecinId will be set by service
    this.ordonnanceService.add(payload, this.ordonnance.patientId).subscribe({
      next: () => {
        alert('✅ Ordonnance enregistrée avec succès');
        this.resetForm();
        this.loading = false;
      },
      error: err => {
        console.error('Erreur:', err);
        this.error = `Échec de l'enregistrement: ${err.error?.message || ''}`;
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.ordonnance = {
      instructions: '',
      medecinId: this.authService.getUserId() || 0, // Reset medecinId to the current user if available
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
      this.error = 'Veuillez dessiner une signature';
      return;
    }
    this.signatureDataUrl = this.signaturePad.toDataURL();
    this.error = '';
  }
}
