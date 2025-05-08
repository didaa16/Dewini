/*import { Component } from '@angular/core';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-upload-ordonnance',
  templateUrl: './upload-ordonnance.component.html'
})
export class UploadOrdonnanceComponent {
  selectedFile?: File;
  ordonnanceId!: number;
  uploadUrl?: string;

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.selectedFile = file;
  }

  upload(): void {
    if (!this.selectedFile || !this.ordonnanceId) return;

    this.cloudinaryService.uploadImage(this.selectedFile!, this.ordonnanceId).subscribe({
      next: (url: string) => {
        this.uploadUrl = url;
        alert('✅ PDF envoyé avec succès !');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Erreur lors de l’envoi vers Cloudinary');
      }
    });
  }
}*/
import { Component } from '@angular/core';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-upload-ordonnance',
  templateUrl: './upload-ordonnance.component.html'
})
export class UploadOrdonnanceComponent {
  selectedFile?: File;
  ordonnanceId!: number;
  uploadUrl?: string;

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.selectedFile = file;
  }

  upload(): void {
    if (!this.selectedFile || !this.ordonnanceId) return;

    this.cloudinaryService.uploadPdf(this.selectedFile).subscribe({
      next: (url: string) => {
        this.uploadUrl = url;
        alert('✅ PDF envoyé avec succès !');
      },
      error: (err: any) => {
        console.error(err);
        alert('❌ Erreur lors de l’envoi vers Cloudinary');
      }
    });
  }
}
