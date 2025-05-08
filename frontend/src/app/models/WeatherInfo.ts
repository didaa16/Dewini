
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';

export interface WeatherInfo {
    currentTemp: number;
    currentCondition: string;
    iconCode: string;
    tempMax: number;
    tempMin: number;
    windSpeed: number;
    hourlyForecasts: HourlyForecast[];
    dailyForecasts: DailyForecast[];
  }