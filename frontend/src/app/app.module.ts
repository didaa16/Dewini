import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CodeInputModule } from 'angular-code-input';
import { WebcamModule } from 'ngx-webcam';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService } from '@syncfusion/ej2-angular-schedule';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { ConsultationModule } from './FrontOffice/features/consultation/consultation.module';
import { AppComponent } from './app.component';
import { ListUrgencesComponent } from './FrontOffice/features/urgence/list-urgences/list-urgences.component';
import { CreateUrgenceComponent } from './FrontOffice/features/urgence/create-urgence/create-urgence.component';
import { DetailsUrgenceComponent } from './FrontOffice/features/urgence/details-urgence/details-urgence.component';
import { NotFoundComponent } from './FrontOffice/core/not-found/not-found.component';
import { MeetingUrgenceComponent } from './FrontOffice/features/urgence/meeting-urgence/meeting-urgence.component';
import { DonComponent } from './BackOffice/features/dons/don/don.component';
import { DossierMedicaleListComponent } from './FrontOffice/features/dossierMedicale/dossier-medicale-list/dossier-medicale-list.component';
import { DossierMedicaleFormComponent } from './FrontOffice/features/dossierMedicale/dossier-medicale-form/dossier-medicale-form.component';
import { DossierMedicaleDetailComponent } from './FrontOffice/features/dossierMedicale/dossier-medicale-detail/dossier-medicale-detail.component';
import { ConsultationListComponent } from './FrontOffice/features/consultation/consultation-list/consultation-list.component';
import { ConsultationFormComponent } from './FrontOffice/features/consultation/consultation-form/consultation-form.component';
import { ConsultationDetailComponent } from './FrontOffice/features/consultation/consultation-detail/consultation-detail.component';
import { OrdonnanceListComponent } from './FrontOffice/features/Gestion_pharmacie/ordonnance-list/ordonnance-list.component';
import { AddOrdonnanceComponent } from './FrontOffice/features/Gestion_pharmacie/add-ordonnance/add-ordonnance.component';
import { EditOrdonnanceComponent } from './FrontOffice/features/Gestion_pharmacie/edit-ordonnance/edit-ordonnance.component';
import { CommandeListComponent } from './FrontOffice/features/Gestion_pharmacie/commande-list/commande-list.component';
import { MedicamentListComponent } from './FrontOffice/features/Gestion_pharmacie/medicament-list/medicament-list.component';
import { AddMedicamentComponent } from './FrontOffice/features/Gestion_pharmacie/add-medicament/add-medicament.component';
import { EditMedicamentComponent } from './FrontOffice/features/Gestion_pharmacie/edit-medicament/edit-medicament.component';
import { MedicamentDetailComponent } from './FrontOffice/features/Gestion_pharmacie/medicament-detail/medicament-detail.component';
import { EditCommandeComponent } from './FrontOffice/features/Gestion_pharmacie/edit-commande/edit-commande.component';
import { NavbarComponent } from './FrontOffice/core/navbar/navbar.component';
import { HomeComponent } from './FrontOffice/core/home/home.component';
import { FormulaireComponent } from './FrontOffice/features/Rdv/formulaire/formulaire.component';
import { ListRendezvousComponent } from './FrontOffice/features/Rdv/list-rendezvous/list-rendezvous.component';
import { ListReponseComponent } from './FrontOffice/features/Rdv/list-reponse/list-reponse.component';
import { FormReponseComponent } from './FrontOffice/features/Rdv/form-reponse/form-reponse.component';
import { ChatbotComponent } from './FrontOffice/features/Rdv/chatbot/chatbot.component';
import { ListReponseAdminComponent } from './BackOffice/features/Rdv/list-reponse-admin/list-reponse-admin.component';
import { FormReponseAdminComponent } from './BackOffice/features/Rdv/form-reponse-admin/form-reponse-admin.component';
import { MedicalCalendarComponent } from './FrontOffice/features/Rdv/medical-calendar/medical-calendar.component';
import { MapTrackingComponent } from './FrontOffice/features/urgence/map-tracking/map-tracking.component';
import { FooterComponent } from './FrontOffice/core/footer/footer.component';
import { MedicamentAdminListComponent } from './BackOffice/features/Pharmacie/medicament-admin-list/medicament-admin-list.component';
import { AddMedicamentAdminComponent } from './BackOffice/features/Pharmacie/add-medicament-admin/add-medicament-admin.component';
import { EditMedicamentAdminComponent } from './BackOffice/features/Pharmacie/edit-medicament-admin/edit-medicament-admin.component';
import { MedicamentDetailAdminComponent } from './BackOffice/features/Pharmacie/medicament-detail-admin/medicament-detail-admin.component';
import { OrdonnanceAdminListComponent } from './BackOffice/features/Pharmacie/ordonnance-admin-list/ordonnance-admin-list.component';
import { AddOrdonnanceAdminComponent } from './BackOffice/features/Pharmacie/add-ordonnance-admin/add-ordonnance-admin.component';
import { EditOrdonnanceAdminComponent } from './BackOffice/features/Pharmacie/edit-ordonnance-admin/edit-ordonnance-admin.component';
import { CommandeAdminListComponent } from './BackOffice/features/Pharmacie/commande-admin-list/commande-admin-list.component';
import { AddCommandeAdminComponent } from './BackOffice/features/Pharmacie/add-commande-admin/add-commande-admin.component';
import { EditCommandeAdminComponent } from './BackOffice/features/Pharmacie/edit-commande-admin/edit-commande-admin.component';
import { DetailCommandeAdminComponent } from './BackOffice/features/Pharmacie/detail-commande-admin/detail-commande-admin.component';
import { PanierComponent } from './FrontOffice/features/Gestion_pharmacie/panier/panier.component';
import { WishlistComponent } from './FrontOffice/features/Gestion_pharmacie/wishlist/wishlist.component';
import { PharmaciesMapComponent } from './FrontOffice/features/Gestion_pharmacie/pharmacies-map/pharmacies-map.component';
import { UploadOrdonnanceComponent } from './FrontOffice/features/Gestion_pharmacie/upload-ordonnance/upload-ordonnance.component';
import { TestFatigueComponent } from './FrontOffice/features/Gestion_pharmacie/test-fatigue/test-fatigue.component';
import { DashboardHomeComponent } from './BackOffice/core/dashboard-home/dashboard-home.component';
import { DashboardSidebarComponent } from './BackOffice/core/dashboard-sidebar/dashboard-sidebar.component';
import { AffichageDonsComponent } from './FrontOffice/features/Don/affichage-dons/affichage-dons.component';
import { DashboardFooterComponent } from './BackOffice/core/dashboard-footer/dashboard-footer.component';
import { ConsultationDashboardComponent } from './BackOffice/features/Consultation/consultation-dashboard/consultation-dashboard.component';
import { DossierMedicaleDashboardComponent } from './BackOffice/features/Consultation/dossier-medicale-dashboard/dossier-medicale-dashboard.component';
import { UrgenceDashboardComponent } from './BackOffice/features/urgence/urgence-dashboard/urgence-dashboard.component';
import { DoctorTrackingComponent } from './FrontOffice/features/urgence/doctor-tracking/doctor-tracking.component';
import { DashboardHeaderComponent } from './BackOffice/core/dashboard-header/dashboard-header.component';
import { DashboardNotFoundComponent } from './BackOffice/core/dashboard-not-found/dashboard-not-found.component';
import { NotificationComponent } from './FrontOffice/core/notification/notification.component';
import { UrgenceStatsComponent } from './BackOffice/features/urgence/urgence-stats/urgence-stats.component';
import { UrgenceMapStatsComponent } from './BackOffice/features/urgence/urgence-map-stats/urgence-map-stats.component';
import { AffichageDonsDashboardComponent } from './BackOffice/features/dons/affichage-dons-dashboard/affichage-dons-dashboard.component';
import { EditDonComponent } from './BackOffice/features/dons/edit-don/edit-don.component';
import { CentreDeDonComponent } from './BackOffice/features/centre/centre-de-don/centre-de-don.component';
import { AppelDonneursComponent } from './BackOffice/features/dons/appel-donneurs/appel-donneurs.component';
import { QrScannerComponent } from './FrontOffice/features/Don/qr-scanner/qr-scanner.component';
import { ChartPredictionsComponent } from './BackOffice/features/dons/chart-predictions/chart-predictions.component';
import { DonsStatsComponent } from './BackOffice/features/dons/dons-stats/dons-stats.component';
import { LoginComponent } from './FrontOffice/features/User/login/login.component';
import { RegisterComponent } from './FrontOffice/features/User/pages/register/register.component';
import { ActivateAccountComponent } from './FrontOffice/features/User/pages/activate-account/activate-account.component';
import { NotfoundComponent } from './FrontOffice/features/User/pages/notfound/notfound.component';
import { TemplatefrontofficeComponent } from './FrontOffice/features/User/templatefrontoffice/templatefrontoffice.component';
import { ProfileComponent } from './FrontOffice/features/User/profile/profile.component';
import { ResetPasswordComponent } from './FrontOffice/features/User/pages/reset-password/reset-password.component';
import { UserProfileComponent } from './FrontOffice/features/User/pages/user-profile/user-profile.component';
import { UpdateUserComponent } from './FrontOffice/features/User/pages/update-user/update-user.component';
import { UserListComponent } from './BackOffice/features/User/user-list/user-list.component';
import { ForgetPasswordComponent } from './FrontOffice/features/User/pages/forget-password/forget-password.component';
import { ProfiluserrComponent } from './BackOffice/features/User/Profilee/profiluserr/profiluserr.component';
import { FaceAuthComponent } from './FrontOffice/features/User/pages/face-auth/face-auth.component';
import { UpdatebackComponent } from './BackOffice/features/User/updateback/updateback.component';
import { AdminStatsComponent } from './BackOffice/features/User/admin-stats/admin-stats.component';
import { StatistiquesMedicamentsComponent } from './BackOffice/features/Pharmacie/statistiques-medicaments/statistiques-medicaments.component';
import { TruncatePipe } from './truncate.pipe';
import { GroupByPipe } from './shared/pipes/group-by.pipe';
import { EventDetailComponent } from './FrontOffice/features/evenement/event-detail-component/event-detail-component.component';
import { EventListComponent } from './FrontOffice/features/evenement/event-list-component/event-list-component.component';
import { EvenementAdminComponent } from './FrontOffice/features/evenement/evenement-admin/evenement-admin.component';
import { ParticipationComponent } from './FrontOffice/features/evenement/participation/participation.component';
import { InscriptionFormComponent } from './FrontOffice/features/evenement/inscription-form/inscription-form.component';
import { WeatherDetailComponent } from './FrontOffice/features/evenement/weather-detail/weather-detail.component';
import { PredictionComponentComponent } from './FrontOffice/features/evenement/prediction-component/prediction-component.component';
import { ParticipationsComponent } from './FrontOffice/features/evenement/participations/participations.component';
import { ParticipantListComponent } from './FrontOffice/features/evenement/participant-list/participant-list.component';
import { ParticipantFormComponent } from './FrontOffice/features/evenement/participant-form/participant-form.component';
import { CalendrierComponent } from './FrontOffice/features/Rdv/calendrier/calendrier.component';
import {NgChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    AppComponent,
    ListUrgencesComponent,
    CreateUrgenceComponent,
    DetailsUrgenceComponent,
    NotFoundComponent,
    MeetingUrgenceComponent,
    DonComponent,
    DossierMedicaleListComponent,
    DossierMedicaleFormComponent,
    DossierMedicaleDetailComponent,
    ConsultationListComponent,
    ConsultationFormComponent,
    ConsultationDetailComponent,
    OrdonnanceListComponent,
    AddOrdonnanceComponent,
    EditOrdonnanceComponent,
    CommandeListComponent,
    MedicamentListComponent,
    AddMedicamentComponent,
    EditMedicamentComponent,
    MedicamentDetailComponent,
    EditCommandeComponent,
    NavbarComponent,
    HomeComponent,
    FormulaireComponent,
    ListRendezvousComponent,
    ListReponseComponent,
    FormReponseComponent,
    ChatbotComponent,
    ListReponseAdminComponent,
    FormReponseAdminComponent,
    MedicalCalendarComponent,
    MapTrackingComponent,
    FooterComponent,
    MedicamentAdminListComponent,
    AddMedicamentAdminComponent,
    EditMedicamentAdminComponent,
    MedicamentDetailAdminComponent,
    OrdonnanceAdminListComponent,
    AddOrdonnanceAdminComponent,
    EditOrdonnanceAdminComponent,
    CommandeAdminListComponent,
    AddCommandeAdminComponent,
    EditCommandeAdminComponent,
    DetailCommandeAdminComponent,
    PanierComponent,
    WishlistComponent,
    PharmaciesMapComponent,
    UploadOrdonnanceComponent,
    TestFatigueComponent,
    DashboardHomeComponent,
    DashboardSidebarComponent,
    AffichageDonsComponent,
    DashboardFooterComponent,
    ConsultationDashboardComponent,
    DossierMedicaleDashboardComponent,
    UrgenceDashboardComponent,
    DoctorTrackingComponent,
    DashboardHeaderComponent,
    DashboardNotFoundComponent,
    NotificationComponent,
    UrgenceStatsComponent,
    UrgenceMapStatsComponent,
    AffichageDonsDashboardComponent,
    EditDonComponent,
    CentreDeDonComponent,
    AppelDonneursComponent,
    QrScannerComponent,
    ChartPredictionsComponent,
    DonsStatsComponent,
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    NotfoundComponent,
    TemplatefrontofficeComponent,
    ProfileComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    UpdateUserComponent,
    UserListComponent,
    ForgetPasswordComponent,
    ProfiluserrComponent,
    FaceAuthComponent,
    UpdatebackComponent,
    AdminStatsComponent,
    StatistiquesMedicamentsComponent,
    TruncatePipe,
    GroupByPipe,
    EventDetailComponent,
    EventListComponent,
    EvenementAdminComponent,
    ParticipationComponent,
    InscriptionFormComponent,
    WeatherDetailComponent,
    PredictionComponentComponent,
    ParticipationsComponent,
    ParticipantListComponent,
    ParticipantFormComponent,
    CalendrierComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    GoogleMapsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AppRoutingModule,
    ConsultationModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ZXingScannerModule,
    CodeInputModule,
    WebcamModule,
    ToastModule,
    ConfirmDialogModule,
    MessagesModule,
    ScheduleModule,
    RecurrenceEditorModule,
    DialogModule,
    NgChartsModule,
    FullCalendarModule
  ],
  providers: [
    DatePipe,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    MonthAgendaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Commented-out imports (preserved for reference, can be uncommented if needed):
// import { ToastrModule } from 'ngx-toastr/toastr/toastr.module';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
// import { CodeInputModule } from 'angular-code-input';
// import { ScheduleModule, RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';
