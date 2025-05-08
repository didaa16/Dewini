import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';

@Component({
  selector: 'app-medicament-detail-admin',
  templateUrl: './medicament-detail-admin.component.html'
})
export class MedicamentDetailAdminComponent implements OnInit {
  medicament?: Medicament;

  constructor(
    private route: ActivatedRoute,
    private medicamentService: MedicamentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.medicamentService.getById(id).subscribe({
      next: (data) => this.medicament = data,
      error: (err) => console.error('❌ Erreur chargement médicament', err)
    });
  }
}
