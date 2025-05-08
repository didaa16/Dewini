package tn.dewini.backend.Services.eve;

// Classes pour les données météo détaillées
public class WeatherInfo {
    private double currentTemp;
    private String currentCondition;
    private String iconCode;
    private double tempMax;
    private double tempMin;
    private double windSpeed;
    private HourlyForecast[] hourlyForecasts;
    private DailyForecast[] dailyForecasts;

    public double getCurrentTemp() {
        return currentTemp;
    }

    public void setCurrentTemp(double currentTemp) {
        this.currentTemp = currentTemp;
    }

    public String getCurrentCondition() {
        return currentCondition;
    }

    public void setCurrentCondition(String currentCondition) {
        this.currentCondition = currentCondition;
    }

    public String getIconCode() {
        return iconCode;
    }

    public void setIconCode(String iconCode) {
        this.iconCode = iconCode;
    }

    public double getTempMax() {
        return tempMax;
    }

    public void setTempMax(double tempMax) {
        this.tempMax = tempMax;
    }

    public double getTempMin() {
        return tempMin;
    }

    public void setTempMin(double tempMin) {
        this.tempMin = tempMin;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public HourlyForecast[] getHourlyForecasts() {
        return hourlyForecasts;
    }

    public void setHourlyForecasts(HourlyForecast[] hourlyForecasts) {
        this.hourlyForecasts = hourlyForecasts;
    }

    public DailyForecast[] getDailyForecasts() {
        return dailyForecasts;
    }

    public void setDailyForecasts(DailyForecast[] dailyForecasts) {
        this.dailyForecasts = dailyForecasts;
    }
}