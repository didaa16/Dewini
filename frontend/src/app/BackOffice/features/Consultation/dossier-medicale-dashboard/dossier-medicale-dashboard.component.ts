import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { DossierMedicale } from 'src/app/models/dossier-medicale.model';
import { DossierMedicaleService } from "../../../../FrontOffice/features/User/services/services/dossier-medicale.service";

@Component({
  selector: 'app-dossier-medicale-dashboard',
  templateUrl: './dossier-medicale-dashboard.component.html',
  styleUrls: ['./dossier-medicale-dashboard.component.css']
})
export class DossierMedicaleDashboardComponent implements OnInit {
  dossiers: DossierMedicale[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private dossierService: DossierMedicaleService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.loading = true;
    this.error = null;

    this.dossierService.getAllDossiers().subscribe({
      next: (dossiers) => {
        this.dossiers = dossiers.map(dossier => ({
          ...dossier,
          antecedentsMedicaux: dossier.antecedentsMedicaux || '',
          allergies: dossier.allergies || '',
          traitementsEnCours: dossier.traitementsEnCours || ''
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des dossiers:', error);
        this.error = 'Une erreur est survenue lors du chargement des dossiers médicaux.';
        this.loading = false;
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier médical ?')) {
      this.dossierService.deleteDossier(id).subscribe({
        next: () => {
          this.dossiers = this.dossiers.filter(d => d.id_dossier !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du dossier:', error);
          this.error = 'Une erreur est survenue lors de la suppression du dossier médical.';
        }
      });
    }
  }

  formatText(text: string | undefined): SafeHtml {
    if (!text) return this.sanitizer.bypassSecurityTrustHtml('Aucun');

    const formattedText = text
      .split(/\s*-\s*/)
      .filter(item => item.trim().length > 0)
      .map(item => `• ${item.trim()}`)
      .join('<br>');

    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }
}
