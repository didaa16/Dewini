import { Component, OnInit } from '@angular/core';
import {
  ActionEventArgs,
  EventSettingsModel,
  View
} from '@syncfusion/ej2-angular-schedule';
import { Rendezvous } from 'src/app/models/ModelsRendezvous/Rendezvous';
import { RendezvousService } from 'src/app/services/Rendezvous/rendezvous.service';
import { AuthenticationService } from '../../User/services/services';

@Component({
  selector: 'app-medical-calendar',
  templateUrl: './medical-calendar.component.html',
  styleUrls: ['./medical-calendar.component.css']
})
export class MedicalCalendarComponent implements OnInit {
  public selectedDate: Date = new Date();
  public currentView: View = 'Week';
  currentUserId: number | null = null;
  public eventSettings: EventSettingsModel = {
    dataSource: []
  };
  // Dans votre component.ts
private readonly colorPalette = [
  '#7bddb3',  // Couleur de base
  '#84dcc6',  // Légèrement plus foncée
  '#8ce8bf',  // Légèrement plus claire
  '#ffa69e ',  // Version plus saturée
  ' #65cbe9'   // Très claire
];

  public isModalOpen: boolean = false;
  public newRendezvous: Rendezvous = {
    idRendezvous: 0,
    nomPatient: '',
    dateNaissance: '',
    dateRendezvous: '',
    heureRendezvous: '',
    emailPatient: '',
    medicalState: '',
    sexePatient: 'HOMME'
  };

  constructor(private rendezvousService: RendezvousService, private authService: AuthenticationService) {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.currentUserId = userId;
    }
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
  if (userId !== null) {
    this.currentUserId = userId;
  }
  
  this.rendezvousService.rendezvousList$.subscribe((rendezvousList: Rendezvous[]) => {
    this.eventSettings = {
      ...this.eventSettings,
      dataSource: rendezvousList.map(rdv => this.convertRendezvousToEvent(rdv))
    };
  });

