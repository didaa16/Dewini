package tn.dewini.backend.Services.Don;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import tn.dewini.backend.Entities.Don.*;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.Don.CentreDeDonRepository;
import tn.dewini.backend.Repositories.Don.DonRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DonServiceImpl implements IDonService {

    private final DonRepository donRepository;
    private final UserRepo UserRepository;
    private final CentreDeDonRepository centreDeDonRepository;

    public DonServiceImpl(DonRepository donRepository, UserRepo UserRepository, CentreDeDonRepository centreDeDonRepository) {
        this.donRepository = donRepository;
        this.UserRepository = UserRepository;
        this.centreDeDonRepository = centreDeDonRepository;
    }


    @Override
    public List<Don> retrieveAllDons() {
        return donRepository.findAll();
    }

    @Override
    public Don retrieveDon(Long donId) {
        return donRepository.findById(donId).orElseThrow(
                () -> new RuntimeException("Don not found with id: " + donId)
        );
    }

    @Override
    public Don addDon(Don don) {
        CentreDeDon centre = centreDeDonRepository.findById(don.getCentre().getIdCentre())
                .orElseThrow(() -> new RuntimeException("Centre non trouvé"));
        don.setCentre(centre);
        // Initialiser la collection donneurs si elle est null
        if (don.getDonneurs() == null) {
            don.setDonneurs(new HashSet<>());
        }

        // Calcul de la description en fonction du type de don
        String description;
        if (don.getTypeDon() == TypeDon.PLAQUETTES || don.getTypeDon() == TypeDon.SANG || don.getTypeDon() == TypeDon.PLASMA) {
            double quantity = don.getQuantite();
            int nbrParticipants = (int) (quantity * 2);
            if (!centre.accepteDon(nbrParticipants)) {
                System.err.println("[ALERTE CAPACITE] Le centre " + centre.getNom()
                        + " (ID: " + centre.getIdCentre() + ") a atteint sa capacité maximale ("
                        + centre.getCapaciteActuelle() + "/" + centre.getCapaciteMaximale() + ")");

                throw new RuntimeException("Le centre sélectionné a atteint sa capacité maximale. "
                        + "Veuillez choisir un autre centre.");
            }
            description = "Dewini a besoin de " + nbrParticipants + " participants pour un don de " + don.getTypeDon() +
                    " du groupe sanguin " + don.getGrpSanguin() + " à la date " + don.getDateDon() +
                    " Merci de participer!";
            if ((double)(centre.getCapaciteActuelle() + nbrParticipants) / centre.getCapaciteMaximale() >= 0.9) {
                System.out.println("[WARNING] Le centre " + centre.getNom()
                        + " atteindra bientôt sa capacité maximale ("
                        + (centre.getCapaciteActuelle() + nbrParticipants) + "/"
                        + centre.getCapaciteMaximale() + ") après cet ajout");
            }
            centre.incrementerCapacite(nbrParticipants);
        } else {
            double quantity = don.getQuantite();
            int nbrParticipants = (int) (quantity);
            if (!centre.accepteDon(nbrParticipants)) {
                System.err.println("[ALERTE CAPACITE] Le centre " + centre.getNom()
                        + " (ID: " + centre.getIdCentre() + ") a atteint sa capacité maximale ("
                        + centre.getCapaciteActuelle() + "/" + centre.getCapaciteMaximale() + ")");

                throw new RuntimeException("Le centre sélectionné a atteint sa capacité maximale. "
                        + "Veuillez choisir un autre centre.");
            }
            description = "Dewini a besoin de " + nbrParticipants + " participants pour un don de " + don.getTypeDon() +
                    " du groupe sanguin " + don.getGrpSanguin() + " à la date " + don.getDateDon() +
                    " Merci de participer!";
            if ((double)(centre.getCapaciteActuelle() + nbrParticipants) / centre.getCapaciteMaximale() >= 0.9) {
                System.out.println("[WARNING] Le centre " + centre.getNom()
                        + " atteindra bientôt sa capacité maximale ("
                        + (centre.getCapaciteActuelle() + nbrParticipants) + "/"
                        + centre.getCapaciteMaximale() + ") après cet ajout");
            }
            centre.incrementerCapacite(nbrParticipants);
        }
        don.setDescription(description);
        // Vérification capacité critique (90%)
        // Sauvegarde du don
        Don savedDon = donRepository.save(don);

        // Mise à jour de la capacité du centre
        centreDeDonRepository.save(centre);

        return savedDon;
    }

    @Override
    public boolean verifierCapaciteCentre(int centreId) {
        CentreDeDon centre = centreDeDonRepository.findById(centreId)
                .orElseThrow(() -> new RuntimeException("Centre non trouvé"));
        return centre.peutAccepterPlusDeDons();
    }

    @Override
    public Don modifyDon(Don don) {
        if(don.getIdDon() != null && donRepository.existsById(don.getIdDon())) {
            return donRepository.save(don);
        }
        throw new RuntimeException("Don not found or missing ID");
    }

    @Override
    public void removeDon(Long donId) {
        Don don = retrieveDon(donId);
        if (don.getTypeDon() == TypeDon.PLAQUETTES || don.getTypeDon() == TypeDon.SANG || don.getTypeDon() == TypeDon.PLASMA) {
            double quantity = don.getQuantite();
            int nbrParticipants = (int) (quantity * 2);
            don.getCentre().decrementerCapacite(nbrParticipants);
        }else {
            double quantity = don.getQuantite();
            int nbrParticipants = (int) quantity;
            don.getCentre().decrementerCapacite(nbrParticipants);
        }
        // Décrémenter la capacité avant suppression
        centreDeDonRepository.save(don.getCentre());
        donRepository.deleteById(donId);
    }

    @Override
    @Transactional
    public Don addDonneurToDon(Long donId, Integer UserId) {
        Don don = retrieveDon(donId);
        User User = UserRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if association already exists
        boolean exists = don.getDonneurs().stream()
                .anyMatch(dd -> dd.getUser().getId().equals(UserId));

        if (!exists) {
            DonDonneur donDonneur = new DonDonneur();

            // Créer et initialiser l'ID composite
            DonDonneurId id = new DonDonneurId();
            id.setDonId(donId);
            id.setUserId(UserId);
            donDonneur.setId(id);

            donDonneur.setDon(don);
            donDonneur.setUser(User);
            donDonneur.setState(State.EN_ATTENTE);

            // Ajouter à la collection
            String qrContent = String.format(
                    "DonID:%d,UserID:%d,Type:%s,Centre:%s,Date:%s",
                    donId, UserId,
                    don.getTypeDon().name(),
                    don.getCentre().getNom(),
                    new SimpleDateFormat("yyyy-MM-dd").format(don.getDateDon())
            );
            donDonneur.setQrCode(generateQRCode(don, User, 200, 200));
            don.getDonneurs().add(donDonneur);
        }

        // Mettre à jour la quantité seulement si c'est un nouveau donneur
        if (!exists) {
            if (don.getTypeDon() == TypeDon.PLASMA || don.getTypeDon() == TypeDon.PLAQUETTES || don.getTypeDon() == TypeDon.SANG) {
                double newQuantite = don.getQuantite() - 0.5;
                if (newQuantite < 0) {
                    newQuantite = 0;
                }
                int nbrParticipants = (int) (newQuantite * 2);
                don.setQuantite(newQuantite);
                String description = "Dewini a besoin de " + nbrParticipants + " participants pour un don de " + don.getTypeDon() +
                        " du groupe sanguin " + don.getGrpSanguin() + " à la date " + don.getDateDon() +
                        " Merci de participer!";
                don.setDescription(description);
            } else {
                double newQuantite = don.getQuantite() - 1;
                if (newQuantite < 0) {
                    newQuantite = 0;
                }
                int nbrParticipants = (int) newQuantite;
                don.setQuantite(newQuantite);
                String description = "Dewini a besoin de " + nbrParticipants + " participants pour un don de " + don.getTypeDon() +
                        " du groupe sanguin " + don.getGrpSanguin() + " à la date " + don.getDateDon() +
                        " Merci de participer!";
                don.setDescription(description);
            }
        }

        return donRepository.save(don);
    }

    private String generateQRCode(Don don, User User, int width, int height) {
        try {
            // Créer un objet JSON avec toutes les infos nécessaires
            Map<String, Object> qrData = new HashMap<>();
            qrData.put("donId", don.getIdDon());
            qrData.put("userId", User.getId());
            qrData.put("typeDon", don.getTypeDon().name());
            qrData.put("dateDon", new SimpleDateFormat("yyyy-MM-dd HH:mm").format(don.getDateDon()));
            qrData.put("centreNom", don.getCentre().getNom());
            qrData.put("centreAdresse", don.getCentre().getAdresse());

            // Convertir en JSON string
            ObjectMapper mapper = new ObjectMapper();
            String qrContent = mapper.writeValueAsString(qrData);

            // Générer le QR code
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();

            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du QR code", e);
        }
    }

    @Override
    @Transactional
    public Don updateDonneurState(Long donId, Integer UserId, State newState) {
        if (newState != State.PRESENT && newState != State.ABSENT) {
            throw new IllegalArgumentException("Le nouvel état doit être soit PRESENT soit ABSENT");
        }

        Don don = retrieveDon(donId);
        don.getDonneurs().stream()
                .filter(dd -> dd.getUser().getId().equals(UserId))
                .findFirst()
                .ifPresentOrElse(
                        dd -> dd.setState(newState),
                        () -> { throw new RuntimeException("Cet User n'est pas associé à ce don"); }
                );

        return donRepository.save(don);
    }


    //AI
    public List<Don> getDonsPourUtilisateurProche(Integer idUser) {
        User User = UserRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("User introuvable"));

        String adresse = User.getGouvernorat();
        if (adresse != null && !adresse.isEmpty()) {
            System.out.println("Adresse User : " + adresse);
        } else {
            System.out.println("Adresse User non trouvée");
            return Collections.emptyList(); // Pas d'adresse, pas de filtrage possible
        }

        // Appel à Flask pour récupérer les adresses voisines
        List<String> adressesVoisines = getAdressesVoisines(adresse);

        // Ajout de l'adresse de l'User à la liste des zones considérées proches (optionnel)
        adressesVoisines.add(adresse);

        // Normalisation des adresses voisines (trim + lowercase)
        Set<String> adressesVoisinesNormalisees = adressesVoisines.stream()
                .map(a -> a.trim().toLowerCase())
                .collect(Collectors.toSet());

        System.out.println("Adresses voisines normalisées : " + adressesVoisinesNormalisees);

        List<Don> tousLesDons = donRepository.findAll();

        // Debug : afficher les adresses de tous les dons
        for (Don don : tousLesDons) {
            System.out.println("Don - centre : " + don.getCentre().getAdresse());
        }

        // Filtrage des dons dont le centre est situé dans un gouvernorat voisin
        return tousLesDons.stream()
                .filter(don -> {
                    String adresseCentre = don.getCentre().getAdresse();
                    return adresseCentre != null && adressesVoisinesNormalisees.contains(adresseCentre.trim().toLowerCase());
                })
                .collect(Collectors.toList());
    }


    private List<String> getAdressesVoisines(String adresse) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:5001/voisins";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> request = new HashMap<>();
        request.put("adresse", adresse);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode voisinsNode = root.path("voisins");

            List<String> voisins = new ArrayList<>();
            for (JsonNode node : voisinsNode) {
                voisins.add(node.asText());
            }

            System.out.println("Voisins reçus depuis Flask : " + voisins);
            return voisins;

        } catch (Exception e) {
            System.err.println("Erreur lors de l'appel au Services Flask : " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>(); // fallback vide
        }
    }


    // Dans DonServiceImpl.java

    private final String PYTHON_API_URL = "http://localhost:5000/predict";

    @Override
    public Map<String, Object> getDonPredictions(String typeDon, String grpSanguin, int daysAhead) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Préparer la requête
        Map<String, Object> request = new HashMap<>();
        request.put("typeDon", typeDon);
        request.put("grpSanguin", grpSanguin);
        request.put("daysAhead", daysAhead);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    PYTHON_API_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel à l'API de prédiction: " + e.getMessage());
        }
    }






}