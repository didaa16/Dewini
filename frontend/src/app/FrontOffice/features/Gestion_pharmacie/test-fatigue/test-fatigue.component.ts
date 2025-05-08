import { Component } from '@angular/core';
import { FatigueService } from 'src/app/services/fatigue/fatigue.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-test-fatigue',
  templateUrl: './test-fatigue.component.html',
  styleUrls: ['./test-fatigue.component.css']
})
export class TestFatigueComponent {
  loading = false;
  today: Date = new Date();
  resultat: any = null;

  
  numeroPatient: string = '+21695688967'; // peut être saisi dynamiquement si tu veux
  

  constructor(private fatigueService: FatigueService) {}

  lancerTest() {
    this.loading = true;
    this.fatigueService.lancerTestFatigue().subscribe({
      next: (res: any) => {
        this.resultat = res;
        this.loading = false;
      },      
      error: () => {
        this.loading = false;
        alert('Erreur lors du test de fatigue.');
      }
    });
  }



exporterPDF() {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Titre
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(22, 128, 67); // vert foncé
  doc.text("DEWINI - Recommandation Médicale", 20, 20);

  // Date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Date du test : ${date}`, 20, 30);

  // Section : Signes détectés
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("Signes observés :", 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  let y = 60;
  this.resultat?.signes.forEach((signe: any) => {
    doc.text(`- ${signe}`, 25, y);
    y += 8;
  });

  // Section : Recommandations IA
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("Recommandations IA :", 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  y += 10;
  this.resultat?.recommandations.forEach((rec: any) => {
    doc.text(`- ${rec}`, 25, y);
    y += 8;
  });

  doc.save("rapport-fatigue.pdf");
}

genererEtEnvoyerPDF() {
  const doc = new jsPDF();
  const nomApp = "🧠 Application DEWINI";
  const today = new Date().toLocaleDateString();

  // ✅ Contenu du PDF
  doc.setFontSize(16);
  doc.text(nomApp, 10, 15);
  doc.setFontSize(12);
  doc.text(`📅 Date : ${today}`, 10, 25);
  doc.text("🧪 Résultat du test de fatigue :", 10, 35);
  doc.text(`Score : ${this.resultat.score}/4`, 10, 45);

  doc.text("⚠️ Signes détectés :", 10, 60);
  this.resultat.signes.forEach((s: string, index: number) => {
    doc.text(`- ${s}`, 15, 70 + index * 10);
  });

  const startReco = 80 + this.resultat.signes.length * 10;
  doc.text("✅ Recommandations IA :", 10, startReco);
  this.resultat.recommandations.forEach((r: string, index: number) => {
    doc.text(`- ${r}`, 15, startReco + 10 + index * 10);
  });

  // ✅ Convertir en blob puis File
  const blob = doc.output('blob');
  const file = new File([blob], 'recommandation-fatigue.pdf', { type: 'application/pdf' });

  // ✅ Envoi au backend
  this.fatigueService.envoyerPdfAvecWhatsapp(file, this.numeroPatient).subscribe({
    next: (res) => {
      alert("✅ Rapport envoyé par WhatsApp !");
    },
    error: (err) => {
      alert("❌ Échec de l'envoi : " + err.message);
    }
  });
}

genererEtEnvoyerImage() {
  const rapportElement = document.getElementById('rapport-container');

  if (!rapportElement) {
    alert("Élément rapport introuvable !");
    return;
  }

  html2canvas(rapportElement).then(canvas => {
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'rapport-fatigue.png', { type: 'image/png' });

        this.fatigueService.envoyerImageAvecWhatsapp(file, this.numeroPatient).subscribe({
          next: (res) => alert("✅ Rapport envoyé par WhatsApp !"),
          error: (err) => alert("❌ Échec de l'envoi : " + err.message)
        });
      }
    }, 'image/png');
  });
}

  
}
