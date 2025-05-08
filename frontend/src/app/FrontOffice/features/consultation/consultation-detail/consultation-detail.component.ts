import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from "../../User/services/services/consultation.service";
import { Consultation } from '../../../../models/consultation.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-consultation-detail',
  templateUrl: './consultation-detail.component.html',
  styleUrls: ['./consultation-detail.component.css'],
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
export class ConsultationDetailComponent implements OnInit {
  consultation: Consultation | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadConsultation(+id);
    } else {
      this.error = 'ID de consultation non trouvé';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private loadConsultation(id: number): void {
    this.consultationService.getConsultationById(id).subscribe({
      next: (data: Consultation) => {
        this.consultation = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement de la consultation';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/consultations']);
  }

  onStartVideo(): void {
    if (this.consultation?.id_consultation) {
      this.router.navigate(['/consultations', this.consultation.id_consultation, 'video']);
    }
  }
}
