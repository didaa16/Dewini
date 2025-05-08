import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultationService } from "../../User/services/services/consultation.service";
import { Consultation } from '../../../../models/consultation.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
export class ConsultationListComponent implements OnInit {
  consultations: Consultation[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private consultationService: ConsultationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = null;
    this.consultations = [];

    this.consultationService.getAllConsultations().subscribe({
      next: (data: Consultation[]) => {
        console.log('Consultations received:', data); // For debugging
        this.consultations = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des consultations:', error);
        this.error = 'Une erreur est survenue lors du chargement des consultations.';
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
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

  onAdd(): void {
    this.router.navigate(['/consultations/new']);
  }

  onView(id: number): void {
    this.router.navigate(['/consultations', id]);
  }

  onEdit(id: number): void {
    this.router.navigate(['/consultations/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(id).subscribe({
        next: () => {
          this.loadConsultations();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression de la consultation:', error);
          this.error = 'Une erreur est survenue lors de la suppression de la consultation.';
        }
      });
    }
  }
}
