import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rendezvous } from 'src/app/models/ModelsRendezvous/Rendezvous';
import { RendezvousService } from 'src/app/services/Rendezvous/rendezvous.service';
import { AuthenticationService } from '../../User/services/services';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent implements OnInit {
  rendezvousForm: FormGroup;
  isEditMode = false;
  currentRendezvousId?: number;
  suggestions: string[] = [];
  showSuggestions = false;
  showPopup = false;
  currentUserId: number | null = null;
  todayDate = new Date();

  constructor(
    private fb: FormBuilder,
    private rendezvousService: RendezvousService,
    private authService: AuthenticationService, // Utilisation du bon service
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rendezvousForm = this.fb.group({
      nomPatient: ['', Validators.required],
      dateNaissance: ['', [Validators.required, this.ageValidator]],
      dateRendezvous: ['', [Validators.required, this.futureDateValidator]],
      heureRendezvous: ['', Validators.required],
      sexePatient: ['HOMME', Validators.required],
      emailPatient: ['', [Validators.required, Validators.email]],
      medicalState: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    if (!this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }
  
    // Récupération des données passées via le state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      rendezvousData: Rendezvous;
      userId: number;
    };
  
    if (state) {
      this.currentUserId = state.userId;
      this.patchFormValues(state.rendezvousData);
      this.isEditMode = true;
      this.currentRendezvousId = state.rendezvousData.idRendezvous;
    } else {
      // Fallback: chargement via l'API si pas de state
      this.loadRendezvousIfNeeded();
    }
  }
  private loadRendezvousIfNeeded(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.currentRendezvousId = +id;
      this.loadRendezvousFromApi(+id);
    }
  }

  private loadRendezvousFromApi(id: number): void {
    this.rendezvousService.getRendezvousById(id).subscribe({
      next: (rendezvous) => this.patchFormValues(rendezvous),
      error: () => this.router.navigate(['/list-rendezvous'])
    });
  }

  private patchFormValues(rendezvous: Rendezvous): void {
    // Convertit les dates au format attendu par le formulaire
    const formattedDateNaissance = rendezvous.dateNaissance ? 
      new Date(rendezvous.dateNaissance).toISOString().split('T')[0] : '';
    
    const formattedDateRendezvous = rendezvous.dateRendezvous ? 
      new Date(rendezvous.dateRendezvous).toISOString().split('T')[0] : '';
  
    this.rendezvousForm.patchValue({
      nomPatient: rendezvous.nomPatient,
      dateNaissance: formattedDateNaissance,
      dateRendezvous: formattedDateRendezvous,
      heureRendezvous: rendezvous.heureRendezvous,
      sexePatient: rendezvous.sexePatient,
      emailPatient: rendezvous.emailPatient,
      medicalState: rendezvous.medicalState  
    });
  }

  onSubmit(): void {
    if (this.rendezvousForm.invalid || !this.currentUserId) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.rendezvousForm.value;
    const rdvDate = new Date(formData.dateRendezvous);

    this.rendezvousService.checkAvailability(rdvDate, formData.heureRendezvous).subscribe({
      next: (available) => available ? this.saveRendezvous() : this.handleUnavailableSlot(rdvDate, formData.heureRendezvous),
      error: () => alert('Erreur lors de la vérification de disponibilité')
    });
  }

  private saveRendezvous(): void {
    if (this.rendezvousForm.invalid || !this.currentUserId) {
      this.markAllAsTouched();
      return;
    }
  
    const formData = this.rendezvousForm.value;
    const rdvDate = new Date(formData.dateRendezvous);
  
    // Vérification de disponibilité seulement en mode création
    if (!this.isEditMode) {
      this.rendezvousService.checkAvailability(rdvDate, formData.heureRendezvous).subscribe({
        next: (available) => available ? this.processSave() : this.handleUnavailableSlot(rdvDate, formData.heureRendezvous),
        error: () => alert('Erreur lors de la vérification de disponibilité')
      });
    } else {
      this.processSave();
    }
  }
  
  private processSave(): void {
    if (!this.currentUserId) return;
  
    const formValue = this.rendezvousForm.value;
    const rendezvousData: Rendezvous = {
      idRendezvous: this.currentRendezvousId,
      nomPatient: formValue.nomPatient,
      dateNaissance: new Date(formValue.dateNaissance).toISOString(),
      dateRendezvous: new Date(formValue.dateRendezvous).toISOString(),
      heureRendezvous: formValue.heureRendezvous,
      emailPatient: formValue.emailPatient,
      medicalState: formValue.medicalState,
      sexePatient: formValue.sexePatient
    };
  
    const operation: Observable<Rendezvous> = this.isEditMode && this.currentRendezvousId
      ? this.rendezvousService.updateRendezvous(
          this.currentRendezvousId, 
          this.currentUserId, 
          rendezvousData
        ).pipe(
          tap((response: Rendezvous) => {
            console.log('Réponse complète du serveur:', response);
            if (response?.idRendezvous) {
              this.handleSaveSuccess(response);
            } else {
              throw new Error('Réponse invalide du serveur');
            }
          })
        )
      : this.rendezvousService.createRendezvous(rendezvousData, this.currentUserId);
  
    operation.subscribe({
      next: (savedRdv: Rendezvous) => {
        console.log('Rendez-vous sauvegardé:', savedRdv);
        this.handleSaveSuccess(savedRdv);
      },
      error: (err: any) => {
        console.error('Erreur complète:', err);
        alert(`Erreur lors de ${this.isEditMode ? 'la mise à jour' : 'la création'}`);
      }
    });
  }
  private handleSaveSuccess(savedRdv: Rendezvous): void {
    if (this.isEditMode) {
      this.rendezvousService.updateLocalRendezvous(savedRdv);
    } else {
      this.rendezvousService.addLocalRendezvous(savedRdv);
    }
    
    this.showPopup = true;
    setTimeout(() => {
      this.closePopup();
      this.router.navigate(['/list-rendezvous']);
    }, 3000);
  }  

  closePopup(): void {
    this.showPopup = false;
    this.router.navigate(['/list-rendezvous']);
  }

  private handleUnavailableSlot(date: Date, time: string): void {
    this.rendezvousService.getSuggestedSlots(date, time).subscribe({
      next: (suggestions) => {
        this.suggestions = suggestions;
        this.showSuggestions = true;
      },
      error: () => alert('Ce créneau n\'est pas disponible')
    });
  }

  selectSuggestion(suggestion: string): void {
    this.rendezvousForm.patchValue({ heureRendezvous: suggestion });
    this.showSuggestions = false;
  }

  onCancel(): void {
    this.router.navigate(['/list-rendezvous']);
  }

  private markAllAsTouched(): void {
    Object.values(this.rendezvousForm.controls).forEach(control => control.markAsTouched());
  }

  private ageValidator(control: any) {
    const birthDate = new Date(control.value);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
  
    if (m < 0 || (m === 0 && d < 0)) {
      age--;
    }
  
    if (age < 18) {
      return { tooYoung: true };
    }
    return null;
  }

  private futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }
}