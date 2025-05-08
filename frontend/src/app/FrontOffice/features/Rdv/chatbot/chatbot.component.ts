// src/app/FrontOffice/featuresRendezVous/chatbot/chatbot.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput: string = '';
  chatResponse: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {} // 🟢 CORRECTION

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.loading = true;


    const payload = { message: this.userInput };

    this.http.post<{ response: string }>('http://localhost:8081/api/v1/api/ask', payload).subscribe({
      next: (response) => {
        this.chatResponse = response.response || 'No response.';
        this.loading = false;
      },
      error: (error) => {
        this.chatResponse = 'Erreur lors de la communication avec MedBot.';
        this.loading = false;
        console.error(error);
      }
    });

    this.userInput = '';
  }
}
