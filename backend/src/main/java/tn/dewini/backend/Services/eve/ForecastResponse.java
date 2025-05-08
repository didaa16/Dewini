package tn.dewini.backend.Services.eve;

public class ForecastResponse {
    private ForecastItem[] list;

    public ForecastItem[] getList() {
        return list;
    }

    public void setList(ForecastItem[] list) {
        this.list = list;
    }
}