package tn.dewini.backend.Services.eve;

public class DailyForecast {
    private String day;
    private double minTemp;
    private double maxTemp;
    private String condition;
    private String icon;

    public DailyForecast(String day, double minTemp, double maxTemp, String condition, String icon) {
        this.day = day;
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.condition = condition;
        this.icon = icon;
    }

    public String getDay() {
        return day;
    }

    public double getMinTemp() {
        return minTemp;
    }

    public double getMaxTemp() {
        return maxTemp;
    }

    public String getCondition() {
        return condition;
    }

    public String getIcon() {
        return icon;
    }
}
