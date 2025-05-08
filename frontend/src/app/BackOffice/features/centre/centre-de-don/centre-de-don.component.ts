import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentreDeDon, Statut } from 'src/app/models/centre-de-don.model';
import { CentreDeDonService } from "../../../../FrontOffice/features/User/services/services/centre-de-don.service";

@Component({
  selector: 'app-centre-de-don',
  templateUrl: './centre-de-don.component.html',
  styleUrls: ['./centre-de-don.component.css']
})
export class CentreDeDonComponent implements OnInit {
  sortField: string = 'capaciteMaximale';
  sortDirection: string = 'asc';
  centreForm: FormGroup;
  centres: CentreDeDon[] = [];
  isEditing = false;
  editingCentreId: number | null = null;
  gouvernorats = [
    { nom: 'Ariana', codePostal: '2080' },
    { nom: 'Béja', codePostal: '9000' },
    { nom: 'Ben Arous', codePostal: '2013' },
    { nom: 'Bizerte', codePostal: '7000' },
    { nom: 'Gabès', codePostal: '6000' },
    { nom: 'Gafsa', codePostal: '2100' },
    { nom: 'Jendouba', codePostal: '8100' },
    { nom: 'Kairouan', codePostal: '3100' },
    { nom: 'Kasserine', codePostal: '1200' },
    { nom: 'Kebili', codePostal: '4200' },
    { nom: 'Le Kef', codePostal: '7100' },
    { nom: 'Mahdia', codePostal: '5100' },
    { nom: 'Manouba', codePostal: '2010' },
    { nom: 'Médenine', codePostal: '4100' },
    { nom: 'Monastir', codePostal: '5000' },
    { nom: 'Nabeul', codePostal: '8000' },
    { nom: 'Sfax', codePostal: '3000' },
    { nom: 'Sidi Bouzid', codePostal: '9100' },
    { nom: 'Siliana', codePostal: '6100' },
    { nom: 'Sousse', codePostal: '4000' },
    { nom: 'Tataouine', codePostal: '3200' },
    { nom: 'Tozeur', codePostal: '2200' },
    { nom: 'Tunis', codePostal: '1000' },
    { nom: 'Zaghouan', codePostal: '1100' },
  ];

  constructor(
    private fb: FormBuilder,
    private centreService: CentreDeDonService,
  ) {
    this.centreForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      adresse: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8}$/),
      ]],
      codePostal: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{4}$/),
      ]],
      email: ['', [Validators.required, Validators.email]],
      capaciteMaximale: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]],
      statusCentre: [Statut.DISPONIBLE, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCentres();
    this.centreForm.get('adresse')?.valueChanges.subscribe(gouv => {
      const selection = this.gouvernorats.find(g => g.nom === gouv);
      if (selection) {
        this.centreForm.get('codePostal')?.setValue(selection.codePostal);
      }
    });
  }

  loadCentres(): void {
    this.centreService.getAllCentres().subscribe({
      next: (data) => this.centres = data
    });
  }

  onSubmit(): void {
    if (this.centreForm.invalid) {
      this.centreForm.markAllAsTouched();
      return;
    }

    const centreData = this.centreForm.value;

    if (this.isEditing && this.editingCentreId) {
      this.updateCentre({ ...centreData, idCentre: this.editingCentreId });
    } else {
      this.addCentre(centreData);
    }
  }

  onCapaciteInput(event: any) {
    const inputValue = Number(event.target.value);
    if (inputValue < 1) {
      this.centreForm.get('capaciteMaximale')?.setValue('');
    }
  }

  addCentre(centre: Omit<CentreDeDon, 'idCentre'>): void {
    this.centreService.addCentre(centre).subscribe({
      next: () => {
        this.resetForm();
        this.loadCentres();
      },
    });
  }

  editCentre(centre: CentreDeDon): void {
    this.isEditing = true;
    this.editingCentreId = centre.idCentre;
    this.centreForm.patchValue(centre);
  }

  updateCentre(centre: CentreDeDon): void {
    this.centreService.updateCentre(centre).subscribe({
      next: () => {
        this.resetForm();
        this.loadCentres();
      },
    });
  }

  deleteCentre(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce centre?')) {
      this.centreService.deleteCentre(id).subscribe({
        next: () => {
          this.loadCentres();
        },
      });
    }
  }

  resetForm(): void {
    this.centreForm.reset({
      statusCentre: Statut.DISPONIBLE
    });
    this.isEditing = false;
    this.editingCentreId = null;
  }

  sortByCapacity(): void {
    if (this.sortField === 'capaciteMaximale') {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = 'capaciteMaximale';
      this.sortDirection = 'asc';
    }
  }

  private getPropertyValue(obj: CentreDeDon, key: string): any {
    if (key in obj) {
      return obj[key as keyof CentreDeDon];
    }
    return null;
  }

  sortedCentres(): CentreDeDon[] {
    return [...this.centres].sort((a, b) => {
      let comparison = 0;

      if (this.getPropertyValue(a, this.sortField) > this.getPropertyValue(b, this.sortField)) {
        comparison = 1;
      } else if (this.getPropertyValue(a, this.sortField) < this.getPropertyValue(b, this.sortField)) {
        comparison = -1;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}
