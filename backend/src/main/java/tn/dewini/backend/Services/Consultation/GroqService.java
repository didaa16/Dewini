package tn.dewini.backend.Services.Consultation;

import tn.dewini.backend.Entities.Consultation.DossierMedicale;
import java.net.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;

@Service
public class GroqService {

    private static final String API_KEY = "#################";
    private static final String BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String analyserDossier(DossierMedicale dossier) {
        String prompt = String.format("""
            Analyse le dossier médical suivant et donne une synthèse sous forme de :

            1. Points d'attention ⚠️
            2. Recommandations personnalisées 🩺
            3. Prochaines étapes suggérées 📅

            --- Dossier Médical ---
            Antécédents médicaux : %s
            Allergies : %s
            Traitements en cours : %s
            """,
                dossier.getAntecedentsMedicaux(),
                dossier.getAllergies(),
                dossier.getTraitementsEnCours()
        );

        try {
            // Création propre du corps JSON avec org.json
            JSONObject message = new JSONObject();
            message.put("role", "user");
            message.put("content", prompt);

            JSONArray messages = new JSONArray();
            messages.put(message);

            JSONObject requestJson = new JSONObject();
            requestJson.put("model", "llama3-8b-8192");
            requestJson.put("messages", messages);
            requestJson.put("temperature", 0.5);
            requestJson.put("max_tokens", 800);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL))
                    .header("Authorization", "Bearer " + API_KEY)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson.toString()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String responseBody = response.body();

            System.out.println("Réponse Groq brute : " + responseBody);

            JSONObject responseJson = new JSONObject(responseBody);

            if (responseJson.has("choices")) {
                return responseJson.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");
            } else if (responseJson.has("error")) {
                String errorMessage = responseJson.getJSONObject("error").getString("message");
                System.err.println("Erreur Groq : " + errorMessage);
                return "Erreur Groq : " + errorMessage;
            } else {
                System.err.println("Réponse inattendue : " + responseBody);
                return "Réponse inattendue reçue de Groq.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de l'analyse du dossier médical.";
        }
    }
}
