import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ConsultationService} from "../../User/services/services/consultation.service";
import { FullCalendarComponent } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste'
    },
    weekends: true,
    editable: false,
    selectable: false,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    views: {
      timeGrid: {
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      }
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    slotDuration: '00:30:00',
    firstDay: 1,
  };

  loading = false;
  error = '';

  constructor(
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadConsultations();
  }

  loadConsultations() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.consultationService.getAllConsultations().subscribe({
      next: (consultations) => {
        if (!consultations || consultations.length === 0) {
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const events = consultations
          .filter(consultation => {
            if (!consultation.date || !consultation.heure) {
              console.log('Skipping consultation due to missing date/time:', consultation);
              return false;
            }
            return true;
          })
          .map(consultation => {
            try {
              const startStr = this.createDateTimeString(consultation.date, consultation.heure);
              const endStr = this.calculateEndTime(consultation.date, consultation.heure);

              return {
                id: consultation.id_consultation?.toString(),
                title: `Patient: ${consultation.patient?.firstname || 'N/A'}`,
                start: startStr,
                end: endStr,
                backgroundColor: consultation.rapport ? '#28a745' : '#ffc107',
                borderColor: consultation.rapport ? '#28a745' : '#ffc107',
                extendedProps: {
                  doctor: consultation.medecin?.firstname || 'N/A',
                  patient: consultation.patient?.firstname || 'N/A',
                  rapport: consultation.rapport || '',
                  recommendations: consultation.recommandations || ''
                }
              };
            } catch (error) {
              console.error('Error creating event:', error);
              return null;
            }
          })
          .filter(event => event !== null) as EventInput[];

        if (this.calendarComponent && this.calendarComponent.getApi()) {
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(events);
        } else {
          this.calendarOptions = {
            ...this.calendarOptions,
            events: events
          };
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
        this.error = 'Erreur lors du chargement des consultations';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private createDateTimeString(date: string, time: string): string {
    try {
      if (!date || !time) {
        throw new Error('Date or time is missing');
      }

      date = date.trim();
      time = time.trim();

      const dateParts = date.split('/');
      if (dateParts.length !== 3) {
        throw new Error('Invalid date format');
      }

      const [day, month, year] = dateParts;
      if (!day || !month || !year || isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
        throw new Error('Invalid date format');
      }

      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const formattedTime = time.padStart(5, '0');
      return `${formattedDate}T${formattedTime}:00`;
    } catch (error) {
      console.error('Error in createDateTimeString:', error);
      throw error;
    }
  }

  private calculateEndTime(date: string, time: string): string {
    try {
      const startDate = new Date(this.createDateTimeString(date, time));
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      return endDate.toISOString();
    } catch (error) {
      console.error('Error in calculateEndTime:', error);
      throw error;
    }
  }

  handleEventClick(info: any) {
    const event = info.event;
    alert(`
Détails de la Consultation:
-------------------------
Patient: ${event.extendedProps.patient}
Médecin: ${event.extendedProps.doctor}
Rapport: ${event.extendedProps.rapport || 'Non disponible'}
Recommandations: ${event.extendedProps.recommendations || 'Non disponibles'}
    `);
  }
}
