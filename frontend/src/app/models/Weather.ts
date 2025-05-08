export class Weather {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
  
    constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
      this.temperature = temperature;
      this.description = description;
      this.humidity = humidity;
      this.windSpeed = windSpeed;
    }
  }
  