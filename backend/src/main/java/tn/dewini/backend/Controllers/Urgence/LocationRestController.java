package tn.dewini.backend.Controllers.Urgence;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tn.dewini.backend.Configs.Urgence.LocationWebSocketHandler;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/location")
public class LocationRestController {
    private static Set<WebSocketSession> sessions = new HashSet<>();

    @PostMapping("/update")
    public void updateLocation(@RequestBody Location location) throws IOException {
        String message = "{\"lat\": " + location.getLat() + ", \"lng\": " + location.getLng() + "}";

        for (WebSocketSession session : LocationWebSocketHandler.getSessions()) {
            session.sendMessage(new TextMessage(message));
        }
    }

    static class Location {
        private double lat;
        private double lng;

        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }
        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
    }
}
