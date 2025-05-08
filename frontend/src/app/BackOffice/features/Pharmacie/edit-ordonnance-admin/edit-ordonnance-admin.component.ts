import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdonnanceService } from 'src/app/services/ordonnance/ordonnance.service';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-edit-ordonnance-admin',
  templateUrl: './edit-ordonnance-admin.component.html',
  styleUrls: ['./edit-ordonnance-admin.component.css']
})
export class EditOrdonnanceAdminComponent implements OnInit, AfterViewInit {
  ordonnance: Ordonnance = {
    instructions: '',
    medecinId: 0,
    patientId: 0,
    prescriptions: [],
    signature: ''
  };

  listeMedicaments: Medicament[] = [];

  @ViewChild('signatureCanvas', { static: false }) signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordonnanceService: OrdonnanceService,
    private medicamentService: MedicamentService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.ordonnanceService.getById(id).subscribe({
        next: (data) => this.ordonnance = data,
        error: (err) => console.error('Erreur chargement ordonnance', err)
      });
    }

    this.medicamentService.getAll().subscribe({
      next: (data) => this.listeMedicaments = data,
      error: (err) => console.error('Erreur chargement médicaments', err)
    });
  }

  ngAfterViewInit(): void {
    if (this.signatureCanvas) {
      this.ctx = this.signatureCanvas.nativeElement.getContext('2d')!;
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;

      const canvasEl = this.signatureCanvas.nativeElement;
      canvasEl.addEventListener('mousedown', () => this.drawing = true);
      canvasEl.addEventListener('mouseup', () => this.drawing = false);
      canvasEl.addEventListener('mouseleave', () => this.drawing = false);
      canvasEl.addEventListener('mousemove', (event) => this.draw(event));

      if (this.ordonnance.signature) {
        const image = new Image();
        image.onload = () => {
          this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
          this.ctx.drawImage(image, 0, 0, canvasEl.width, canvasEl.height);
          this.drawing = false;
        };
        image.src = this.ordonnance.signature;
      }
    }
  }

  private draw(event: MouseEvent): void {
    if (!this.drawing) return;
    const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();
    this.ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    this.ctx.stroke();
  }

  effacerSignature(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ordonnance.signature = undefined;
  }

  sauvegarderSignature(): void {
    const canvas = this.signatureCanvas.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      alert("❌ Impossible d'accéder au contexte du canvas.");
      return;
    }

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const isBlank = !Array.from(imageData).some(channel => channel !== 0 && channel !== 255);

    if (isBlank) {
      alert('❌ Veuillez dessiner une signature avant de sauvegarder.');
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    this.ordonnance.signature = dataUrl;
  }

  ajouterPrescription(): void {
    this.ordonnance.prescriptions.push({
      medicament: {} as Medicament,
      posologie: '',
      duree: ''
    });
  }

  supprimerPrescription(index: number): void {
    this.ordonnance.prescriptions.splice(index, 1);
  }

  updateOrdonnance(): void {
    if (this.ordonnance.id) {
      this.ordonnanceService.update(this.ordonnance.id, this.ordonnance).subscribe({
        next: () => {
          alert('✅ Ordonnance mise à jour avec succès !');
          this.router.navigate(['/dashboard/ordonnances']);
        },
        error: err => {
          console.error('❌ Erreur lors de la mise à jour :', err);
          alert('Erreur lors de la mise à jour.');
        }
      });
    }
  }

  supprimerSignatureSauvegardee(): void {
    if (confirm('Voulez-vous vraiment supprimer la signature enregistrée ?')) {
      this.ordonnance.signature = undefined;
      this.effacerSignature();
    }
  }
}