import { Component, OnInit } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-commande-admin-list',
  templateUrl: './commande-admin-list.component.html',
  styleUrls: ['./commande-admin-list.component.css']

})
export class CommandeAdminListComponent implements OnInit {
  livraisons: any[] = [];
  

  constructor(
    private livraisonService: LivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.livraisonService.getAll().subscribe({
      next: data => this.livraisons = data,
      error: () => alert('❌ Erreur chargement commandes')
    });
  }
  toastSuppressionVisible = false;


  supprimerCommande(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      this.livraisonService.deleteLivraison(id).subscribe({
        next: (message) => {
          this.livraisons = this.livraisons.filter(l => l.id !== id);
          this.toastSuppressionVisible = true;
  
          // Masquer le toast automatiquement après 3 secondes
          setTimeout(() => {
            this.toastSuppressionVisible = false;
          }, 3000);
        },
        error: err => {
          console.error('❌ Erreur suppression', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
  

  modifierCommande(id: number) {
    this.router.navigate(['/dashboard/commandes/modifier', id]);
  }

  generatePDF(livraison: any) {
    const doc = new jsPDF();
  
    // 🟢 En-tête : DEWINI
    doc.setFontSize(18);
    doc.setTextColor('#178066');
    doc.setFont('helvetica', 'bold');
    doc.text('DEWINI - Facture Médicale', 14, 20);
  
    // 🔹 Infos générales
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(`Date : ${new Date(livraison.dateLivraison).toLocaleDateString()}`, 14, 36);
    doc.text(`Nom du client : ${livraison.nomClient}`, 14, 46);
    doc.text(`Adresse : ${livraison.adresse}`, 14, 52);
  
    // 💊 Médicaments
    const medicamentData = livraison.medicaments.map((med: any) => [
      med.nom,
      med.description || '-',
      `${med.prix.toFixed(2)} TND`
    ]);
    const total = livraison.medicaments.reduce((sum: number, med: any) => sum + med.prix, 0);
  
    // 📋 Tableau des médicaments
    autoTable(doc, {
      startY: 65,
      head: [['Nom du Médicament', 'Description', 'Prix (TND)']],
      body: medicamentData,
      headStyles: {
        fillColor: [23, 128, 102], // Couleur verte DEWINI
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        fontSize: 10,
        halign: 'left',
        cellPadding: 2
      }
    });
  
    // 🧮 Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(`Total à payer : ${total.toFixed(2)} TND`, 14, finalY);
  
    // ✅ Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor('#1fab89');
    doc.text('Merci pour votre confiance - www.dewini.tn', 14, 290);
  
    // 💾 Enregistrement
    doc.save(`facture_commande_${livraison.id}.pdf`);
  }
  page: number = 1;
  pageSize: number = 6;
  

  
  get totalPages(): number[] {
    const total = Math.ceil(this.livraisons.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  searchTerm = '';



get commandesPaginees(): any[] {
  const start = (this.page - 1) * this.pageSize;
  return this.commandesFiltres.slice(start, start + this.pageSize);
}

dateDebut?: string;
dateFin?: string;

get commandesFiltres(): any[] {
  return this.livraisons.filter(c => {
    const date = new Date(c.dateLivraison);
    const afterStart = !this.dateDebut || new Date(this.dateDebut) <= date;
    const beforeEnd = !this.dateFin || new Date(this.dateFin) >= date;
    const matchesSearch = this.searchTerm.trim() === '' || 
      c.nomClient.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.adresse.toLowerCase().includes(this.searchTerm.toLowerCase());

    return afterStart && beforeEnd && matchesSearch;
  });
}
appliquerFiltre(): void {
  this.page = 1; // Reset la pagination
}

estRecente(date: string): boolean {
  const today = new Date();
  const livraisonDate = new Date(date);
  const diffHeures = (today.getTime() - livraisonDate.getTime()) / 3600000;
  return diffHeures <= 24;
}
totalEtat(etat: string): number {
  return this.livraisons.filter(l => l.etat === etat).length;
}
exporterCSV(): void {
  const headers = ['ID', 'Client', 'Adresse', 'Date', 'État'];
  const rows = this.livraisons.map(l =>
    [l.id, l.nomClient, l.adresse, l.dateLivraison, l.etat].join(',')
  );
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "commandes.csv");
  document.body.appendChild(link); // Required
  link.click();
}


}
