package tn.dewini.backend.Services.eve;

import org.springframework.stereotype.Service;

@Service
public class LieuSelectionService {

   /* @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    WeatherService weatherService;

    @Value("${weather.api.key}")
    private String apiKey;

    public Salle choisirSalleAdaptee(Evenement evenement) {
        String ville = evenement.getLieu().getNom(); // à adapter si nom ≠ ville
        Double temperature = weatherService.getTemperature(ville);
        int nbParticipants = evenement.getParticipations().size();

        if (temperature == null) return null;

        List<Salle> sallesDispo = salleRepository.findByCapaciteGreaterThanEqual(nbParticipants);

        // Filtrage par météo
        if (temperature < 15) {
            sallesDispo = sallesDispo.stream().filter(Salle::isChauffage).toList();
        } else if (temperature > 30) {
            sallesDispo = sallesDispo.stream().filter(Salle::isClimatisee).toList();
        }

        // Trouver la plus proche
        return sallesDispo.stream()
                .sorted(Comparator.comparingDouble(salle ->
                        calculerDistance(
                                evenement.getCoordonnees().getLatitude(),
                                evenement.getCoordonnees().getLongitude(),
                                salle.getLieu().getCoordonnees().getLatitude(),
                                salle.getLieu().getCoordonnees().getLongitude()
                        )))
                .findFirst()
                .orElse(null);
    }

    private double calculerDistance(double lat1, double lon1, double lat2, double lon2) {
        // Logique pour calculer la distance entre deux points géographiques (lat, lon)
        final int R = 6371; // rayon de la Terre en km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c; // en km
        return distance;
    }
    public static class WeatherResponse {
        private Current current;
        public Current getCurrent() { return current; }
        public void setCurrent(Current current) { this.current = current; }
    }

    public static class Current {
        private float temp_c;
        public float getTempC() { return temp_c; }
        public void setTempC(float temp_c) { this.temp_c = temp_c; }
    }
    public Double getTemperatureEvenement(Evenement evenement) {
        String ville = evenement.getLieu().getNom();
        return weatherService.getTemperature(ville);
    }*/
}
