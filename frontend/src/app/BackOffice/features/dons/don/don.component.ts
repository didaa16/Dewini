import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DonService } from "../../../../FrontOffice/features/User/services/services/don-service.service";
import { CentreDeDonService } from "../../../../FrontOffice/features/User/services/services/centre-de-don.service";
import { Don, TypeDon, GroupeSanguin } from 'src/app/models/don.model';
import { CentreDeDon } from 'src/app/models/centre-de-don.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.css']
})
export class DonComponent implements OnInit {
  dons: Don[] = [];
  centres: CentreDeDon[] = [];
  donForm: FormGroup;
  isEditing = false;
  selectedDonId?: number;
  isLoading = false;
  errorMessage = '';
  formSubmitted = false;
  today: string;

  typeDonOptions = Object.values(TypeDon);
  groupeSanguinOptions = Object.values(GroupeSanguin);

  constructor(
    private donService: DonService,
    private centreService: CentreDeDonService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Set today's date for min attribute
    this.today = new Date().toISOString().split('T')[0];

    // Custom validator for date
    const restrictPastDates = (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight
      return selectedDate < today ? { pastDate: true } : null;
    };

    this.donForm = this.fb.group({
      centreId: ['', [Validators.required]],
      typeDon: ['', [Validators.required]],
      grpSanguin: ['', [Validators.required]],
      dateDon: ['', [Validators.required, restrictPastDates]],
      quantite: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadDons();
    this.loadCentres();
  }

  loadDons(): void {
    this.isLoading = true;
    this.donService.getAllDons().subscribe({
      next: (data) => {
        this.dons = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement des dons', err);
        this.isLoading = false;
      }
    });
  }

  loadCentres(): void {
    this.isLoading = true;
    this.centreService.getAllCentres().subscribe({
      next: (data) => {
        this.centres = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement des centres', err);
        this.isLoading = false;
      }
    });
  }

  prepareDonData(): any {
    const formValue = this.donForm.value;
    return {
      idDon: this.isEditing ? this.selectedDonId : undefined,
      centre: { idCentre: formValue.centreId },
      typeDon: formValue.typeDon,
      grpSanguin: formValue.grpSanguin,
      dateDon: formValue.dateDon,
      quantite: formValue.quantite,
    };
  }

  addDon(): void {
    this.formSubmitted = true;
    if (this.donForm.invalid) {
      this.toastr.warning('Veuillez remplir correctement tous les champs requis');
      return;
    }

    this.isLoading = true;
    const donData = this.prepareDonData();
    this.donService.addDon(donData).subscribe({
      next: () => {
        this.toastr.success('Don ajouté avec succès');
        this.loadDons();
        this.resetForm();
        this.isLoading = false;
        this.router.navigate(['/dashboard/affichageDons']);
      },
      error: (err) => {
        this.handleError('Erreur lors de l\'ajout du don', err);
        this.isLoading = false;
      }
    });
  }

  editDon(don: Don): void {
    this.isEditing = true;
    this.selectedDonId = don.idDon;
    this.donForm.patchValue({
      centreId: don.centre?.idCentre,
      typeDon: don.typeDon,
      grpSanguin: don.grpSanguin,
      dateDon: this.formatDateForInput(don.dateDon),
      quantite: don.quantite,
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  updateDon(): void {
    this.formSubmitted = true;
    if (this.donForm.invalid) {
      this.toastr.warning('Veuillez remplir correctement tous les champs requis');
      return;
    }

    this.isLoading = true;
    const donData = this.prepareDonData();
    this.donService.updateDon(donData).subscribe({
      next: () => {
        this.toastr.success('Don mis à jour avec succès');
        this.loadDons();
        this.cancelEdit();
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors de la mise à jour du don', err);
        this.isLoading = false;
      }
    });
  }

  deleteDon(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce don?')) {
      this.isLoading = true;
      this.donService.deleteDon(id).subscribe({
        next: () => {
          this.toastr.success('Don supprimé avec succès');
          this.loadDons();
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError('Erreur lors de la suppression du don', err);
          this.isLoading = false;
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedDonId = undefined;
    this.resetForm();
  }

  resetForm(): void {
    this.donForm.reset();
    this.formSubmitted = false;
    this.errorMessage = '';
  }

  private handleError(defaultMessage: string, error: HttpErrorResponse): void {
    console.error(error);

    if (error.error instanceof ErrorEvent) {
      this.errorMessage = 'Une erreur réseau est survenue. Veuillez vérifier votre connexion.';
    } else {
      switch (error.status) {
        case 400:
          if (error.error.message.includes('saturé') || error.error.message.includes('capacité')) {
            this.errorMessage = 'Le centre sélectionné a atteint sa capacité maximale. Veuillez choisir un autre centre ou revenir plus tard.';
          } else {
            this.errorMessage = error.error.message || 'Données invalides. Veuillez vérifier les informations saisies.';
          }
          break;
        case 404:
          this.errorMessage = 'La ressource demandée n\'a pas été trouvée.';
          break;
        case 500:
          const selectedCentreId = this.donForm.value.centreId;
          const selectedCentre = this.centres.find(c => c.idCentre === +selectedCentreId);
          if (selectedCentre) {
            this.errorMessage = `Le centre ${selectedCentre.nom} a atteint sa capacité maximale (${selectedCentre.capaciteActuelle}/${selectedCentre.capaciteMaximale}).`;
          } else {
            this.errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
          }
          break;
        default:
          this.errorMessage = defaultMessage;
      }
    }

    this.toastr.error(this.errorMessage, 'Erreur', {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      progressBar: true,
      closeButton: true,
      enableHtml: true
    });
  }

  get formControls() {
    return this.donForm.controls;
  }
}
