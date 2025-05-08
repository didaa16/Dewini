import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierMedicale } from '../../../../models/dossier-medicale.model';
import { DossierMedicaleService } from "../../User/services/services/dossier-medicale.service";
import { UserControllerService } from "../../User/services/services/user-controller.service";
import { User } from "../../User/services/models/user";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dossier-medicale-form',
  templateUrl: './dossier-medicale-form.component.html',
  styleUrls: ['./dossier-medicale-form.component.css'],
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
export class DossierMedicaleFormComponent implements OnInit {
  dossierForm: FormGroup;
  patients: User[] = [];
  isEditMode = false;
  currentDossier: DossierMedicale | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dossierService: DossierMedicaleService,
    private userService: UserControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.dossierForm = this.fb.group({
      patient_id: ['', [Validators.required]],
      antecedentsMedicaux: ['', [Validators.required, Validators.maxLength(1000)]],
      allergies: ['', [Validators.required, Validators.maxLength(1000)]],
      traitementsEnCours: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadPatients();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadDossier(+id);
    }
    this.cdr.detectChanges();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filtrer les patients (exclure les médecins)
        this.patients = users.filter(user => {
          const hasMedecinRole = user.roles?.some(role => {
            if (typeof role === 'string') {
              return role === 'ROLE_MEDECIN' || role === 'MEDECIN';
            } else {
              return role.name === 'ROLE_MEDECIN' || role.name === 'MEDECIN';
            }
          });
          return !hasMedecinRole;
        }).sort((a, b) => {
          const nameA = a.lastname || '';
          const nameB = b.lastname || '';
          return nameA.localeCompare(nameB);
        });
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des patients:', error);
        this.error = error.message || 'Erreur lors du chargement des patients';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadDossier(id: number): void {
    this.loading = true;
    this.dossierService.getDossier(id).subscribe({
      next: (dossier) => {
        this.currentDossier = dossier;
        this.dossierForm.patchValue({
          patient_id: dossier.patient.id,
          antecedentsMedicaux: dossier.antecedentsMedicaux || '',
          allergies: dossier.allergies || '',
          traitementsEnCours: dossier.traitementsEnCours || ''
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du dossier:', error);
        this.error = 'Erreur lors du chargement du dossier.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.dossierForm);

    if (this.dossierForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;
      const formValue = this.dossierForm.value;

      const patientId = typeof formValue.patient_id === 'string' ? parseInt(formValue.patient_id, 10) : formValue.patient_id;
      const patient = this.patients.find(p => p.id === patientId);

      if (!patient) {
        this.error = 'Patient non trouvé.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      const dossierData: any = {
        patient: {
          id: patient.id
        },
        dateCreation: new Date().toISOString().split('T')[0],
        antecedentsMedicaux: formValue.antecedentsMedicaux || '',
        allergies: formValue.allergies || '',
        traitementsEnCours: formValue.traitementsEnCours || ''
      };

      if (this.isEditMode && this.currentDossier) {
        dossierData.id_dossier = this.currentDossier.id_dossier;
      }

      if (this.isEditMode && this.currentDossier) {
        this.updateDossier(dossierData as DossierMedicale);
      } else {
        this.createDossier(dossierData as DossierMedicale);
      }
    }
  }

  private createDossier(dossier: any): void {
    this.dossierService.createDossier(dossier).subscribe({
      next: (response) => {
        this.successMessage = 'Dossier créé avec succès';
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dossiers']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du dossier:', error);
        this.error = error.error?.message || 'Erreur lors de la création du dossier';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private updateDossier(dossier: any): void {
    this.dossierService.updateDossier(dossier).subscribe({
      next: (response) => {
        this.successMessage = 'Dossier mis à jour avec succès';
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dossiers']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du dossier:', error);
        this.error = error.error?.message || 'Erreur lors de la mise à jour du dossier';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dossierForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dossiers']);
  }
}