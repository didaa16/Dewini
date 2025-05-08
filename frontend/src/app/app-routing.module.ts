import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from "./FrontOffice/features/evenement/event-list-component/event-list-component.component";
import { EventDetailComponent } from "./FrontOffice/features/evenement/event-detail-component/event-detail-component.component";

// 🧑‍⚕️ Front Office Components
import { HomeComponent } from './FrontOffice/core/home/home.component';
import { NotFoundComponent } from './FrontOffice/core/not-found/not-found.component';
import { FormulaireComponent } from './FrontOffice/features/Rdv/formulaire/formulaire.component';
import { ListRendezvousComponent } from './FrontOffice/features/Rdv/list-rendezvous/list-rendezvous.component';
import { ListReponseComponent } from './FrontOffice/features/Rdv/list-reponse/list-reponse.component';
import { FormReponseComponent } from './FrontOffice/features/Rdv/form-reponse/form-reponse.component';
import { ChatbotComponent } from './FrontOffice/features/Rdv/chatbot/chatbot.component';
import { MedicalCalendarComponent } from './FrontOffice/features/Rdv/medical-calendar/medical-calendar.component';
import { ListUrgencesComponent } from './FrontOffice/features/urgence/list-urgences/list-urgences.component';
import { CreateUrgenceComponent } from './FrontOffice/features/urgence/create-urgence/create-urgence.component';
import { DetailsUrgenceComponent } from './FrontOffice/features/urgence/details-urgence/details-urgence.component';
import { MeetingUrgenceComponent } from './FrontOffice/features/urgence/meeting-urgence/meeting-urgence.component';
import { MapTrackingComponent } from './FrontOffice/features/urgence/map-tracking/map-tracking.component';
import { DoctorTrackingComponent } from './FrontOffice/features/urgence/doctor-tracking/doctor-tracking.component';
import { ConsultationListComponent } from './FrontOffice/features/consultation/consultation-list/consultation-list.component';
import { ConsultationFormComponent } from './FrontOffice/features/consultation/consultation-form/consultation-form.component';
import { ConsultationDetailComponent } from './FrontOffice/features/consultation/consultation-detail/consultation-detail.component';
import { ConsultationVideoComponent } from './FrontOffice/features/consultation/consultation-video/consultation-video.component';
import { CalendarComponent } from './FrontOffice/features/consultation/calendar/calendar.component';
import { DossierMedicaleListComponent } from './FrontOffice/features/dossierMedicale/dossier-medicale-list/dossier-medicale-list.component';
import { DossierMedicaleFormComponent } from './FrontOffice/features/dossierMedicale/dossier-medicale-form/dossier-medicale-form.component';
import { DossierMedicaleDetailComponent } from './FrontOffice/features/dossierMedicale/dossier-medicale-detail/dossier-medicale-detail.component';
import { AffichageDonsComponent } from './FrontOffice/features/Don/affichage-dons/affichage-dons.component';
import { QrScannerComponent } from './FrontOffice/features/Don/qr-scanner/qr-scanner.component';
import { LoginComponent } from './FrontOffice/features/User/login/login.component';
import { RegisterComponent } from './FrontOffice/features/User/pages/register/register.component';
import { ActivateAccountComponent } from './FrontOffice/features/User/pages/activate-account/activate-account.component';
import { ForgetPasswordComponent } from './FrontOffice/features/User/pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './FrontOffice/features/User/pages/reset-password/reset-password.component';
import { UserProfileComponent } from './FrontOffice/features/User/pages/user-profile/user-profile.component';
import { UpdateUserComponent } from './FrontOffice/features/User/pages/update-user/update-user.component';
import { FaceAuthComponent } from './FrontOffice/features/User/pages/face-auth/face-auth.component';
import { TemplatefrontofficeComponent } from './FrontOffice/features/User/templatefrontoffice/templatefrontoffice.component';
import { OrdonnanceListComponent } from './FrontOffice/features/Gestion_pharmacie/ordonnance-list/ordonnance-list.component';
import { AddOrdonnanceComponent } from './FrontOffice/features/Gestion_pharmacie/add-ordonnance/add-ordonnance.component';
import { EditOrdonnanceComponent } from './FrontOffice/features/Gestion_pharmacie/edit-ordonnance/edit-ordonnance.component';
import { CommandeListComponent } from './FrontOffice/features/Gestion_pharmacie/commande-list/commande-list.component';
import { MedicamentListComponent } from './FrontOffice/features/Gestion_pharmacie/medicament-list/medicament-list.component';
import { AddMedicamentComponent } from './FrontOffice/features/Gestion_pharmacie/add-medicament/add-medicament.component';
import { EditMedicamentComponent } from './FrontOffice/features/Gestion_pharmacie/edit-medicament/edit-medicament.component';
import { MedicamentDetailComponent } from './FrontOffice/features/Gestion_pharmacie/medicament-detail/medicament-detail.component';
import { EditCommandeComponent } from './FrontOffice/features/Gestion_pharmacie/edit-commande/edit-commande.component';
import { PanierComponent } from './FrontOffice/features/Gestion_pharmacie/panier/panier.component';
import { WishlistComponent } from './FrontOffice/features/Gestion_pharmacie/wishlist/wishlist.component';
import { PharmaciesMapComponent } from './FrontOffice/features/Gestion_pharmacie/pharmacies-map/pharmacies-map.component';
import { TestFatigueComponent } from './FrontOffice/features/Gestion_pharmacie/test-fatigue/test-fatigue.component';

