import { Component, OnInit } from '@angular/core';
import { OrdonnanceService } from 'src/app/services/ordonnance/ordonnance.service';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model'; 
import html2canvas from 'html2canvas';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';
import { jsPDF } from 'jspdf'; // ✅ Correct pour Angular + TypeScript
import { HttpClient } from '@angular/common/http';
import { ElementRef, ViewChild } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { IaOcrService } from 'src/app/services/ocr/ia-ocr.service';
import { AuthenticationService } from '../../User/services/services';


@Component({
  selector: 'app-ordonnance-list',
  templateUrl: './ordonnance-list.component.html',
  styleUrls: ['./ordonnance-list.component.css']
})
export class OrdonnanceListComponent implements OnInit {
  ordonnances: Ordonnance[] = [];
  commandeVisibleId?: number;
  selectedOrdonnance: any;
  today: Date = new Date();

  commande = {
    nomClient: '',
    adresse: ''
  };

  constructor(
    private ordonnanceService: OrdonnanceService,
    private cloudinaryService: CloudinaryService,
    private http: HttpClient ,// 👉 à ajouter
    private medicamentService: MedicamentService,
    private livraisonService: LivraisonService ,
    private OcrService : IaOcrService ,        // 🛠 AJOUTER ceci !
    private authService: AuthenticationService
  
  ) {}

  ngOnInit(): void {
    this.ordonnanceService.getAll().subscribe({
      next: (data) => this.ordonnances = data,
      error: (err) => console.error('❌ Erreur :', err)
    });
  }

  delete(id: number): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l’ordonnance #${id} ?`)) {
      this.ordonnanceService.delete(id).subscribe({
        next: () => {
          this.ordonnances = this.ordonnances.filter(o => o.id !== id);
          alert(`✅ Ordonnance #${id} supprimée.`);
        },
        error: err => {
          console.error(err);
          alert('Erreur lors de la suppression.');
        }
      });
    }
  }

  toggleCommande(id: number): void {
    this.commandeVisibleId = this.commandeVisibleId === id ? undefined : id;
    this.commande = { nomClient: '', adresse: '' };
  }

  commander(ordonnanceId: number): void {
    if (!this.commande.nomClient || !this.commande.adresse) {
      alert('Veuillez remplir le nom et l’adresse.');
      return;
    }
  
    const ordonnance = this.ordonnances.find(o => o.id === ordonnanceId);
    if (!ordonnance || !ordonnance.prescriptions) {
      alert('Ordonnance ou prescriptions introuvables.');
      return;
    }
  
    const medicamentIds = ordonnance.prescriptions
      .map(p => p.medicament?.id)
      .filter(id => id !== undefined) as number[];
  
    if (medicamentIds.length === 0) {
      alert('Aucun médicament dans l’ordonnance.');
      return;
    }
  
    const patientId = this.authService.getUserId();
    if (!patientId) {
      alert('Vous devez être connecté pour passer une commande');
      return;
    }
  
    const payload = {
      patientId: patientId,
      nomClient: this.commande.nomClient,
      adresse: this.commande.adresse,
      medicamentIds: medicamentIds
    };
  
    this.livraisonService.commanderDepuisPanier(payload).subscribe({
      next: () => {
        this.toastMessage = `✅ Commande envoyée pour l’ordonnance #${ordonnanceId} !`;
        this.toastVisible = true;
        this.commandeVisibleId = undefined;
        setTimeout(() => this.toastVisible = false, 3000);
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la commande.');
      }
    });
  }
 

    generateAndUploadPdf(ord: Ordonnance): void {
      this.selectedOrdonnance = ord;
    
      setTimeout(() => {
        const element = document.getElementById('pdfContent');
        if (!element) {
          alert("❌ Élément PDF introuvable !");
          return;
        }
    
        // ✅ Afficher temporairement le bloc masqué
        element.style.display = 'block';
    
        html2canvas(element, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png'); // ✅ Format accepté
          const pdf = new jsPDF();
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
          const blob = pdf.output('blob');
          const file = new File([blob], `ordonnance_${ord.id}.pdf`, { type: 'application/pdf' });
    
          this.cloudinaryService.uploadPdf(file).subscribe({
            next: (url: string) => {
              ord.lienPdf = url;
              alert("✅ PDF enregistré avec succès dans Cloudinary !");

             // window.open(url, '_blank');
            },
            error: (err: any) => {
              console.error(err);
              alert("❌ Échec de l'envoi vers Cloudinary");
            }
          });
    
          // ❌ Masquer à nouveau après capture
          element.style.display = 'none';
        }).catch(error => {
          console.error(error);
          alert('❌ Échec de la génération du PDF.');
          element.style.display = 'none';
        });
      }, 100); // 🕒 Délai pour forcer le DOM à afficher
    }

    openedOrdonnanceId?: number;

