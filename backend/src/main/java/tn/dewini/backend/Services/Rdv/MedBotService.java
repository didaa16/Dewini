package tn.dewini.backend.Services.Rdv;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class MedBotService {

    public String getMedBotResponse(String userInput) {
        // Vérification de l'input utilisateur
        if (userInput == null || userInput.trim().isEmpty()) {
            return "Erreur: L'input de l'utilisateur ne peut pas être vide.";
        }

        try {
            // Échapper les caractères spéciaux, notamment les guillemets doubles
            String escapedUserInput = escapeInput(userInput);

            // Définir la commande pour exécuter le script Python
            String command = "python C:/Users/Lenovo/Desktop/NEWPI/pi_Medical_app/backend/chat_bot/medbot.py \"" + escapedUserInput + "\"";

            // Créer le processus pour exécuter le script Python
            ProcessBuilder processBuilder = new ProcessBuilder("cmd", "/c", command);
            processBuilder.redirectErrorStream(true);

            // Démarrer le processus et capturer la sortie du script Python
            Process process = processBuilder.start();

            // Lire la sortie du processus
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            // Attendre la fin du processus
            process.waitFor();

            // Retourner la réponse du script Python
            return output.toString().trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur: Impossible d'obtenir la réponse.";
        }
    }

    // Méthode pour échapper les caractères spéciaux
    private String escapeInput(String input) {
        return input.replace("\"", "\\\"") // Échapper les guillemets doubles
                .replace("\\", "\\\\") // Échapper les antislashs
                .replace("\n", "\\n")   // Échapper les retours à la ligne
                .replace("\r", "\\r");  // Échapper les retours chariot
    }
}