// 🛠️ Back Office Components
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
import { DashboardHomeComponent } from './BackOffice/core/dashboard-home/dashboard-home.component';
import { UrgenceDashboardComponent } from './BackOffice/features/urgence/urgence-dashboard/urgence-dashboard.component';
import { ConsultationDashboardComponent } from './BackOffice/features/Consultation/consultation-dashboard/consultation-dashboard.component';
import { DossierMedicaleDashboardComponent } from './BackOffice/features/Consultation/dossier-medicale-dashboard/dossier-medicale-dashboard.component';
import { DonComponent } from './BackOffice/features/dons/don/don.component';
import { AffichageDonsDashboardComponent } from './BackOffice/features/dons/affichage-dons-dashboard/affichage-dons-dashboard.component';
import { EditDonComponent } from './BackOffice/features/dons/edit-don/edit-don.component';
import { AppelDonneursComponent } from './BackOffice/features/dons/appel-donneurs/appel-donneurs.component';
import { CentreDeDonComponent } from './BackOffice/features/centre/centre-de-don/centre-de-don.component';
import { UserListComponent } from './BackOffice/features/User/user-list/user-list.component';
import { ProfiluserrComponent } from './BackOffice/features/User/Profilee/profiluserr/profiluserr.component';
import { UpdatebackComponent } from './BackOffice/features/User/updateback/updateback.component';
import { AdminStatsComponent } from './BackOffice/features/User/admin-stats/admin-stats.component';

// Guards
import { AdminGuard } from './BackOffice/features/User/guards/admin.guard';
import { CommonModule } from "@angular/common";
import { EvenementAdminComponent } from './FrontOffice/features/evenement/evenement-admin/evenement-admin.component';
import { ParticipationComponent } from './FrontOffice/features/evenement/participation/participation.component';
import { ParticipationsComponent } from './FrontOffice/features/evenement/participations/participations.component';
import { InscriptionFormComponent } from './FrontOffice/features/evenement/inscription-form/inscription-form.component';
import { WeatherDetailComponent } from './FrontOffice/features/evenement/weather-detail/weather-detail.component';
import { PredictionComponentComponent } from './FrontOffice/features/evenement/prediction-component/prediction-component.component';
import { ParticipantListComponent } from './FrontOffice/features/evenement/participant-list/participant-list.component';
import { ParticipantFormComponent } from './FrontOffice/features/evenement/participant-form/participant-form.component';
import { path } from 'd3';

