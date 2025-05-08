import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarComponent } from './calendar/calendar.component';
import { ConsultationVideoComponent } from './consultation-video/consultation-video.component';

@NgModule({
  declarations: [
    CalendarComponent,
    ConsultationVideoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      { path: 'calendar', component: CalendarComponent },
      { path: 'video', component: ConsultationVideoComponent }
    ])
  ],
  exports: [
    CalendarComponent,
    ConsultationVideoComponent
  ]
})
export class ConsultationModule { }
