import { Component, OnInit } from '@angular/core';
import { OrdonnanceService } from 'src/app/services/ordonnance/ordonnance.service';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model'; 
import html2canvas from 'html2canvas';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-ordonnance-admin-list',
  templateUrl: './ordonnance-admin-list.component.html',
  styleUrls: ['./ordonnance-admin-list.component.css']
})
export class OrdonnanceAdminListComponent implements OnInit {
  ordonnances: Ordonnance[] = [];
  selectedOrdonnance: any;
  today: Date = new Date();

  searchTerm: string = '';
  triSelection: string = '';
  dateDebut?: string;
  dateFin?: string;

  constructor(
    private ordonnanceService: OrdonnanceService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.ordonnanceService.getAll().subscribe({
      next: data => this.ordonnances = data,
      error: err => console.error('❌ Erreur chargement ordonnances admin :', err)
    });
  }

  supprimer(id: number): void {
    if (confirm(`❓ Supprimer l'ordonnance #${id} ?`)) {
      this.ordonnanceService.delete(id).subscribe({
        next: () => this.ordonnances = this.ordonnances.filter(o => o.id !== id),
        error: err => alert('Erreur suppression.')
      });
    }
  }

  get ordonnancesFiltres(): Ordonnance[] {
    let result = this.ordonnances;

    if (this.searchTerm) {
      result = result.filter(o =>
        o.id?.toString().includes(this.searchTerm) ||
        o.medecinId?.toString().includes(this.searchTerm) ||
        o.patientId?.toString().includes(this.searchTerm)
      );
    }
    if (this.dateDebut) {
      const debut = new Date(this.dateDebut);
      result = result.filter(o => new Date(o.dateAjout ?? '') >= debut);
    }
    
    if (this.dateFin) {
      const fin = new Date(this.dateFin);
      result = result.filter(o => new Date(o.dateAjout ?? '') <= fin);
    }
    

    switch (this.triSelection) {
      case 'id-asc': result.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)); break;
      case 'id-desc': result.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)); break;
    }

    return result;
  }

  totalSignees(): number {
    return this.ordonnances.filter(o => o.signature).length;
  }

  totalRecentes(): number {
    const maintenant = new Date().getTime();
    return this.ordonnances.filter(o => {
      const ajout = new Date(o['dateAjout'] || '').getTime();
      return (maintenant - ajout) <= 86400000; // < 24h
    }).length;
  }

  generateAndUploadPdf(ord: Ordonnance): void {
    this.selectedOrdonnance = ord;
    setTimeout(() => {
      const element = document.getElementById('pdfContent');
      if (!element) return;

      element.style.display = 'block';

      html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        const blob = pdf.output('blob');
        const file = new File([blob], `ordonnance_${ord.id}.pdf`, { type: 'application/pdf' });

        this.cloudinaryService.uploadPdf(file).subscribe({
          next: (url: string) => {
            ord.lienPdf = url;
            ord.signature = 'true';
            this.ordonnanceService.update(ord.id!, ord).subscribe();
            alert("✅ PDF enregistré !");
          },
          error: () => alert("❌ Échec upload Cloudinary")
        });

        element.style.display = 'none';
      });
    }, 100);
  }
}
