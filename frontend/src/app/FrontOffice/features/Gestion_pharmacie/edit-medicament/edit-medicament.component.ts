import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';

@Component({
  selector: 'app-edit-medicament',
  templateUrl: './edit-medicament.component.html',
  styleUrls: ['./edit-medicament.component.css']
})
export class EditMedicamentComponent implements OnInit {
  medicament: Medicament = {
    nom: '',
    description: '',
    quantiteEnStock: 0,
    prix: 0,
    dateExpiration: '',
    imageUrl: ''
  };
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
  
  

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicamentService: MedicamentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.medicamentService.getById(id).subscribe({
        next: (data) => {
          this.medicament = data;
          this.imagePreview = data.imageUrl || null;
        },
        error: (err) => {
          console.error('❌ Erreur chargement médicament', err);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.medicament.id) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('medicament', new Blob([
          JSON.stringify(this.medicament)
        ], { type: 'application/json' }));
        formData.append('image', this.selectedFile);

        this.medicamentService.uploadWithImage(formData).subscribe({
          next: () => {
            console.log('✅ Médicament mis à jour avec image');
            this.router.navigate(['/medicaments']);
          },
          error: (err: any) => {
            console.error('❌ Erreur upload image', err);
          }
        });
      } else {
        this.medicamentService.update(this.medicament.id, this.medicament).subscribe({
          next: () => {
            console.log('✅ Médicament mis à jour sans modification d’image');
            this.router.navigate(['/medicaments']);
          },
          error: (err: any) => {
            console.error('❌ Erreur mise à jour médicament', err);
          }
        });
      }
    }
  }
}