const routes: Routes = [
  // 🌍 Front Office Routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent},

  { path: 'events/:id', component: EventDetailComponent , children:[{path: 'weather/:id', component: WeatherDetailComponent,outlet:'weatherOutlet'}]},
  { path: 'add-rendezvous', component: FormulaireComponent },
  { 
    path: 'edit-rendezvous/:id', 
    component: FormulaireComponent,
    data: { mode: 'edit' }
  },  
  { path: 'list-rendezvous', component: ListRendezvousComponent },
  { path: 'medcalendar', component: MedicalCalendarComponent },
  { path: 'chat', component: ChatbotComponent },
  { path: 'ordonnances', component: OrdonnanceListComponent },
  { path: 'ajouter', component: AddOrdonnanceComponent },
  { path: 'edit/:id', component: EditOrdonnanceComponent },
  { path: 'commandes', component: CommandeListComponent },
  { path: 'medicaments', component: MedicamentListComponent },
  { path: 'medicaments/ajouter', component: AddMedicamentComponent },
  { path: 'medicaments/modifier/:id', component: EditMedicamentComponent },
  { path: 'medicaments/detail/:id', component: MedicamentDetailComponent },
  { path: 'edit-commande/:id', component: EditCommandeComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'pharmacies-map', component: PharmaciesMapComponent },
  { path: 'test-fatigue', component: TestFatigueComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'oauth2/redirect', component: LoginComponent },
  { path: 'user-profile/:userId', component: UserProfileComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'update-user/:userId', component: UpdateUserComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'face-auth', component: FaceAuthComponent },
  { path: 'page', component: TemplatefrontofficeComponent },
  { path: 'consultations', component: ConsultationListComponent },
  { path: 'consultations/calendar', component: CalendarComponent },
  { path: 'consultations/new', component: ConsultationFormComponent },
  { path: 'consultations/edit/:id', component: ConsultationFormComponent },
  { path: 'consultations/:id/video', component: ConsultationVideoComponent },
  { path: 'consultations/:id', component: ConsultationDetailComponent },
  { path: 'dossiers', component: DossierMedicaleListComponent },
  { path: 'dossiers/new', component: DossierMedicaleFormComponent },
  { path: 'dossiers/edit/:id', component: DossierMedicaleFormComponent },
  { path: 'dossiers/:id', component: DossierMedicaleDetailComponent },
  { path: 'listUrgences', component: ListUrgencesComponent },
  { path: 'addUrgence', component: CreateUrgenceComponent },
  { path: 'addUrgence/:idUrgence', component: CreateUrgenceComponent },
  { path: 'urgenceDetails/:idUrgence', component: DetailsUrgenceComponent },
  { path: 'meetingUrgence', component: MeetingUrgenceComponent },
  { path: 'mapTracking', component: MapTrackingComponent },
  { path: 'doctorTracking', component: DoctorTrackingComponent },
  { path: 'donation', component: AffichageDonsComponent },
  { path: 'scanner', component: QrScannerComponent },
  { path: 'inscription/:id', component: InscriptionFormComponent },
  { path: 'ordonnances/ajouter', component: AddOrdonnanceComponent },
  { path: 'weather/:id', component: WeatherDetailComponent },

  // 🔒 Back Office Routes
  {
    path: 'dashboard',
    component: DashboardHomeComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'admin/stats', pathMatch: 'full' },
      { path: 'medicaments', component: MedicamentAdminListComponent },
      { path: 'medicaments/ajouter', component: AddMedicamentAdminComponent },
      { path: 'medicaments/modifier/:id', component: EditMedicamentAdminComponent },
      { path: 'medicaments/detail/:id', component: MedicamentDetailAdminComponent },
      { path: 'ordonnances', component: OrdonnanceAdminListComponent },
      { path: 'ordonnances/ajouter', component: AddOrdonnanceAdminComponent },
      { path: 'ordonnances/modifier/:id', component: EditOrdonnanceAdminComponent },
      { path: 'commandes', component: CommandeAdminListComponent },
      { path: 'repondre/:id', component: FormReponseComponent },
      { path: 'commandes/ajouter', component: AddCommandeAdminComponent },
      { path: 'commandes/modifier/:id', component: EditCommandeAdminComponent },
      { path: 'commandes/detail/:id', component: DetailCommandeAdminComponent },
      { path: 'admin/users', component: UserListComponent },
      { path: 'user-profile/:userId', component: ProfiluserrComponent },
      { path: 'update-user/:userId', component: UpdatebackComponent },
      { path: 'admin/stats', component: AdminStatsComponent },
      { path: 'centres', component: CentreDeDonComponent },
      { path: 'urgenceDashboard', component: UrgenceDashboardComponent },
      { path: 'consultations', component: ConsultationDashboardComponent },
      { path: 'dossiers-medicaux', component: DossierMedicaleDashboardComponent },
      { path: 'dons', component: DonComponent },
      { path: 'dons/:id/appel', component: AppelDonneursComponent },
      { path: 'dons/:id/edit', component: EditDonComponent },
      { path: 'affichageDons', component: AffichageDonsDashboardComponent },
      { path: 'repondre/:id', component: FormReponseComponent },
      { path: 'liste-reponses', component: ListReponseComponent },
      { path: 'evenements', component: EvenementAdminComponent },
      { path: 'participations', component: ParticipationsComponent },
      { path: 'liste-reponses', component: ListReponseComponent },
      { path: 'weather/:id', component: WeatherDetailComponent },
      { path: 'prediction/:id', component: PredictionComponentComponent },
      { path: 'evenement/:id/participants', component: ParticipationComponent },
      { path: 'participation/:id', component: ParticipationComponent },
      { path: 'evenement/:eventId/participant', component: ParticipantListComponent },
      { path: 'evenement/:eventId/participant/:participantId/editer', component: ParticipantFormComponent },
      { path: 'evenement/:eventId/participant/nouveau', component: ParticipantFormComponent, data: { title: 'Ajouter un participant', mode: 'create' } },
    





    ]
  },

  // ❌ 404 Route
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
