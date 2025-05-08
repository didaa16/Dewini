package tn.dewini.backend.Configs.Urgence;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration ("urgence web socket")
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final LocationWebSocketHandler locationWebSocketHandler = new LocationWebSocketHandler();

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(locationWebSocketHandler, "/ws/location")
                .setAllowedOrigins("*");
    }
}