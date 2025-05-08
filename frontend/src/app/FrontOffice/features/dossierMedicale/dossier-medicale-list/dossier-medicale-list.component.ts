import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DossierMedicale } from '../../../../models/dossier-medicale.model';
import { DossierMedicaleService } from "../../User/services/services/dossier-medicale.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { animate, style, transition, trigger, stagger, query } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dossier-medicale-list',
  templateUrl: './dossier-medicale-list.component.html',
  styleUrls: ['./dossier-medicale-list.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        query('.dossier-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
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
export class DossierMedicaleListComponent implements OnInit, OnDestroy {
  dossiers: DossierMedicale[] = [];
  loading = false;
  error: string | null = null;
  private dossierSubscription: Subscription | null = null;

  constructor(
    private dossierService: DossierMedicaleService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  ngOnDestroy(): void {
    if (this.dossierSubscription) {
      this.dossierSubscription.unsubscribe();
    }
  }

  loadDossiers(): void {
    if (this.loading) return;

    if (this.dossierSubscription) {
      this.dossierSubscription.unsubscribe();
    }

    this.loading = true;
    this.error = null;
    this.dossiers = [];

    this.dossierSubscription = this.dossierService.getAllDossiers().subscribe({
      next: (dossiers) => {
        console.log('Dossiers received:', dossiers); // For debugging
        this.dossiers = dossiers.map(dossier => ({
          ...dossier,
          antecedentsMedicaux: dossier.antecedentsMedicaux || '',
          allergies: dossier.allergies || '',
          traitementsEnCours: dossier.traitementsEnCours || ''
        }));
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Erreur lors du chargement des dossiers:', error);
        this.error = 'Une erreur est survenue lors du chargement des dossiers médicaux.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onView(id: number): void {
    this.router.navigate(['/dossiers', id]);
  }

  onEdit(id: number): void {
    this.router.navigate(['/dossiers/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier médical ?')) {
      this.dossierService.deleteDossier(id).subscribe({
        next: () => {
          this.loadDossiers();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du dossier:', error);
          this.error = 'Une erreur est survenue lors de la suppression du dossier médical.';
        }
      });
    }
  }

  onCreate(): void {
    this.router.navigate(['/dossiers/new']);
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
