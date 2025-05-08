import { Component, OnInit } from '@angular/core';
import { ConsultationService } from "../../../../FrontOffice/features/User/services/services/consultation.service";
import { Consultation } from 'src/app/models/consultation.model';

@Component({
  selector: 'app-consultation-dashboard',
  templateUrl: './consultation-dashboard.component.html',
  styleUrls: ['./consultation-dashboard.component.css']
})
export class ConsultationDashboardComponent implements OnInit {
  consultations: Consultation[] = [];
  loading = false;
  error: string | null = null;

  constructor(private consultationService: ConsultationService) {}

  ngOnInit() {
    this.fetchConsultations();
  }

  fetchConsultations() {
    this.loading = true;
    this.error = null;
    this.consultationService.getAllConsultations().subscribe({
      next: (data) => {
        this.consultations = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des consultations.";
        this.loading = false;
      }
    });
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(id).subscribe(() => {
        this.consultations = this.consultations.filter(c => c.id_consultation !== id);
      });
    }
  }

  formatText(text: string | null | undefined): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }
}
