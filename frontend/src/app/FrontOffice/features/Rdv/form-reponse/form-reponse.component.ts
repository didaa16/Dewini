import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reponse, StatutReponse } from 'src/app/models/ModelsRendezvous/Reponse';
import { RendezvousService } from 'src/app/services/Rendezvous/rendezvous.service';
import { ReponseService } from 'src/app/services/Reponse/reponse.service';

@Component({
  selector: 'app-form-reponse',
  templateUrl: './form-reponse.component.html',
  styleUrls: ['./form-reponse.component.css']
})
export class FormReponseComponent {
  reponseForm: FormGroup;
  rendezvousId!: number;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reponseService: ReponseService,
    private rendezvousService: RendezvousService,
    private route: ActivatedRoute,
    public router: Router

  ) {
    this.reponseForm = this.fb.group({
      contenu: ['', [Validators.required, Validators.minLength(10)]],
      statut: ['ACCEPTED', Validators.required]
    });

    // Adaptation des validations selon le statut
    this.reponseForm.get('statut')?.valueChanges.subscribe(val => {
      const contenuControl = this.reponseForm.get('contenu');
      if (val === 'REFUSED') {
        contenuControl?.setValidators([Validators.required, Validators.minLength(20)]);
      } else {
        contenuControl?.setValidators([Validators.required, Validators.minLength(10)]);
      }
      contenuControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.rendezvousId = +params['id'];
    });
  }

  submitForm(): void {
    if (this.reponseForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const reponse: Reponse = {
      ...this.reponseForm.value,
      rendezvous: { idRendezvous: this.rendezvousId } as any
    };

    this.reponseService.createReponseWithSms(reponse).subscribe({
      next: () => {
        this.successMessage = 'Réponse enregistrée et SMS envoyé avec succès';
        setTimeout(() => {
          this.router.navigate(['/dashboard/liste-reponses']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi de la réponse';
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.reponseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get contenu() {
    return this.reponseForm.get('contenu');
  }

  get statut() {
    return this.reponseForm.get('statut');
  }
}