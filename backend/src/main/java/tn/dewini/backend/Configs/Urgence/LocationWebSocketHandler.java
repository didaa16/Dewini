package tn.dewini.backend.Configs.Urgence;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashSet;
import java.util.Set;

public class LocationWebSocketHandler extends TextWebSocketHandler {

    private static final Set<WebSocketSession> sessions = new HashSet<>();

    public static Set<WebSocketSession> getSessions() {
        return sessions;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
    }
}