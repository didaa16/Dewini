import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RendezvousService } from 'src/app/services/Rendezvous/rendezvous.service';

// Correct FullCalendar imports
import { EventInput, EventApi, EventClickArg, EventDropArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit {
  calendarOptions: any;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private rendezvousService: RendezvousService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initCalendar();
  }

  private initCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today addEventButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      customButtons: {
        addEventButton: {
          text: '+ Créer RDV',
          click: () => this.router.navigate(['/add-rendezvous'])
        }
      },
      events: this.fetchEvents.bind(this),
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      // eventDrop: this.handleEventDrop.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDidMount: this.handleEventRender.bind(this),
      dateClick: this.handleDateClick.bind(this),
      select: this.handleDateSelect.bind(this),
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Lundi à vendredi
        startTime: '08:00',
        endTime: '18:00'
      },
      slotMinTime: '08:00',
      slotMaxTime: '20:00',
      height: 'auto',
      nowIndicator: true,
      navLinks: true
    };
  }

  // Rest of your component methods remain the same...
  private fetchEvents(
    fetchInfo: { start: Date, end: Date },
    successCallback: (events: EventInput[]) => void,
    failureCallback: (error: Error) => void
  ) {
    this.isLoading = true;
    this.errorMessage = null;

    // this.rendezvousService.getCalendarEventsInRange(fetchInfo.start, fetchInfo.end).subscribe({
    //   next: (events) => {
    //     this.isLoading = false;
    //     successCallback(events);
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.errorMessage = 'Erreur de chargement des rendez-vous';
    //     failureCallback(err);
    //   }
    // });
  }

  // private handleEventDrop(dropInfo: EventDropArg) {
  //   this.rendezvousService.rescheduleRendezvous(
  //     parseInt(dropInfo.event.id),
  //     dropInfo.event.start as Date
  //   ).subscribe({
  //     error: () => {
  //       dropInfo.revert();
  //       this.errorMessage = 'Erreur lors du déplacement du rendez-vous';
  //     }
  //   });
  // }

  private handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Supprimer le rendez-vous de ${clickInfo.event.title} ?`)) {
      this.rendezvousService.deleteRendezvous(
        parseInt(clickInfo.event.id)
      ).subscribe({
        next: () => clickInfo.event.remove(),
        error: () => this.errorMessage = 'Erreur lors de la suppression'
      });
    }
  }

  private handleEventRender(info: { event: EventApi, el: HTMLElement }) {
    const gender = info.event.extendedProps['sexePatient'];
    info.el.classList.add(gender === 'HOMME' ? 'fc-event-homme' : 'fc-event-femme');

    // Tooltip
    info.el.title = `${info.event.title}\n${this.formatDate(info.event.start as Date)}`;
  }

  private handleDateClick(arg: { date: Date }) {
    this.router.navigate(['/add-rendezvous'], {
      state: {
        initialData: {
          dateRendezvous: arg.date.toISOString().split('T')[0],
          heureRendezvous: arg.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      }
    });
  }

  private handleDateSelect(selectInfo: DateSelectArg) {
    this.handleDateClick({ date: selectInfo.start });
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadEvents() {
    const calendarApi = this.calendarOptions.getApi();
    calendarApi.refetchEvents();
  }
}
