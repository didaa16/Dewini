import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [DatePipe]
})
export class RegisterComponent {
  signUpForm: FormGroup;
  passwordFieldType: string = 'password';
  isPasswordVisible: boolean = false;
  eyeIcon: string = 'bi-eye-slash';
  profilePicture?: File;
  imagePreviewUrl?: string | ArrayBuffer | null = null;
  errorMessages: string[] = [];
  successMessage: string | null = null;
  isLoading: boolean = false;
  minDate: Date;
  maxDate: Date;
  showProfessionalFields: boolean = false;

  // Liste des spécialités médicales
  medicalSpecialties: string[] = [
    'Allergy and Immunology',
    'Anesthesiology',
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'General Surgery',
    'Geriatrics',
    'Hematology',
    'Infectious Disease',
    'Internal Medicine',
    'Nephrology',
    'Neurology',
    'Neurosurgery',
    'Obstetrics and Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedic Surgery',
    'Otolaryngology',
    'Pathology',
    'Pediatrics',
    'Physical Medicine and Rehabilitation',
    'Plastic Surgery',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Rheumatology',
    'Urology',
    'Cardiothoracic Surgery',
    'Colorectal Surgery',
    'Dentistry',
    'Diabetology',
    'General Practice',
    'Hepatology',
    'Immunology',
    'Maxillofacial Surgery',
    'Medical Genetics',
    'Neonatology',
    'Nuclear Medicine',
    'Pain Medicine',
    'Palliative Care',
    'Preventive Medicine',
    'Sports Medicine',
    'Toxicology',
    'Vascular Surgery'
  ];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private notify: NotificationService,
    private datePipe: DatePipe
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 18, 11, 31);

    this.signUpForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      profilePicture: [null], // Optional
      specialite: [''],
      anneesExperience: [''],
      isMedecin: [false]
    });
  }

  toggleProfessionalFields(): void {
    this.showProfessionalFields = !this.showProfessionalFields;
    this.signUpForm.patchValue({
      isMedecin: this.showProfessionalFields
    });

    const specialiteControl = this.signUpForm.get('specialite');
    const anneesControl = this.signUpForm.get('anneesExperience');

    if (this.showProfessionalFields) {
      specialiteControl?.setValidators([Validators.required]);
      anneesControl?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      specialiteControl?.clearValidators();
      anneesControl?.clearValidators();
    }

    specialiteControl?.updateValueAndValidity();
    anneesControl?.updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    this.errorMessages = [];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
      this.signUpForm.patchValue({ profilePicture: this.profilePicture });
      this.signUpForm.get('profilePicture')?.updateValueAndValidity();

      if (this.profilePicture.size > 5 * 1024 * 1024) {
        this.errorMessages.push('Image size must not exceed 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(this.profilePicture.type)) {
        this.errorMessages.push('Only JPEG, PNG, and GIF formats are accepted');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.profilePicture);
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.eyeIcon = this.isPasswordVisible ? 'bi-eye' : 'bi-eye-slash';
    this.passwordFieldType = this.isPasswordVisible ? 'text' : 'password';
  }

  register(): void {
    this.errorMessages = [];
    this.successMessage = null;
  
    // 1. Validation initiale du formulaire
    if (this.signUpForm.invalid) {
      this.markFormGroupTouched(this.signUpForm);
      this.notify.showError(
        'Veuillez remplir correctement tous les champs obligatoires', 
        'Formulaire incomplet'
      );
      return;
    }
  
    // 2. Validation spécifique pour les médecins
    if (this.showProfessionalFields) {
      if (!this.signUpForm.value.specialite) {
        this.notify.showError('La spécialité médicale est obligatoire', 'Champ manquant');
        return;
      }
      if (!this.signUpForm.value.anneesExperience || this.signUpForm.value.anneesExperience < 0) {
        this.notify.showError('Veuillez entrer un nombre valide d\'années d\'expérience', 'Donnée invalide');
        return;
      }
    }
  
    this.isLoading = true;
    const formValue = this.signUpForm.value;
  
    // 3. Préparation des données
    const registrationData = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      gender: formValue.gender,
      dateOfBirth: this.datePipe.transform(formValue.dateOfBirth, 'yyyy-MM-dd'),
      address: formValue.address,
      password: formValue.password,
      profilePicUrl: '',
      isMedecin: formValue.isMedecin,
      specialite: formValue.isMedecin ? formValue.specialite : null,
      anneesExperience: formValue.isMedecin ? parseInt(formValue.anneesExperience, 10) : null
    };
  
    // 4. Création du FormData
    const formData = new FormData();
    formData.append('userData', new Blob([JSON.stringify(registrationData)], { type: 'application/json' }));
    
    if (this.profilePicture) {
      if (this.profilePicture.size > 5 * 1024 * 1024) {
        this.notify.showError('La taille de l\'image ne doit pas dépasser 5MB', 'Fichier trop volumineux');
        this.isLoading = false;
        return;
      }
      formData.append('file', this.profilePicture);
    }
  
    // 5. Appel au service d'authentification
    this.authService.register(formData).subscribe({
      next: () => {
        this.isLoading = false;
        
        // Notification de succès
        this.notify.showSuccess(
          'Inscription réussie! Veuillez vérifier votre email pour activer votre compte.','Succès');
        
        // Redirection après délai
        setTimeout(() => {
          this.router.navigate(['/login'], {
            state: { registrationSuccess: true }
          });
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'inscription:', error);
  
        // 6. Gestion des erreurs détaillée
        let errorMessage = 'success verify your email to activate your account';
        
        if (error.error) {
          // Erreurs de validation du serveur
          if (Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors.join('\n');
          } 
          // Message d'erreur spécifique
          else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }
  
        // Notification d'erreur principale
        this.notify.showSuccess(errorMessage, 'Success');
  
        // Notification supplémentaire pour les emails existants
        if (error.status === 409) {
          this.notify.showWarning(
            'Cet email est déjà enregistré. Veuillez vous connecter ou utiliser un autre email.','Email existant');
        }
      }
    });
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}