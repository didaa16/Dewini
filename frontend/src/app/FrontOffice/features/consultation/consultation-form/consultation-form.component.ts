import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from "../../User/services/services/consultation.service";
import { DossierMedicaleService } from "../../User/services/services/dossier-medicale.service";
import { Consultation } from '../../../../models/consultation.model';
import { DossierMedicale } from '../../../../models/dossier-medicale.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { User } from '../../User/services/models';
import { AuthenticationService } from '../../User/services/services';
import { UserControllerService } from '../../User/services/services/user-controller.service';

@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.css'],
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
export class ConsultationFormComponent implements OnInit {
  consultationForm: FormGroup;
  isEditMode = false;
  loading = false;
  loadingMedecin = false;
  error = '';
  patients: User[] = [];
  dossiers: DossierMedicale[] = [];
  currentUser: User | null = null;
  isMedecin = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private dossierService: DossierMedicaleService,
    private authService: AuthenticationService,
    private userService: UserControllerService,
    private cdr: ChangeDetectorRef
  ) {
    this.consultationForm = this.fb.group({
      patient_id: ['', [Validators.required]],
      medecin_id: [{ value: '', disabled: true }],
      medecin_name: [{ value: '', disabled: true }],
      dossierMedical_id: ['', [Validators.required]],
      date: ['', [Validators.required]],
      heure: ['', [Validators.required]],
      rapport: ['', [Validators.required, Validators.maxLength(500)]],
      recommandations: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPatients();
    this.loadDossiers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadConsultation(+id);
    }
  }

  loadCurrentUser(): void {
    this.loading = true;
    this.loadingMedecin = true;
    
    // 1. D'abord essayer de récupérer depuis le service
    const connectedUser = this.userService.getConnectedUser();
    if (connectedUser) {
      this.setMedecinInfo(connectedUser);
      this.loading = false;
      this.loadingMedecin = false;
      return;
    }

    // 2. Si pas dans le service, charger depuis l'API
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById({ id: userId }).subscribe({
        next: (user: User) => {
          this.setMedecinInfo(user);
          this.loading = false;
          this.loadingMedecin = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du médecin:', err);
          this.loading = false;
          this.loadingMedecin = false;
        }
      });
    } else {
      this.loading = false;
      this.loadingMedecin = false;
    }
  }

  private setMedecinInfo(user: User): void {
    this.currentUser = user;
    this.isMedecin = this.authService.isMedecin();

    if (!this.isMedecin) {
      this.error = 'Seuls les médecins peuvent créer des consultations';
      this.router.navigate(['/unauthorized']);
      return;
    }

    this.consultationForm.patchValue({
      medecin_id: user.id,
      medecin_name: `${user.firstname} ${user.lastname}`
    });

    console.log('Informations médecin chargées:', {
      id: user.id,
      name: `${user.firstname} ${user.lastname}`
    });
  }
  loadPatients(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
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
      error: (error: any) => {
        console.error('Erreur lors du chargement des patients:', error);
        this.error = 'Erreur lors du chargement des patients';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  loadDossiers(): void {
    this.dossierService.getAllDossiers().subscribe({
      next: (dossiers: DossierMedicale[]) => {
        this.dossiers = dossiers;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des dossiers médicaux:', error);
        this.error = 'Erreur lors du chargement des dossiers médicaux';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  onPatientSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const patientId = selectElement.value ? +selectElement.value : undefined;
    
    if (!patientId) return;
    
    // Filtrer les dossiers pour ce patient
    this.loadDossiersForPatient(patientId);
  }
  loadDossiersForPatient(patientId?: number): void {
    if (!patientId) {
      this.dossiers = [];
      return;
    }
  
    this.loading = true;
    this.dossierService.getAllDossiers().subscribe({
      next: (dossiers: DossierMedicale[]) => {
        // Filtrer les dossiers pour le patient sélectionné
        this.dossiers = dossiers.filter(d => d.patient?.id === patientId);
        this.loading = false;
        this.cdr.detectChanges();
        
        // Si un seul dossier existe, le sélectionner automatiquement
        if (this.dossiers.length === 1) {
          this.consultationForm.patchValue({
            dossierMedical_id: this.dossiers[0].id_dossier
          });
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des dossiers médicaux:', error);
        this.error = 'Erreur lors du chargement des dossiers médicaux';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  loadConsultation(id: number): void {
    this.loading = true;
    this.consultationService.getConsultationById(id).subscribe({
      next: (consultation: Consultation) => {
        this.consultationForm.patchValue({
          patient_id: consultation.patient?.id,
          dossierMedical_id: consultation.dossierMedical?.id_dossier,
          date: this.formatDate(consultation.date),
          heure: this.formatTime(consultation.heure),
          rapport: consultation.rapport,
          recommandations: consultation.recommandations
        });
  
        // Charger les dossiers pour ce patient
        if (consultation.patient?.id) {
          this.loadDossiersForPatient(consultation.patient.id);
        } else {
          this.loading = false;
        }
        
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement de la consultation:', error);
        this.error = 'Erreur lors du chargement de la consultation';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  onSubmit(): void {
    this.markFormGroupTouched(this.consultationForm);
  
    if (this.consultationForm.valid && this.currentUser && this.isMedecin) {
      this.loading = true;
      this.error = '';
      const formValue = this.consultationForm.getRawValue();
  
      const consultationData: any = {
        date: formValue.date,
        heure: formValue.heure,
        rapport: formValue.rapport || '',
        recommandations: formValue.recommandations || '',
        patient_id: formValue.patient_id,   // ID du patient sélectionné
        dossierMedical_id: formValue.dossierMedical_id
      };
  
      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          consultationData.id_consultation = +id;
          // Ajouter les informations du médecin pour la mise à jour
          consultationData.medecin = { id: this.currentUser.id };
          this.consultationService.updateConsultation(consultationData)
            .subscribe({
              next: () => {
                this.router.navigate(['/consultations']);
                this.loading = false;
                this.cdr.detectChanges();
              },
              error: (error: any) => {
                console.error('Erreur lors de la mise à jour:', error);
                this.error = 'Erreur lors de la mise à jour de la consultation';
                this.loading = false;
                this.cdr.detectChanges();
              }
            });
        }
      } else {
        this.consultationService.createConsultation(consultationData, this.currentUser.id!)
          .subscribe({
            next: () => {
              this.router.navigate(['/consultations']);
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (error: any) => {
              console.error('Erreur lors de la création:', error);
              this.error = 'Erreur lors de la création de la consultation';
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
      }
    }
  }
  private handleSubmitResponse = {
    next: () => {
      this.router.navigate(['/consultations']);
      this.loading = false;
      this.cdr.detectChanges();
    }
  };

  onCancel(): void {
    this.router.navigate(['/consultations']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.consultationForm.get(fieldName);
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

  private formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private formatTime(time: string | Date): string {
    if (!time) return '';
    const d = new Date(time);
    return d.toTimeString().slice(0, 5);
  }
}