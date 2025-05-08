package tn.dewini.backend.Services.Urgence;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import tn.dewini.backend.Entities.Urgence.StatutUrgence;
import tn.dewini.backend.Entities.Urgence.TypeUrgence;
import tn.dewini.backend.Entities.Urgence.Urgence;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.Urgence.UrgenceRepository;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UrgenceService implements IUrgenceService {
    private static final Logger logger = LoggerFactory.getLogger(UrgenceService.class);

    private final UrgenceRepository urgenceRepository;
    private final UserRepo utilisateurRepository;

    @Value("${infermedica.appId}")
    private String infermedicaAppId;

    @Value("${infermedica.appKey}")
    private String infermedicaAppKey;

    @Autowired
    public UrgenceService(UrgenceRepository urgenceRepository, UserRepo utilisateurRepository) {
        this.urgenceRepository = urgenceRepository;
        this.utilisateurRepository = utilisateurRepository;
    }
    @Override
    public List<Urgence> retrieveAllUrgences() {
        return urgenceRepository.findAll();
    }

    @Override
    public Urgence retrieveUrgence(Long idUrgence) {
        return urgenceRepository.findById(idUrgence).orElseThrow(() -> new RuntimeException("Urgence non trouvée"));
    }

    @Override
    public void removeUrgence(Long idUrgence) {
        urgenceRepository.deleteById(idUrgence);
    }

    public void generateExcel(HttpServletResponse response) throws Exception {
        List<Urgence> urgences = retrieveAllUrgences();
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Urgences");
        HSSFRow row = sheet.createRow(0);
        row.createCell(0).setCellValue("ID");
        row.createCell(1).setCellValue("ADDRESS PATIENT");
        row.createCell(2).setCellValue("DATE");
        row.createCell(3).setCellValue("DESCRIPTION");
        row.createCell(4).setCellValue("TYPE");
        row.createCell(5).setCellValue("STATUS");
        row.createCell(6).setCellValue("MEDECIN");
        row.createCell(7).setCellValue("PATIENT");
        row.createCell(8).setCellValue("PRIORITE");
        row.createCell(9).setCellValue("SPECIALITE");

        int dataRowIndex = 1;
        for (Urgence urgence : urgences) {
            HSSFRow dataRow = sheet.createRow(dataRowIndex);
            if (urgence.getMedecin() != null) {
                dataRow.createCell(0).setCellValue(urgence.getIdUrgence());
                dataRow.createCell(1).setCellValue(urgence.getAddressePatient());
                dataRow.createCell(2).setCellValue(urgence.getDate().toString());
                dataRow.createCell(3).setCellValue(urgence.getDescription());
                dataRow.createCell(4).setCellValue(String.valueOf(urgence.getTypeUrgence()));
                dataRow.createCell(5).setCellValue(String.valueOf(urgence.getStatutUrgence()));
                String medecin = urgence.getMedecin().getFirstname() + " " + urgence.getMedecin().getLastname();
                String patient = urgence.getPatient().getFirstname() + " " + urgence.getPatient().getLastname();
                dataRow.createCell(6).setCellValue(medecin);
                dataRow.createCell(7).setCellValue(patient);
                dataRow.createCell(8).setCellValue(urgence.getPriority());
                dataRow.createCell(9).setCellValue(urgence.getSpecialite());
                dataRowIndex++;
            } else {
                dataRow.createCell(0).setCellValue(urgence.getIdUrgence());
                dataRow.createCell(1).setCellValue(urgence.getAddressePatient());
                dataRow.createCell(2).setCellValue(urgence.getDate().toString());
                dataRow.createCell(3).setCellValue(urgence.getDescription());
                dataRow.createCell(4).setCellValue(String.valueOf(urgence.getTypeUrgence()));
                dataRow.createCell(5).setCellValue(String.valueOf(urgence.getStatutUrgence()));
                String medecin = "N/A";
                String patient = urgence.getPatient().getFirstname() + " " + urgence.getPatient().getLastname();
                dataRow.createCell(6).setCellValue(medecin);
                dataRow.createCell(7).setCellValue(patient);
                dataRow.createCell(8).setCellValue(urgence.getPriority());
                dataRow.createCell(9).setCellValue(urgence.getSpecialite());
                dataRowIndex++;
            }
        }

        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();
        ops.close();
    }

    @Override
    public Urgence desaffecterUtilisateurFromUrgence(Long idUrgence) {
        Urgence urgence = urgenceRepository.findById(idUrgence)
                .orElseThrow(() -> new RuntimeException("Urgence not found with id: " + idUrgence));
        urgence.setMedecin(null);
        urgence.setStatutUrgence(StatutUrgence.En_Attente);
        return urgenceRepository.save(urgence);
    }

    @Override
    public List<Urgence> retrieveAllUrgencesSortedByPriority() {
        return urgenceRepository.findAllOrderByPriority();
    }

    @Override
    public List<Urgence> retrieveAllUrgencesWithoutTreated() {
        return urgenceRepository.findAllWithoutTreated();
    }

    @Override
    public Urgence addUrgence(Urgence u) {
        u.setPatient(utilisateurRepository.findById(u.getPatient().getId()).get());
        u.setDate(new Date());
        u.setStatutUrgence(StatutUrgence.En_Attente);

        // Predict priority
        String priority = predictPriority(u.getDescription());
        u.setPriority(priority);

        // Predict specialty using Infermedica
        String specialite = predictSpecialty(u.getDescription(), u.getPatient());
        u.setSpecialite(specialite);

        return urgenceRepository.save(u);
    }

    @Override
    public Urgence modifyUrgence(Urgence updatedUrgence, Long idUrgence) {
        Urgence existingUrgence = urgenceRepository.findById(idUrgence)
                .orElseThrow(() -> new RuntimeException("Urgence not found with id: " + idUrgence));

        if (updatedUrgence.getPatient() != null) existingUrgence.setPatient(updatedUrgence.getPatient());
        if (updatedUrgence.getMedecin() != null) existingUrgence.setMedecin(updatedUrgence.getMedecin());
        if (updatedUrgence.getDate() != null) existingUrgence.setDate(updatedUrgence.getDate());

        if (updatedUrgence.getDescription() != null && !updatedUrgence.getDescription().isEmpty()) {
            existingUrgence.setDescription(updatedUrgence.getDescription());

            // Predict priority
            String priority = predictPriority(updatedUrgence.getDescription());
            existingUrgence.setPriority(priority);

            // Predict specialty using Infermedica
            String specialite = predictSpecialty(updatedUrgence.getDescription(), existingUrgence.getPatient());
            existingUrgence.setSpecialite(specialite);
        }

        if (updatedUrgence.getAddressePatient() != null) existingUrgence.setAddressePatient(updatedUrgence.getAddressePatient());
        if (updatedUrgence.getTypeUrgence() != null) existingUrgence.setTypeUrgence(updatedUrgence.getTypeUrgence());
        if (updatedUrgence.getStatutUrgence() != null) existingUrgence.setStatutUrgence(updatedUrgence.getStatutUrgence());
        if (updatedUrgence.getConsultationUrgente() != null) existingUrgence.setConsultationUrgente(updatedUrgence.getConsultationUrgente());
        return urgenceRepository.save(existingUrgence);
    }

    private String predictPriority(String description) {
        // Quick check for specific symptoms
        if (description.toLowerCase().contains("paralysie") || description.toLowerCase().contains("paralysme")) {
            return "Moyen"; // Override for paralysis unless acute
        }
        if (description.toLowerCase().contains("douleurs au niveau des yeux") ||
                description.toLowerCase().contains("douleurs au niveau du nez")) {
            return "Faible";
        }

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(5000);
        RestTemplate restTemplate = new RestTemplate(requestFactory);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(
                Map.of("description", description),
                headers
        );

        try {
            PriorityResponse response = restTemplate.postForObject(
                    "http://localhost:5000/predict",
                    entity,
                    PriorityResponse.class
            );
            return response != null ? response.getPriority() : "Moyen";
        } catch (ResourceAccessException e) {
            logger.error("Priority prediction service timeout: {}", e.getMessage());
            throw new RuntimeException("Priority prediction service timeout: " + e.getMessage());
        } catch (HttpClientErrorException e) {
            logger.error("Priority prediction API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Priority prediction API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        }
    }

    private String predictSpecialty(String description, User patient) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(5000);
        RestTemplate restTemplate = new RestTemplate(requestFactory);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("App-Id", infermedicaAppId);
        headers.set("App-Key", infermedicaAppKey);

        // Determine sex from patient if available, default to "male"
        String patientSex = patient != null && patient.getGender() != null ? patient.getGender().toLowerCase() : "male";
        if (!patientSex.equals("male") && !patientSex.equals("female")) {
            patientSex = "male"; // Fallback to male if invalid
        }

        // Extract age from description if possible, default to 35
        int patientAge = extractAgeFromDescription(description);
        if (patientAge <= 0) {
            patientAge = 35; // Default age
        }


        // Check for specific symptoms to provide a fallback
        boolean hasCardiacSymptoms = description.toLowerCase().contains("douleur thoracique") &&
                (description.toLowerCase().contains("sueurs froides") ||
                        description.toLowerCase().contains("oppression") ||
                        description.toLowerCase().contains("douleur qui irradie") ||
                        description.toLowerCase().contains("nausées"));
        boolean hasNeurologicalSymptoms = description.toLowerCase().contains("paralysie") ||
                description.toLowerCase().contains("paralysme");
        boolean hasEntSymptoms = description.toLowerCase().contains("douleurs au niveau des yeux") ||
                description.toLowerCase().contains("douleurs au niveau du nez");

        // Correct common misspellings
        String correctedDescription = correctDescription(description);
        logger.info("Corrected description: {}", correctedDescription);

        // Step 1: Parse description to extract symptoms
        Map<String, Object> parseBody = new HashMap<>();
        parseBody.put("text", correctedDescription);
        parseBody.put("language", "fr"); // Specify French language
        HttpEntity<Map<String, Object>> parseEntity = new HttpEntity<>(parseBody, headers);

        List<Map<String, String>> evidence = parseSymptoms(parseEntity, restTemplate, patientAge);
        if (evidence.isEmpty()) {
            // Retry with simplified description
            String simplifiedDescription = simplifyDescription(correctedDescription);
            logger.info("Retrying with simplified description: {}", simplifiedDescription);
            parseBody.put("text", simplifiedDescription);
            evidence = parseSymptoms(parseEntity, restTemplate, patientAge);
        }

        // Step 2: Call /diagnosis with parsed symptoms
        Map<String, Object> diagnosisBody = new HashMap<>();
        diagnosisBody.put("sex", patientSex);
        diagnosisBody.put("age", Map.of("value", patientAge));
        diagnosisBody.put("evidence", evidence);

        HttpEntity<Map<String, Object>> diagnosisEntity = new HttpEntity<>(diagnosisBody, headers);

        try {
            logger.info("Sending request to Infermedica /diagnosis endpoint with payload: {}", diagnosisBody);
            ResponseEntity<Map> diagnosisResponse = restTemplate.postForEntity(
                    "https://api.infermedica.com/v3/diagnosis",
                    diagnosisEntity,
                    Map.class
            );
            Map<String, Object> responseBody = diagnosisResponse.getBody();
            logger.info("Received response from Infermedica /diagnosis endpoint: {}", responseBody);

            if (responseBody != null && responseBody.containsKey("conditions")) {
                List<Map<String, Object>> conditions = (List<Map<String, Object>>) responseBody.get("conditions");
                if (!conditions.isEmpty()) {
                    String specialty = (String) conditions.get(0).getOrDefault("specialty", "Généraliste");
                    return specialty != null ? specialty : "Généraliste";
                }
            }
            logger.warn("No conditions found in /diagnosis response, defaulting to fallback");
            return selectFallbackSpecialty(hasCardiacSymptoms, hasNeurologicalSymptoms, hasEntSymptoms);
        } catch (ResourceAccessException e) {
            logger.error("Infermedica /diagnosis service timeout: {}", e.getMessage());
            return selectFallbackSpecialty(hasCardiacSymptoms, hasNeurologicalSymptoms, hasEntSymptoms);
        } catch (HttpClientErrorException e) {
            logger.error("Infermedica /diagnosis API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return selectFallbackSpecialty(hasCardiacSymptoms, hasNeurologicalSymptoms, hasEntSymptoms);
        }
    }

    private List<Map<String, String>> parseSymptoms(HttpEntity<Map<String, Object>> parseEntity, RestTemplate restTemplate, int patientAge) {
        try {
            // Update the payload to include age
            Map<String, Object> parseBody = parseEntity.getBody();
            if (parseBody != null) {
                parseBody.put("age", Map.of("value", patientAge));
            }
            HttpEntity<Map<String, Object>> updatedEntity = new HttpEntity<>(parseBody, parseEntity.getHeaders());

            logger.info("Sending request to Infermedica /parse endpoint with payload: {}", updatedEntity.getBody());
            ResponseEntity<Map> parseResponse = restTemplate.postForEntity(
                    "https://api.infermedica.com/v3/parse",
                    updatedEntity,
                    Map.class
            );
            Map<String, Object> parseResult = parseResponse.getBody();
            logger.info("Received response from Infermedica /parse endpoint: {}", parseResult);

            if (parseResult != null && parseResult.containsKey("mentions")) {
                List<Map<String, Object>> mentions = (List<Map<String, Object>>) parseResult.get("mentions");
                return mentions.stream()
                        .filter(m -> m.containsKey("id") && m.containsKey("choice_id"))
                        .map(m -> Map.of(
                                "id", (String) m.get("id"),
                                "choice_id", (String) m.get("choice_id")
                        ))
                        .collect(Collectors.toList());
            } else {
                logger.warn("No mentions found in /parse response, proceeding with empty evidence");
                return new ArrayList<>();
            }
        } catch (ResourceAccessException e) {
            logger.error("Infermedica /parse service timeout: {}", e.getMessage());
            return new ArrayList<>();
        } catch (HttpClientErrorException e) {
            logger.error("Infermedica /parse API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return new ArrayList<>();
        }
    }
    private String simplifyDescription(String description) {
        // Simplify by removing non-symptom text (e.g., age, context)
        String simplified = description.toLowerCase();
        simplified = simplified.replaceAll("\\b\\d{1,3}\\s*(ans|années|years old)\\b", "");
        simplified = simplified.replaceAll("j['’]ai\\s*\\d{1,3}\\s*ans", "");
        // Keep core symptoms
        if (simplified.contains("paralysie")) {
            return "paralysie du pied";
        } else if (simplified.contains("douleur thoracique")) {
            return "douleur thoracique, sueurs froides, nausées";
        } else if (simplified.contains("douleurs au niveau des yeux")) {
            return "douleur oculaire";
        }
        return simplified.trim();
    }
    private String selectFallbackSpecialty(boolean hasCardiacSymptoms, boolean hasNeurologicalSymptoms, boolean hasEntSymptoms) {
        if (hasCardiacSymptoms) {
            return "Cardiologie";
        } else if (hasNeurologicalSymptoms) {
            return "Neurologie";
        } else if (hasEntSymptoms) {
            return "ORL";
        } else {
            return "Généraliste";
        }
    }

    private String correctDescription(String description) {
        String corrected = description;
        // Correct "paralysme" to "paralysie"
        corrected = corrected.replaceAll("(?i)paralysme", "paralysie");
        // Correct "thorasique" to "thoracique"
        corrected = corrected.replaceAll("(?i)thorasique", "thoracique");
        // Add more corrections as needed
        return corrected;
    }

    private int extractAgeFromDescription(String description) {
        try {
            Pattern agePattern = Pattern.compile("\\b(\\d{1,3})\\s*(ans|années|years old)\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = agePattern.matcher(description);
            if (matcher.find()) {
                return Integer.parseInt(matcher.group(1));
            }
        } catch (NumberFormatException e) {
            logger.warn("Failed to parse age from description: {}", e.getMessage());
        }
        return 0; // Return 0 if age not found or parsing fails
    }

    static class PriorityResponse {
        private String priority;

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }
    }

    public Long getTreatedUrgencesCount(String period) {
        StatutUrgence statut = StatutUrgence.Traite;
        Calendar calendar = Calendar.getInstance();
        Date now = new Date();
        calendar.setTime(now);

        Date startDate;
        Date endDate;

        switch (period.toLowerCase()) {
            case "day":
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                startDate = calendar.getTime();
                calendar.set(Calendar.HOUR_OF_DAY, 23);
                calendar.set(Calendar.MINUTE, 59);
                calendar.set(Calendar.SECOND, 59);
                endDate = calendar.getTime();
                break;
            case "week":
                calendar.set(Calendar.DAY_OF_WEEK, calendar.getFirstDayOfWeek());
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                startDate = calendar.getTime();
                calendar.add(Calendar.WEEK_OF_YEAR, 1);
                calendar.add(Calendar.SECOND, -1);
                endDate = calendar.getTime();
                break;
            case "month":
                calendar.set(Calendar.DAY_OF_MONTH, 1);
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                startDate = calendar.getTime();
                calendar.add(Calendar.MONTH, 1);
                calendar.add(Calendar.SECOND, -1);
                endDate = calendar.getTime();
                break;
            default:
                throw new IllegalArgumentException("Période invalide : " + period);
        }

        return urgenceRepository.countByStatutUrgenceAndDateBetween(statut, startDate, endDate);
    }

    public Map<TypeUrgence, Long> getUrgenceTypeDistribution() {
        List<Object[]> results = urgenceRepository.countUrgencesByType();
        Map<TypeUrgence, Long> distribution = new HashMap<>();
        for (Object[] result : results) {
            TypeUrgence type = (TypeUrgence) result[0];
            Long count = (Long) result[1];
            distribution.put(type, count);
        }
        return distribution;
    }

    public Map<StatutUrgence, Long> getUrgenceStatutRatio() {
        List<Object[]> results = urgenceRepository.countUrgencesByStatut();
        Map<StatutUrgence, Long> ratio = new HashMap<>();
        for (Object[] result : results) {
            StatutUrgence statut = (StatutUrgence) result[0];
            Long count = (Long) result[1];
            ratio.put(statut, count);
        }
        return ratio;
    }

    @Override
    public List<Urgence> findByTypeUrgence(TypeUrgence typeUrgence) {
        return urgenceRepository.findUrgenceByTypeUrgence(typeUrgence);
    }

    @Override
    public List<Urgence> retrieveUrgenceByUser(Integer idUser){
        return urgenceRepository.getUrgencesByPatientId(idUser);
    }
}