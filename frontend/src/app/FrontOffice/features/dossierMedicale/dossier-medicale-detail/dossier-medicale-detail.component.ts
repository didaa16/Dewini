import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierMedicale } from '../../../../models/dossier-medicale.model';
import { Consultation } from '../../../../models/consultation.model';
import { DossierMedicaleService } from "../../User/services/services/dossier-medicale.service";
import { ConsultationService } from "../../User/services/services/consultation.service";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dossier-medicale-detail',
  templateUrl: './dossier-medicale-detail.component.html',
  styleUrls: ['./dossier-medicale-detail.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('buttonHover', [
      transition(':enter', [
        style({ transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class DossierMedicaleDetailComponent implements OnInit {
  dossier: DossierMedicale | null = null;
  consultations: Consultation[] = [];
  loading = false;
  error = '';
  analyse: string | null = null;
  analysisLoading = false;
  analysisError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dossierService: DossierMedicaleService,
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'ID de dossier invalide.';
      this.cdr.detectChanges();
      return;
    }

    this.loadDossier(id);
  }

  loadDossier(id: number): void {
    this.loading = true;
    this.error = '';
    this.dossierService.getDossier(id).subscribe({
      next: (dossier: DossierMedicale) => {
        this.dossier = dossier;
        if (dossier.id_dossier) {
          this.loadConsultations(dossier.id_dossier);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du dossier:', error);
        this.error = 'Erreur lors du chargement du dossier médical';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadConsultations(dossierId: number): void {
    this.consultationService.getAllConsultations().subscribe({
      next: (consultations: Consultation[]) => {
        this.consultations = consultations.filter(c => c.dossierMedical?.id_dossier === dossierId);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des consultations:', error);
        this.error = 'Erreur lors du chargement des consultations';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddConsultation(): void {
    if (this.dossier?.id_dossier) {
      this.router.navigate(['/consultations/new'], {
        queryParams: { dossierId: this.dossier.id_dossier }
      });
    }
  }

  onViewConsultation(id: number): void {
    this.router.navigate(['/consultations', id]);
  }

  onDeleteConsultation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(id).subscribe({
        next: () => {
          if (this.dossier?.id_dossier) {
            this.loadConsultations(this.dossier.id_dossier);
          }
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression de la consultation:', error);
          this.error = 'Erreur lors de la suppression de la consultation';
        }
      });
    }
  }

  onEdit(): void {
    if (this.dossier?.id_dossier) {
      this.router.navigate(['/dossiers', this.dossier.id_dossier, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/dossiers']);
  }

  onAnalyserDossier(): void {
    if (!this.dossier) return;

    this.analysisLoading = true;
    this.analysisError = '';
    this.analyse = null;

    this.dossierService.analyserDossier(this.dossier.id_dossier!).subscribe({
      next: (response: string) => {
        this.analyse = response;
        this.analysisLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.analysisError = "Échec de l'analyse du dossier médical. Veuillez réessayer.";
        console.error('Erreur analyse IA :', err);
        this.analysisLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatAnalysisResult(rawResult: string): string {
    return rawResult;
  }
}
