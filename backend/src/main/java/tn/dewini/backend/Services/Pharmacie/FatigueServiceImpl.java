package tn.dewini.backend.Services.Pharmacie;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@AllArgsConstructor
public class FatigueServiceImpl implements IFatigueService {

    private final Cloudinary cloudinary;
    private final IWhatsAppService whatsAppService;

    @Override
    public String uploadPdfEtEnvoyerWhatsApp(MultipartFile file, String numeroPatient) {
        try {
            // 🔒 Vérification type MIME
            if (!file.getContentType().equals("application/pdf")) {
                throw new IllegalArgumentException("Seuls les fichiers PDF sont autorisés.");
            }

            // 🧠 Construction nom de fichier unique avec extension .pdf
            String publicId = "rapport_fatigue_" + System.currentTimeMillis() + ".pdf";

            // 📤 Upload sur Cloudinary avec type RAW (fichier brut)
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "raw",
                    "type", "upload",
                    "access_mode", "public", // ← rend le lien accessible
                    "folder", "fatigue-reports",
                    "use_filename", true,
                    "unique_filename", false,
                    "public_id", "rapport_fatigue_" + System.currentTimeMillis() + ".pdf" // ← ici le .pdf
            ));




            // 🔗 Lien accessible
            String lien = (String) uploadResult.get("secure_url");

            // ✅ Envoi WhatsApp
            whatsAppService.envoyerLienPdf(numeroPatient, lien);

            return lien;

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du rapport : " + e.getMessage(), e);
        }
    }

    public String uploadImageEtEnvoyerWhatsApp(MultipartFile file, String numeroPatient) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "image",
                    "folder", "recommendations", // Dossier spécifique
                    "use_filename", true,
                    "unique_filename", true,
                    "public_id", "recommandation_" + System.currentTimeMillis()
            ));

            String lien = (String) uploadResult.get("secure_url");

            // Envoi WhatsApp
            whatsAppService.envoyerLienPdf(numeroPatient, lien);
            return lien;

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'image : " + e.getMessage());
        }
    }


}
