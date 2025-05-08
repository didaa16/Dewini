import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Evenement } from '../../../../models/evenement';
import { InscriptionService } from '../../../../services/inscription.service';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from "../../User/services/services/authentication.service";
//import { TypeEngagement } from 'src/app/models/participant';

@Component({
  selector: 'app-inscription-form',
  templateUrl: './inscription-form.component.html'
})
export class InscriptionFormComponent implements OnInit {
  @Input() evenement!: Evenement;
  @Output() inscriptionTerminee = new EventEmitter<string>();

  form: FormGroup;
  roles = ['PARTICIPANT', 'INTERVENANT'];
  types = ['INVITE', 'PAYER'];
  typeEngagement = ['FORMEL','INFORMEL','SPONSOR'];
  loading = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private inscriptionService: InscriptionService, private router: Router, private authService: AuthenticationService) {
    this.form = this.fb.group({
      role: ['PARTICIPANT', Validators.required],
      type: ['INVITE', Validators.required],
      typeEngagement: ['FORMEL',Validators.required],
      userId : this.authService.getCurrentUserId(),
    });
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      return;
    }

    this.loading = true;
    const data = {
      ...this.form.value,
      evenementId: this.evenement.id
    };

    this.inscriptionService.inscrire(data).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.requiresPayment && res.paymentUrl) {
          window.location.href = res.paymentUrl; // Redirige vers le paiement
          this.router.navigate(['/events', this.evenement.id]);
        } else {
          this.inscriptionTerminee.emit("Inscription confirmée !");
          this.router.navigate(['/events', this.evenement.id]);
        }
      },
      error: () => {
        this.loading = false;
        this.inscriptionTerminee.emit("Erreur lors de l'inscription.");
      }
    });
  }
}
