package tn.dewini.backend.Services.eve;

public class HourlyForecast {
    private String time;
    private double temp;
    private String condition;
    private String icon;

    public HourlyForecast(String time, double temp, String condition, String icon) {
        this.time = time;
        this.temp = temp;
        this.condition = condition;
        this.icon = icon;
    }

    public String getTime() {
        return time;
    }

    public double getTemp() {
        return temp;
    }

    public String getCondition() {
        return condition;
    }

    public String getIcon() {
        return icon;
    }
}
