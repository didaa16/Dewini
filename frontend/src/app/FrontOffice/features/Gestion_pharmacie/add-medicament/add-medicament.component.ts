import { Component } from '@angular/core';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-medicament',
  templateUrl: './add-medicament.component.html'
})
export class AddMedicamentComponent {
  medicament: any = {};
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  uploadProgress: number = 0;
  imageError: string = '';

  categories: string[] = [
    "💊 Compléments alimentaires",
    "🧴 Visage",
    "💇‍♀️ Cheveux",
    "🛀 Corps",
    "🧼 Hygiène",
    "🌞 Solaires",
    "🌿 Bio & naturel",
    "🩺 Matériel médical",
    "👨‍⚕️ Homme",
    "👩‍🍼 Bébé et maman",
    "👁️ Soins des yeux",
    "🧘 Bien-être & relaxation"
  ];

  constructor(private medicamentService: MedicamentService, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = "Le fichier doit être une image (png/jpg/jpeg).";
        this.selectedFile = undefined!;
        this.previewUrl = null;
        return;
      }

      this.selectedFile = file;
      this.imageError = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.simulateUpload();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.imageError = "Veuillez sélectionner une image.";
      return;
    }

    const formData = new FormData();
    formData.append('medicament', new Blob([JSON.stringify(this.medicament)], { type: 'application/json' }));
    formData.append('image', this.selectedFile);

    this.medicamentService.uploadWithImage(formData).subscribe({
      next: () => {
        alert("✅ Médicament ajouté !");
        this.router.navigate(['/medicaments']);
      },
      error: err => {
        console.error("❌ Erreur lors de l'ajout :", err);
        alert("❌ Échec de l'ajout");
      }
    });
  }

  simulateUpload() {
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      } else {
        this.uploadProgress += 10;
      }
    }, 100);
  }
}
