import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UrgenceService } from '../../User/services/services/urgence.service';
import { TypeUrgence, StatutUrgence, Urgence } from '../../../../models/urgence';
import { User } from "../../User/services/models/user";
import { NotificationService } from "../../../../notification.service";
import { GeocodingService } from "../../User/services/services/geocoding.service";
import { animate, style, transition, trigger } from '@angular/animations';
import {AuthenticationService, UserControllerService} from "../../User/services/services";

@Component({
  selector: 'app-create-urgence',
  templateUrl: './create-urgence.component.html',
  styleUrls: ['./create-urgence.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-30px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class CreateUrgenceComponent implements OnInit {
  urgenceForm!: FormGroup;
  idUrgence!: number;
  urgence!: Urgence;
  typeUrgenceOptions = Object.values(TypeUrgence);
  statutUrgenceOptions = Object.values(StatutUrgence);
  isLoading = false;
  predictedSpecialty: string | null = null;
  isCorrectingDescription = false;

  constructor(
    private us: UrgenceService,
    private rt: Router,
    private act: ActivatedRoute,
    private notificationService: NotificationService,
    private geocodingService: GeocodingService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.urgenceForm = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      addressePatient: new FormControl(''),
      typeUrgence: new FormControl('', [Validators.required]),
      statutUrgence: new FormControl(StatutUrgence.En_Attente),
    });

    this.idUrgence = this.act.snapshot.params['idUrgence'];
    if (this.idUrgence) {
      this.us.getUrgenceById(this.idUrgence).subscribe({
        next: (data) => {
          this.urgence = data;
          this.urgenceForm.patchValue(this.urgence);
          this.predictedSpecialty = data.specialite;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des données :', error);
          this.notificationService.showError('Erreur lors de la récupération des données.');
        },
      });
    }

    this.urgenceForm.get('typeUrgence')?.valueChanges.subscribe(() => {
      if (!this.isAddressVisible()) {
        this.urgenceForm.get('addressePatient')?.reset();
      }
    });

    // Monitor description changes for real-time validation
    this.urgenceForm.get('description')?.valueChanges.subscribe((value) => {
      if (value && !this.isCorrectingDescription) {
        this.validateAndCorrectDescription(value, false);
      }
    });
  }

  /**
   * Validates and corrects the description, prompting the user if corrections are needed.
   * @param description The input description
   * @param forcePrompt Whether to force a correction prompt (e.g., on submit)
   */
  validateAndCorrectDescription(description: string, forcePrompt: boolean): void {
    if (!description) return;

    const correction = this.correctDescription(description);
    if (correction.correctedText !== description) {
      if (forcePrompt || !this.isCorrectingDescription) {
        this.isCorrectingDescription = true;
        const confirmCorrection = confirm(
          `Voulez-vous corriger "${description}" en "${correction.correctedText}" ?`
        );
        if (confirmCorrection) {
          this.urgenceForm.patchValue({ description: correction.correctedText });
          this.notificationService.showSuccess('Description corrigée avec succès.');
        } else {
          this.notificationService.showWarning('Correction annulée. La description originale sera utilisée.');
        }
        this.isCorrectingDescription = false;
      }
    } else if (description.length < 20) {
      // Warn if description is too short/vague
      this.notificationService.showWarning('La description est courte. Veuillez fournir plus de détails pour une prédiction précise.');
    }
  }

  /**
   * Corrects common misspellings in the description.
   * @param description The input description
   * @returns Object with corrected text and correction flag
   */
  correctDescription(description: string): { correctedText: string; wasCorrected: boolean } {
    let correctedText = description;
    let wasCorrected = false;

    // Correct "paralysme" to "paralysie"
    if (correctedText.toLowerCase().includes('paralysme')) {
      correctedText = correctedText.replace(/paralysme/gi, 'paralysie');
      wasCorrected = true;
    }

    // Add more corrections as needed
    // Example: Correct "douleur thorasique" to "douleur thoracique"
    if (correctedText.toLowerCase().includes('thorasique')) {
      correctedText = correctedText.replace(/thorasique/gi, 'thoracique');
      wasCorrected = true;
    }

    return { correctedText, wasCorrected };
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.geocodingService.getAddressFromCoordinates(lat, lon).subscribe(
            (address: string) => {
              this.urgenceForm.patchValue({
                addressePatient: address,
              });
              this.notificationService.showSuccess('Adresse récupérée avec succès.');
            },
            (error) => {
              console.error('Erreur lors de la géocodification inversée :', error);
              this.notificationService.showError('Impossible d’obtenir l’adresse exacte.');
            }
          );
        },
        (error) => {
          console.error('Erreur géolocalisation :', error);
          this.notificationService.showError('Échec de la géolocalisation.');
        }
      );
    } else {
      this.notificationService.showWarning('La géolocalisation n’est pas prise en charge.');
    }
  }

  save(): void {
    if (this.urgenceForm.invalid) {
      this.notificationService.showWarning('Veuillez remplir tous les champs requis.');
      return;
    }

    // Get current user ID
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      this.notificationService.showError('Vous devez être connecté pour créer une urgence.');
      this.rt.navigate(['/login']);
      return;
    }

    // Validate and correct description before submission
    const description = this.urgenceForm.get('description')?.value;
    this.validateAndCorrectDescription(description, true);

    if (this.urgenceForm.invalid) {
      this.notificationService.showWarning('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    this.isLoading = true;

    if (this.idUrgence) {
      // Update existing emergency
      const urgenceData: Partial<Urgence> = {
        description: this.urgenceForm.value.description,
        addressePatient: this.urgenceForm.value.addressePatient,
        typeUrgence: this.urgenceForm.value.typeUrgence,
      };

      this.us.updateUrgence(urgenceData, this.idUrgence).subscribe({
        next: (data) => {
          this.predictedSpecialty = data.specialite;
          this.notificationService.showSuccess('Urgence mise à jour avec succès !');
          this.isLoading = false;
          this.navigateToUrgenceList();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour :', error);
          this.notificationService.showError('Une erreur est survenue lors de la mise à jour.');
          this.isLoading = false;
        },
      });
    } else {
      // Create new emergency
      const newUrgence: Urgence = {
        ...this.urgenceForm.value,
        patient: { id: currentUserId }, // Assign the current user's ID
        date: new Date(),
        statutUrgence: StatutUrgence.En_Attente,
      };

      this.us.addUrgence(newUrgence).subscribe({
        next: (data) => {
          this.predictedSpecialty = data.specialite;
          this.notificationService.showSuccess('Urgence ajoutée avec succès !');
          this.isLoading = false;
          this.navigateToUrgenceList();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout :', error);
          this.notificationService.showError('Une erreur est survenue lors de l\'ajout.');
          this.isLoading = false;
        },
      });
    }
  }

  navigateToUrgenceList(): void {
    this.rt.navigateByUrl('/listUrgences');
  }

  isAddressVisible(): boolean {
    return this.urgenceForm.get('typeUrgence')?.value === TypeUrgence.A_Domicile;
  }
}
