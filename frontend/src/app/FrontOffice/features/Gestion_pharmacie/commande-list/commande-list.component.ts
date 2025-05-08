import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit, OnDestroy {
  livraisons: any[] = [];

  constructor(
    private livraisonService: LivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.classList.add('sub_page');
    this.livraisonService.getAll().subscribe({
      next: (data) => {
        this.livraisons = data;
        console.log('✅ Livraisons reçues :', data);
      },
      error: () => alert('Erreur lors du chargement des livraisons.')
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('sub_page');
  }

  supprimerCommande(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      this.livraisonService.deleteLivraison(id).subscribe({
        next: (message) => {
          alert(message);
          this.livraisons = this.livraisons.filter(l => l.id !== id);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression :', err);
          alert('Erreur lors de la suppression de la commande.');
        }
      });
    }
  }

  modifierCommande(id: number) {
    this.router.navigate(['/edit-commande', id]);
  }

  generatePDF(livraison: any) {
    const doc = new jsPDF();

    // 🧾 Titre
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Facture`, 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Commande #${livraison.id}`, 14, 28);
    doc.text(`Date : ${new Date(livraison.dateLivraison).toLocaleDateString()}`, 14, 36);

    // 📄 Infos client
    doc.text(`Client : ${livraison.nomClient}`, 14, 48);
    doc.text(`Adresse : ${livraison.adresse}`, 14, 56);
    doc.text(`État : ${livraison.etat}`, 14, 64);

    // 💊 Médicaments
    const medicamentData = livraison.medicaments.map((med: any) => [
      med.nom,
      med.description,
      `${med.prix.toFixed(2)} TND`,
    ]);

    const total = livraison.medicaments.reduce((sum: number, med: any) => sum + med.prix, 0);

    // 📋 Tableau
    autoTable(doc, {
      startY: 75,
      head: [['Nom', 'Description', 'Prix']],
      body: medicamentData,
      styles: { halign: 'left' },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // ✅ Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total : ${total.toFixed(2)} TND`, 14, finalY);

    // 💾 Sauvegarde
    doc.save(`facture_commande_${livraison.id}.pdf`);
  }
}
