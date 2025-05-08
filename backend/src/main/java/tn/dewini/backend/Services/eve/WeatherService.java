package tn.dewini.backend.Services.eve;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey="#################";

    private static final String CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric";
    private static final String FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}&units=metric";

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        System.out.println("Clé API OpenWeatherMap injectée : " + apiKey);
    }

    public WeatherInfo getWeather(double latitude, double longitude) {
        // Récupérer la météo actuelle
        String currentUrl = CURRENT_WEATHER_URL.replace("{lat}", String.valueOf(latitude))
                .replace("{lon}", String.valueOf(longitude))
                .replace("{apiKey}", apiKey);
        WeatherData currentWeather = restTemplate.getForObject(currentUrl, WeatherData.class);

        if (currentWeather == null || currentWeather.getWeather() == null || currentWeather.getWeather().length == 0) {
            throw new RuntimeException("Impossible de récupérer la météo actuelle.");
        }

        WeatherInfo weatherInfo = new WeatherInfo();
        weatherInfo.setCurrentTemp(currentWeather.getMain().getTemp());
        weatherInfo.setCurrentCondition(currentWeather.getWeather()[0].getMain());
        weatherInfo.setIconCode(currentWeather.getWeather()[0].getIcon());
        weatherInfo.setTempMax(currentWeather.getMain().getTempMax());
        weatherInfo.setTempMin(currentWeather.getMain().getTempMin());
        weatherInfo.setWindSpeed(currentWeather.getWind().getSpeed() * 3.6); // Convertir m/s en km/h

        // Récupérer les prévisions (horaires et journalières)
        String forecastUrl = FORECAST_URL.replace("{lat}", String.valueOf(latitude))
                .replace("{lon}", String.valueOf(longitude))
                .replace("{apiKey}", apiKey);
        ForecastResponse forecastResponse = restTemplate.getForObject(forecastUrl, ForecastResponse.class);

        if (forecastResponse == null || forecastResponse.getList() == null) {
            throw new RuntimeException("Impossible de récupérer les prévisions météo.");
        }

        // Prévisions horaires (prochaines 5 heures)
        List<HourlyForecast> hourlyForecasts = new ArrayList<>();
        for (int i = 0; i < 5 && i < forecastResponse.getList().length; i++) {
            ForecastItem item = forecastResponse.getList()[i];
            Instant instant = Instant.ofEpochSecond(item.getDt());
            String time = instant.atZone(ZoneId.systemDefault()).toLocalTime().toString().substring(0, 5); // Format HH:mm
            HourlyForecast hourlyForecast = new HourlyForecast(time, item.getMain().getTemp(), item.getWeather()[0].getMain(), item.getWeather()[0].getIcon());
            hourlyForecasts.add(hourlyForecast);
        }
        weatherInfo.setHourlyForecasts(hourlyForecasts.toArray(new HourlyForecast[0]));

        // Prévisions journalières (prochains 4 jours)
        Map<String, List<ForecastItem>> dailyData = new HashMap<>();
        for (ForecastItem item : forecastResponse.getList()) {
            String date = Instant.ofEpochSecond(item.getDt()).atZone(ZoneId.systemDefault()).toLocalDate().toString();
            dailyData.computeIfAbsent(date, k -> new ArrayList<>()).add(item);
        }

        List<DailyForecast> dailyForecasts = new ArrayList<>();
        int dayCount = 0;
        for (Map.Entry<String, List<ForecastItem>> entry : dailyData.entrySet()) {
            if (dayCount >= 4) break;
            List<ForecastItem> dayItems = entry.getValue();
            double minTemp = dayItems.stream().mapToDouble(item -> item.getMain().getTempMin()).min().orElse(0);
            double maxTemp = dayItems.stream().mapToDouble(item -> item.getMain().getTempMax()).max().orElse(0);
            String condition = dayItems.get(0).getWeather()[0].getMain();
            String icon = dayItems.get(0).getWeather()[0].getIcon();
            String dayLabel = dayCount == 0 ? "Auj." : LocalDate.parse(entry.getKey()).getDayOfWeek().toString().substring(0, 3) + ".";
            dailyForecasts.add(new DailyForecast(dayLabel, minTemp, maxTemp, condition, icon));
            dayCount++;
        }
        weatherInfo.setDailyForecasts(dailyForecasts.toArray(new DailyForecast[0]));

        return weatherInfo;
    }

    public WeatherData getWeatherForAdjustment(double latitude, double longitude) {
        String url = CURRENT_WEATHER_URL.replace("{lat}", String.valueOf(latitude))
                .replace("{lon}", String.valueOf(longitude))
                .replace("{apiKey}", apiKey);
        WeatherData weatherData = restTemplate.getForObject(url, WeatherData.class);
        if (weatherData == null) {
            throw new RuntimeException("Impossible de récupérer la météo pour l'ajustement.");
        }
        return weatherData;
    }
}

// Classes pour les données météo détaillées




// Classes pour la réponse de l'API OpenWeatherMap (météo actuelle)








// Classes pour la réponse de l'API OpenWeatherMap (prévisions)


