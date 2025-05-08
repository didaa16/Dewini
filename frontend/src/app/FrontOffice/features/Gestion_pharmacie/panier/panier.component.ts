import { Component, OnInit } from '@angular/core';
import { PanierService } from 'src/app/services/panier/panier.service';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { InteractionService } from 'src/app/services/interaction/interaction.service';
import { AuthenticationService } from 'src/app/FrontOffice/features/User/services/services';
import { UserControllerService } from 'src/app/FrontOffice/features/User/services/services/user-controller.service';
import { Router } from '@angular/router';
import { User } from '../../User/services/models';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  panier: Medicament[] = [];
  nomClient: string = '';
  adresse: string = '';
  interactions: any[] = [];
  interactionError?: string;
  toastVisible: boolean = false;
  toastMessage: string = '';
  loadingUserInfo: boolean = false;

  constructor(
    public panierService: PanierService,
    private livraisonService: LivraisonService,
    private interactionService: InteractionService,
    private authService: AuthenticationService,
    private userControllerService: UserControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.panier = this.panierService.getPanier();
    this.loadUserInfo();

    if (this.panier.length > 0) {
      this.verifierInteractions();
    }
  }

  private loadUserInfo(): void {
    this.loadingUserInfo = true;
    
    // 1. D'abord essayer de récupérer depuis le token
    const connectedUser = this.userControllerService.getConnectedUser();
    if (connectedUser) {
      this.setUserInfo(connectedUser);
      this.loadingUserInfo = false;
      return;
    }

    // 2. Si pas dans le token, charger depuis l'API
    const userId = this.authService.getUserId();
    if (userId) {
      this.userControllerService.getUserById({ id: userId }).subscribe({
        next: (user: User) => {
          this.setUserInfo(user);
          this.loadingUserInfo = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du profil:', err);
          this.loadingUserInfo = false;
        }
      });
    } else {
      this.loadingUserInfo = false;
    }
  }

  private setUserInfo(user: User): void {
    this.nomClient = user.firstname || '';
    this.adresse = user.address || '';
    
    // Pour le débogage
    console.log('Informations utilisateur chargées:', {
      firstname: user.firstname,
      address: user.address
    });
  }

  verifierInteractions(): void {
    const ingredients = this.panier.map(med => med.nom.toLowerCase().trim().split(' ')[0]);
    this.interactionService.getDrugDataFromFDA(ingredients).subscribe({
      next: (res) => {
        this.interactions = res;
      },
      error: (err) => {
        this.interactionError = "Erreur lors du chargement des interactions.";
      }
    });
  }

  supprimer(id: number): void {
    this.panierService.supprimerDuPanier(id);
    this.panier = this.panierService.getPanier();
  }

  passerCommande(): void {
    if (!this.nomClient || this.nomClient.trim().length < 3 || !this.adresse || this.adresse.trim().length < 5) {
      this.afficherToast('❌ Veuillez remplir correctement le nom et l\'adresse.');
      return;
    }

    if (this.panier.length === 0) {
      this.afficherToast('❌ Votre panier est vide.');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.afficherToast('❌ Vous devez être connecté pour passer une commande.');
      this.router.navigate(['/login']);
      return;
    }

    const medicamentIds = this.panier
      .map(m => m.id)
      .filter(id => id !== undefined) as number[];

    this.livraisonService.commanderDepuisPanier({
      patientId: userId,
      nomClient: this.nomClient,
      adresse: this.adresse,
      medicamentIds
    }).subscribe({
      next: () => {
        this.afficherToast("✅ Commande passée avec succès !");
        setTimeout(() => {
          this.panierService.viderPanier();
          this.panier = [];
        }, 500);
      },
      error: (err) => {
        this.afficherToast("❌ Erreur lors de la commande.");
      }
    });
  }

  getTotal(): number {
    return this.panier.reduce((total, med) => total + (med.prix * (med.quantite || 1)), 0);
  }

  viderPanier(): void {
    this.panierService.viderPanier();
    this.panier = [];
  }

  afficherToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 5000);
  }
}