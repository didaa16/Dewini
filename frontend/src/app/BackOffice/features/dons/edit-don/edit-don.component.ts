import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonService } from "../../../../FrontOffice/features/User/services/services/don-service.service";
import { Don, TypeDon, GroupeSanguin } from 'src/app/models/don.model';
import { CentreDeDon } from 'src/app/models/centre-de-don.model';
import { CentreDeDonService } from "../../../../FrontOffice/features/User/services/services/centre-de-don.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-don',
  templateUrl: './edit-don.component.html',
  styleUrls: ['./edit-don.component.css']
})
export class EditDonComponent implements OnInit {
  donForm!: FormGroup;
  donId!: number;
  centres: CentreDeDon[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  today!: string;

  typeDonOptions = Object.values(TypeDon);
  groupeSanguinOptions = Object.values(GroupeSanguin);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donService: DonService,
    private centreService: CentreDeDonService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.donId = +this.route.snapshot.params['id'];
    this.today = this.formatDateForInput(new Date());
    this.loadData();
  }

  private initForm(): void {
    this.donForm = this.fb.group({
      centreId: ['', Validators.required],
      typeDon: ['', Validators.required],
      grpSanguin: ['', Validators.required],
      dateDon: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(0.1)]],
      description: ['']
    });
  }

  private loadData(): void {
    this.isLoading = true;

    // Charger les centres en premier
    this.centreService.getAllCentres().subscribe({
      next: (centres) => {
        this.centres = centres;
        this.loadDonData();
      },
      error: (err) => {
        console.error('Erreur chargement centres:', err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des centres';
      }
    });
  }

  private loadDonData(): void {
    this.donService.getDonById(this.donId).subscribe({
      next: (don) => {
        this.donForm.patchValue({
          centreId: don.centre?.idCentre,
          typeDon: don.typeDon,
          grpSanguin: don.grpSanguin,
          dateDon: this.formatDateForInput(don.dateDon),
          quantite: don.quantite,
          description: don.description
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement don:', err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement du don';
      }
    });
  }

  onSubmit(): void {
    if (this.donForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Trouver le centre complet
    const selectedCentre = this.centres.find(c => c.idCentre === this.donForm.value.centreId);

    if (!selectedCentre) {
      this.errorMessage = 'Centre sélectionné invalide';
      this.isLoading = false;
      return;
    }

    const updatedDon: Don = {
      idDon: this.donId,
      typeDon: this.donForm.value.typeDon,
      grpSanguin: this.donForm.value.grpSanguin,
      dateDon: new Date(this.donForm.value.dateDon),
      centre: selectedCentre,
      quantite: this.donForm.value.quantite,
      description: this.donForm.value.description,
      donneurs: [] // Initialiser avec un tableau vide
    };

    this.donService.updateDon(updatedDon).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/affichageDons'], {
          queryParams: { success: 'Don modifié avec succès' }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
        this.isLoading = false;
      }
    });
  }

  private handleError(err: HttpErrorResponse): void {
    console.error('Erreur:', err);
    if (err.status === 400) {
      this.errorMessage = 'Données invalides';
    } else if (err.status === 404) {
      this.errorMessage = 'Don non trouvé';
    } else {
      this.errorMessage = 'Une erreur est survenue lors de la modification';
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.donForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private formatDateForInput(date: Date | string): string {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/affichageDons']);
  }
}
