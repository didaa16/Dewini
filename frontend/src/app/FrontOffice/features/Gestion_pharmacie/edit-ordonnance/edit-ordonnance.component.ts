import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdonnanceService } from 'src/app/services/ordonnance/ordonnance.service';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { Prescription } from 'src/app/models/models_pharma/prescription.model';

@Component({
  selector: 'app-edit-ordonnance',
  templateUrl: './edit-ordonnance.component.html',
  styleUrls: ['./edit-ordonnance.component.css']
})
export class EditOrdonnanceComponent implements OnInit {

  ordonnance: Ordonnance = {
    instructions: '',
    medecinId: 0,
    patientId: 0,
    prescriptions: []
  };

  listeMedicaments: Medicament[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordonnanceService: OrdonnanceService,
    private medicamentService: MedicamentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.ordonnanceService.getById(id).subscribe({
        next: ord => {
          this.ordonnance = ord;
        }
      });
    });

    this.medicamentService.getAll().subscribe({
      next: data => {
        this.listeMedicaments = data;
      },
      error: err => {
        console.error('Erreur lors du chargement des médicaments', err);
      }
    });
  }

  ajouterPrescription(): void {
    this.ordonnance.prescriptions.push({
      medicament: {} as Medicament,
      posologie: '',
      duree: ''
    });
  }

  supprimerPrescription(index: number): void {
    this.ordonnance.prescriptions.splice(index, 1);
  }

  updateOrdonnance(): void {
    if (this.ordonnance.id) {
      this.ordonnanceService.update(this.ordonnance.id, this.ordonnance).subscribe({
        next: () => {
          alert('✅ Ordonnance mise à jour avec succès !');
          this.router.navigate(['/ordonnances']);
        },
        error: err => {
          console.error('❌ Erreur lors de la mise à jour :', err);
          alert('Erreur lors de la mise à jour.');
        }
      });
    }
  }
}
