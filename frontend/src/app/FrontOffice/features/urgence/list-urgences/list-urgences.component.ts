import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StatutUrgence, TypeUrgence, Urgence } from "../../../../models/urgence";
import { UrgenceService } from "../../User/services/services/urgence.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ConsultationUrgenteService } from "../../User/services/services/consultation-urgente.service";
import { User } from "../../User/services/models/user";
import { ZegoCloudService } from "../../User/services/services/zego-cloud.service";
import {ActivatedRoute, Router} from "@angular/router";
import { NotificationService } from "../../../../notification.service";
import { animate, style, transition, trigger } from "@angular/animations";
import {AuthenticationService} from "../../User/services/services/authentication.service";
import {UserControllerService} from "../../User/services/services/user-controller.service";

@Component({
  selector: 'app-list-urgences',
  templateUrl: './list-urgences.component.html',
  styleUrls: ['./list-urgences.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ])
    ]),
    trigger('buttonHover', [
      transition(':enter', [
        style({ transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ListUrgencesComponent implements OnInit {
  isLoading = true;
  public listUrgences: Urgence[] = [];
  public filteredUrgences: Urgence[] = [];
  public totalUrgences: Urgence[] = [];
  public searchQuery: string = '';
  public selectedDate: string | null = null;
  public selectedStatus: string = '';
  public selectedType: string = '';
  public currentUserId = this.authService.getCurrentUserId();
  public roles = this.authService.getCurrentUser()?.roles;

  constructor(
    private us: UrgenceService,
    private cus: ConsultationUrgenteService,
    private zegoCloudService: ZegoCloudService,
    private rt: Router,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService,
    private authService : AuthenticationService,
    private userService: UserControllerService,
  ) {}




  ngOnInit() {
    if (this.roles?.includes("ROLE_USER")) {
      this.loadDataForPatient();
    } else {
      this.loadData();
    }
  }

  private loadData(): void {
    this.us.getUrgencesWithoutTrated().subscribe({
      next: (response: Urgence[]) => {
        this.listUrgences = response;
        console.log(this.listUrgences);
        this.filterUrgences();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.isLoading = false;
        this.cd.detectChanges();
        this.notificationService.showError(error.message);
      }
    });

    this.us.getUrgences().subscribe({
      next: (response: Urgence[]) => {
        this.totalUrgences = response;
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.notificationService.showError('error.message');
      }
    });
  }

  private loadDataForPatient(): void {
    this.us.getUrgencesByUser(this.currentUserId).subscribe({
      next: (response: Urgence[]) => {
        this.listUrgences = response;
        console.log(this.listUrgences);
        this.filterUrgences();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.isLoading = false;
        this.cd.detectChanges();
        this.notificationService.showError(error.message);
      }
    });

    this.us.getUrgences().subscribe({
      next: (response: Urgence[]) => {
        this.totalUrgences = response;
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.notificationService.showError('error.message');
      }
    });
  }

  filterUrgences(): void {
    this.filteredUrgences = this.listUrgences.filter(u =>
      ['En_Attente', 'En_Cours'].includes(u.statutUrgence)
    );
  }

  onFilterChange(): void {
    this.applyAllFilters();
  }

  applyAllFilters(): void {
    let filteredBySearch = this.listUrgences;

    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filteredBySearch = this.listUrgences.filter(u =>
        (u.patient && u.patient.firstname && u.patient.firstname.toLowerCase().includes(query)) ||
        (u.addressePatient && u.addressePatient.toLowerCase().includes(query))
      );
    }

    if (this.selectedDate) {
      const selectedDate = new Date(this.selectedDate).toISOString().split('T')[0];
      filteredBySearch = filteredBySearch.filter(u =>
        u.date && new Date(u.date).toISOString().split('T')[0] === selectedDate
      );
    }

    if (this.selectedStatus) {
      filteredBySearch = filteredBySearch.filter(u =>
        u.statutUrgence === this.selectedStatus
      );
    }

    if (this.selectedType) {
      filteredBySearch = filteredBySearch.filter(u =>
        u.typeUrgence === this.selectedType
      );
    }

    this.filteredUrgences = filteredBySearch;
  }

  formatStatut(statut: string): string {
    switch (statut) {
      case 'En_Attente':
        return 'EN ATTENTE';
      case 'En_Cours':
        return 'EN COURS';
      case 'Traite':
        return 'TRAITÉ';
      default:
        return statut;
    }
  }

  formatType(type: string): string {
    switch (type) {
      case 'A_Domicile':
        return 'À DOMICILE';
      case 'En_Ligne':
        return 'EN LIGNE';
      default:
        return type;
    }
  }

  deleteUrgence(id: number) {
    if (confirm('Are you sure you want to delete this urgency?')) {
      this.us.deleteUrgence(id).subscribe(
        () => {
          this.listUrgences = this.listUrgences.filter(u => u.idUrgence !== id);
          this.filterUrgences();
          this.notificationService.showSuccess('Urgence supprimée avec succès !');
        },
        (error: HttpErrorResponse) => {
          console.error('Error deleting urgency:', error);
          this.notificationService.showError(error.message);
        }
      );
    }
  }

  updateUrgence(id: number) {
    window.location.href = `/addUrgence/${id}`;
  }

  exportExcel(): void {
    this.us.exportToExcel();
  }

  prendreEnCharge(idUrgence: number) {
    if (!this.currentUserId) {
      this.notificationService.showError('Vous devez être connecté pour créer une urgence.');
      this.rt.navigate(['/login']);
      return;
    }

    if (confirm("Voulez-vous prendre en charge cette urgence ?")) {
      const urgenceData: Partial<Urgence> = {
        medecin: { id: this.currentUserId },
        statutUrgence: StatutUrgence.En_Cours
      };

      this.us.updateUrgence(urgenceData, idUrgence).subscribe(
        () => {
          this.notificationService.showSuccess('Urgence mise à jour avec succès !');
          this.ngOnInit();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour :', error);
          this.notificationService.showError('Une erreur est survenue lors de la mise à jour.');
        }
      );

      const urgence = this.listUrgences.find(u => u.idUrgence === idUrgence);
      if (urgence?.typeUrgence === TypeUrgence.En_Ligne) {
        this.zegoCloudService.generateZegoLink().then((videoLink) => {
          this.notificationService.showInfo(videoLink);
          console.log('Lien vidéo généré :', videoLink);
          this.cus.prendreEnCharge(idUrgence, videoLink).subscribe(
            (response) => {
              this.notificationService.showSuccess("L'urgence a été prise en charge avec succès !");
              if (urgence.typeUrgence === TypeUrgence.A_Domicile) {
                this.rt.navigate(['/doctorTracking']);
              }
              console.log(response);
            },
            (error) => {
              this.notificationService.showError("Erreur : " + error.error);
            }
          );
        });
      } else {
        this.cus.prendreEnCharge(idUrgence, null).subscribe(
          (response) => {
            this.notificationService.showSuccess("L'urgence a été prise en charge avec succès !");
            console.log(response);
          },
          (error) => {
            this.notificationService.showError("Erreur : " + error.error);
          }
        );
      }
    }
  }

  seTerminer(idUrgence: number, idConsultationUrgente: number) {
    if (confirm("Voulez-vous vraiment terminer cette urgence ?")) {
      const urgenceData: Partial<Urgence> = {
        statutUrgence: StatutUrgence.Traite
      };

      this.us.updateUrgence(urgenceData, idUrgence).subscribe(
        () => {
          this.notificationService.showSuccess('Urgence mise à jour avec succès !');
          this.ngOnInit();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour :', error);
          this.notificationService.showError('Une erreur est survenue lors de la mise à jour.');
        }
      );

      this.cus.deleteConsultationUrgente(idConsultationUrgente).subscribe(
        () => {
          this.notificationService.showInfo("Consultation urgente supprimée !");
        },
        (error) => {
          console.error("Erreur lors de la suppression de la consultation urgente :", error);
          this.notificationService.showError("Une erreur est survenue lors de la suppression.");
        }
      );
    }
  }

  seDecharger(idUrgence: number, idConsultationUrgente: number) {
    if (confirm("Voulez-vous vraiment vous décharger de cette urgence ?")) {
      this.us.desaffecterUtilisateurFromUrgence(idUrgence).subscribe(
        () => {
          this.notificationService.showInfo('Médecin retiré de l\'urgence avec succès !');
          this.ngOnInit();
        },
        (error) => {
          console.error('Erreur lors de la désaffectation du médecin :', error);
          this.notificationService.showError('Une erreur est survenue lors de la désaffectation.');
        }
      );

      this.cus.deleteConsultationUrgente(idConsultationUrgente).subscribe(
        () => {
          this.notificationService.showInfo("Consultation urgente supprimée !");
        },
        (error) => {
          console.error("Erreur lors de la suppression de la consultation urgente :", error);
          this.notificationService.showError('Une erreur est survenue lors de la suppression.');
        }
      );
    }
  }

  protected readonly TypeUrgence = TypeUrgence;
}