toggleDetails(id: number): void {
  this.openedOrdonnanceId = this.openedOrdonnanceId === id ? undefined : id;
}



@ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

telechargerPdf(ordonnance: Ordonnance): void {
  this.selectedOrdonnance = ordonnance; // ✅ Sélectionner l'ordonnance
  console.log("✅ Ordonnance sélectionnée :", this.selectedOrdonnance);

  setTimeout(() => {
    const element = document.getElementById('pdfContent');
    if (!element) {
      alert("❌ Élément PDF introuvable !");
      return;
    }

    element.style.display = 'block'; // ✅ Affiche temporairement le bloc

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // 📄 format A4 portrait

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ordonnance_${ordonnance.id}.pdf`);
    }).catch(err => {
      console.error('❌ Erreur PDF :', err);
      alert('Erreur lors du téléchargement du PDF.');
    }).finally(() => {
      element.style.display = 'none'; // ✅ Cache proprement à la fin
    });
  }, 100); // 🕒 léger délai pour forcer le DOM à se mettre à jour
}





toastMessage = '';
toastVisible = false;

ocrMedicaments: any[] = [];
ocrTexte: string = '';
selectedFile: File | null = null; // 📂

onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0] || null;
}

analyserImage() {
  if (!this.selectedFile) return;

  this.isAnalysing = true;

  this.OcrService.uploadImage(this.selectedFile).subscribe({
    next: (response) => {
      this.ocrMedicaments = response.medicaments;
      this.ocrTexte = response.texte_detecte;
      this.isAnalysing = false;
    },
    error: (err) => {
      console.error("❌ Erreur OCR :", err);
      this.toastMessage = "Erreur lors de l'analyse de l'image.";
      this.toastVisible = true;
      this.isAnalysing = false;
    }
  });
}

showIABox = false;
isAnalysing = false;

mode: 'upload' | 'camera' = 'upload'; // 📂 Mode actuel

@ViewChild('video') videoRef!: ElementRef;
@ViewChild('canvas') canvasRef!: ElementRef;
photoCaptured = false;

startCamera() {
  const video = this.videoRef.nativeElement;
  const canvas = this.canvasRef.nativeElement;

  video.style.display = 'block';
  canvas.style.display = 'none';

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;

      video.onloadeddata = () => { // ✅ attendre que la vidéo soit prête
        video.play();
        console.log("🎥 Caméra prête !");
      };
    })
    .catch(err => console.error("Erreur caméra:", err));
}



capture() {
  const video = this.videoRef.nativeElement;
  const canvas = this.canvasRef.nativeElement;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('❌ Contexte 2D canvas non trouvé.');
    return;
  }

  if (video.readyState !== 4) { // ✅ readyState 4 = "HAVE_ENOUGH_DATA"
    alert("📸 La caméra n'est pas encore prête !");
    return;
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const stream = video.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  video.srcObject = null;

  video.style.display = 'none';
  canvas.hidden = false;
  canvas.style.display = 'block';

  this.photoCaptured = true;
}








analyserImageFromCamera() {
  const video = this.videoRef.nativeElement;
  const stream = video.srcObject as MediaStream;

  if (stream) {
    stream.getTracks().forEach(track => track.stop()); // 👉 On arrête la caméra au moment de l'analyse
  }
  video.srcObject = null; // vider

  const canvas = this.canvasRef.nativeElement;
  if (!canvas) return;

  canvas.toBlob((blob: Blob | null) => {
    if (blob) {
      const file = new File([blob], 'capture.png', { type: 'image/png' });
      this.selectedFile = file;
      this.analyserImage(); // Réutiliser
    } else {
      console.error('❌ Impossible de générer le blob');
    }
  }, 'image/png');
}





}







    
    
    
    
    
 