  this.rendezvousService.loadRendezvous();
  }

  onActionBegin(args: ActionEventArgs): void {
    const currentData = this.eventSettings.dataSource as any[];

  if (args.requestType === 'eventCreate') {
    // Cancel the default event creation
    args.cancel = true;

    const newEvents = Array.isArray(args.data) ? args.data : [args.data];
    
    // Just open the modal without adding to dataSource
    this.openModal(newEvents[0]);
  }

    if (args.requestType === 'eventChange') {
      const updatedEvent = args.data as any;
      const updatedData = currentData.map((event: any) =>
        event.Id === updatedEvent.Id ? updatedEvent : event
      );
    
      // Mettre à jour les données du calendrier
      this.eventSettings = {
        ...this.eventSettings,
        dataSource: updatedData
      };
    
      // Mettre à jour le rendez-vous dans le service
      const updatedRendezvous: Rendezvous = this.convertEventToRendezvous(updatedEvent);
    
      if (updatedRendezvous.idRendezvous !== undefined && this.currentUserId !== null) {
        this.rendezvousService
          .updateRendezvous(updatedRendezvous.idRendezvous, this.currentUserId, updatedRendezvous)
          .subscribe(() => {
            this.rendezvousService.updateLocalRendezvous(updatedRendezvous);
          });
      }
    }
    

    if (args.requestType === 'eventRemove') {
      const removedEvents = Array.isArray(args.data) ? args.data : [args.data];
      const updatedData = currentData.filter(
        (event: any) => !removedEvents.some((e: any) => e.Id === event.Id)
      );

      this.eventSettings = {
        ...this.eventSettings,
        dataSource: updatedData
      };

      removedEvents.forEach(event => {
        this.rendezvousService.deleteRendezvous(event.Id).subscribe(() => {
          this.rendezvousService.removeLocalRendezvous(event.Id);
        });
      });
    }
  }

  // Ouvre la fenêtre modale pour saisir les informations supplémentaires
  openModal(event: any): void {
    this.isModalOpen = true;
    // Initialiser un nouvel objet rendez-vous avec les données de l'événement créé
    this.newRendezvous = this.convertEventToRendezvous(event);
  }

  // Ferme la fenêtre modale
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Sauvegarde les informations du rendez-vous après modification dans la modale
  onSaveRendezvous(form?: any): void {
    if ((form && !form.valid) || this.currentUserId === null) {
      return;
    }
  
    const newRendezvous: Rendezvous = {
      idRendezvous: undefined,
      nomPatient: this.newRendezvous.nomPatient,
      emailPatient: this.newRendezvous.emailPatient,
      dateNaissance: this.newRendezvous.dateNaissance,
      medicalState: this.newRendezvous.medicalState,
      sexePatient: this.newRendezvous.sexePatient,
      dateRendezvous: this.newRendezvous.dateRendezvous,
      heureRendezvous: this.newRendezvous.heureRendezvous
    };
  
    this.rendezvousService.createRendezvous(newRendezvous, this.currentUserId)
      .subscribe({
        next: (savedRendezvous) => {
          // Convert to event format and add to dataSource
          const newEvent = this.convertRendezvousToEvent(savedRendezvous);
          this.eventSettings = {
            ...this.eventSettings,
            dataSource: [...this.eventSettings.dataSource as any[], newEvent]
          };
          
          this.closeModal();
        },
        error: (err) => {
          console.error("Error creating appointment", err);
        }
      });
  }
  isAgeValid(dateNaissance: string): boolean {
    if (!dateNaissance) return false;
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birthDate.getDate());
  }
  
  

  // Convertit un objet d'événement Syncfusion → modèle Rendezvous
  private convertEventToRendezvous(event: any): Rendezvous {
    return {
      idRendezvous: event.Id,
      nomPatient: event.Subject,
      dateNaissance: this.newRendezvous?.dateNaissance || '2000-01-01', // Valeur par défaut si non remplie
      dateRendezvous: event.StartTime.toISOString(),
      heureRendezvous: `${event.StartTime.getHours().toString().padStart(2, '0')}:${event.StartTime.getMinutes().toString().padStart(2, '0')}`,
      emailPatient: this.newRendezvous?.emailPatient || '', // Valeur par défaut si non remplie
      medicalState: this.newRendezvous?.medicalState || '', // Valeur par défaut si non remplie
      sexePatient: this.newRendezvous?.sexePatient || 'HOMME' // Valeur par défaut si non remplie
    };
  }

  // Convertit un Rendezvous → objet événement pour le calendrier
  private convertRendezvousToEvent(rdv: Rendezvous): any {
    const [hour, minute] = rdv.heureRendezvous.split(':').map(Number);
    const date = new Date(rdv.dateRendezvous);
    date.setHours(hour);
    date.setMinutes(minute);
    const colorPalette = ['#7bddb3', '#a2e6c9', '#6fdcc2', '#b2f1dd', '#5dc7a5'];
    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  
    return {
      Id: rdv.idRendezvous,
      Subject: rdv.nomPatient,
      StartTime: date,
      EndTime: new Date(date.getTime() + 30 * 60000), // Durée de 30 minutes par défaut
      CategoryColor: '#7bddb3',
       CssClass: 'custom-event-color'
    };
  }

  // Gère l'ouverture du popup pour l'édition d'un événement
  onPopupOpen(args: any): void {
    if (args.type === 'Editor') {
      args.duration = 400;
      args.data = { ...args.data }; // Pour forcer la mise à jour du formulaire
    }
  }
  onEventRendered(args: any): void {
    const randomColor = this.colorPalette[
      Math.floor(Math.random() * this.colorPalette.length)
    ];
    
    args.element.style.backgroundColor = randomColor;
    args.element.style.borderColor = randomColor;
    
    // Optionnel : améliorer la lisibilité du texte
    args.element.querySelector('.e-appointment-details')?.style?.setProperty('color', 'white', 'important');
  }
  
}
