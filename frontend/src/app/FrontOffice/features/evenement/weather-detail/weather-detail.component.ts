import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Evenement } from '../../../../models/evenement';
import { EvenementService } from '../../../../services/evenement-service.service';
import { PlanningService } from '../../../../services/planning-service.service';
import { Router } from '@angular/router';
import { Lieu } from '../../../../models/Lieu';
import { LieuService } from '../../../../services/lieu.service';
import { DateSuggestionResponse } from '../../../../models/DateSuggestionResponse ';
import { EventDateSuggestionRequest } from '../../../../models/EventDateSuggestionRequest';
import Chart from 'chart.js/auto';
import { interval, Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { WeatherInfo } from '../../../../models/WeatherInfo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-weather-detail',
  templateUrl: './weather-detail.component.html',
  styleUrls: ['./weather-detail.component.css']
})
export class WeatherDetailComponent implements OnInit {
  evenement: Evenement | null = null;
  weatherData: WeatherInfo | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evenementService: EvenementService,
    private snackBar: MatSnackBar
  ) {}
 
  ngOnInit() {
    // Récupérer l'ID de l'événement depuis la route
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Charger les détails de l'événement
      this.evenementService.retrieveEvenementById(id).subscribe({
        next: (evenement) => {
          this.evenement = evenement;
          // Charger les données météo
          this.loadWeatherData(id);
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l’événement : ', error);
          this.snackBar.open('Erreur lors du chargement de l’événement.', 'OK', { duration: 5000 });
        }
      });
    }
  }

  loadWeatherData(id: number) {
    this.evenementService.getWeatherForEvent(id).subscribe({
      next: (weather) => {
        this.weatherData = weather;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la récupération de la météo.', 'OK', { duration: 5000 });
        console.error('Erreur : ', error);
      }
    });
  }

  formatHour(time: string): string {
    const [hour] = time.split(':');
    return `${hour}h`;
  }

  getTempWidth(minTemp: number, maxTemp: number): string {
    const range = maxTemp - minTemp;
    return `${range * 5}px`;
  }

  getTempBarColor(minTemp: number, maxTemp: number): string {
    const avgTemp = (minTemp + maxTemp) / 2;
    if (avgTemp < 15) return '#87CEEB';
    if (avgTemp < 25) return '#FFD700';
    return '#FF4500';
  }

  goBack() {
    this.router.navigate(['/dashboard/evenements']);
  }
}