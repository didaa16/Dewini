package tn.dewini.backend.Controllers.Urgence;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tn.dewini.backend.Entities.Urgence.StatutUrgence;
import tn.dewini.backend.Entities.Urgence.TypeUrgence;
import tn.dewini.backend.Entities.Urgence.Urgence;
import tn.dewini.backend.Services.Urgence.IUrgenceService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "Gestion Urgence")
@RestController
@AllArgsConstructor
@RequestMapping("/urgence")
public class UrgenceRestController {
    @Autowired
    IUrgenceService urgenceService;

    // http://localhost:8089/urgence/retrieve-all-urgences
    @GetMapping("/retrieve-all-urgences")
    public List<Urgence> getUrgences() {
        List<Urgence> listUrgences = urgenceService.retrieveAllUrgencesSortedByPriority();
        return listUrgences;
    }

    // http://localhost:8089/urgence/retrieve-urgence/8
    @GetMapping("/retrieve-urgence/{urgence-id}")
    public Urgence retrieveUrgence(@PathVariable("urgence-id") Long urgenceId) {
        Urgence urgence = urgenceService.retrieveUrgence(urgenceId);
        return urgence;
    }

    // http://localhost:8081/api/v1/urgence/retrieve-urgence-by-user/2
    @GetMapping("/retrieve-urgence-by-user/{user-id}")
    public List<Urgence> retrieveUrgenceByPatient(@PathVariable("user-id") Integer urgenceId) {
        List <Urgence> u = urgenceService.retrieveUrgenceByUser(urgenceId);
        return u;
    }

    // http://localhost:8089/urgence/remove-urgence/{urgence-id}
    @DeleteMapping("/remove-urgence/{urgence-id}")
    public void removeUrgence(@PathVariable("urgence-id") Long urgenceId) {
        urgenceService.removeUrgence(urgenceId);
    }

    // http://localhost:8089/urgence/excel
    @GetMapping("/excel")
    public void generateExcelReport(HttpServletResponse response) throws Exception{

        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=Urgences.xls";
        response.setHeader(headerKey, headerValue);
        urgenceService.generateExcel(response);

        response.flushBuffer();
    }


    // http://localhost:8089/urgence/desaffercter-utilisateur-from-urgence/{urgence-id}
    @PutMapping("/desaffercter-utilisateur-from-urgence/{urgence-id}")
    public void desaffercterUtilisateurFromUrgence(@PathVariable("urgence-id") Long urgenceId) {
        urgenceService.desaffecterUtilisateurFromUrgence(urgenceId);
    }

    // http://localhost:8089/urgence/retrieve-all-urgences-without-treated
    @GetMapping("/retrieve-all-urgences-without-treated")
    public List<Urgence> getUrgencesWithoutTreated() {
        List<Urgence> listUrgences = urgenceService.retrieveAllUrgencesWithoutTreated();
        return listUrgences;
    }



    // Classe DTO pour mapper la réponse JSON de l'API Flask
    static class PriorityResponse {
        private String priority;

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }
    }

    // http://localhost:8089/urgence/prioritize-urgence
    @PostMapping("/prioritize-urgence")
    public String prioritizeUrgence(@RequestBody Map<String, String> requestBody) {
        String description = requestBody.get("description");
        if (description == null || description.isEmpty()) {
            return "Description is required";
        }

        String url = "http://localhost:5000/predict";
        RestTemplate restTemplate = new RestTemplate();

        // Créer les headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Créer l'objet contenant la description
        Map<String, String> request = Map.of("description", description);

        // Créer la requête HTTP avec corps + headers
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        try {
            // Envoyer la requête
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "Error while predicting priority: " + e.getMessage();
        }
    }


    //http://localhost:8089/urgence/add-urgence
    @PostMapping("/add-urgence")
    public Urgence addUrgence(@RequestBody Urgence urgence) {
        return urgenceService.addUrgence(urgence);
    }

    // http://localhost:8089/Back/urgence/modify-urgence
    @PutMapping("/modify-urgence/{urgence-id}")
    public Urgence modifyUrgence(@PathVariable("urgence-id") Long urgenceId, @RequestBody Urgence urgence) {
        return urgenceService.modifyUrgence(urgence, urgenceId);
    }


    //STATS
    @GetMapping("/stats/traitees")
    public ResponseEntity<Long> getTreatedUrgencesCount(@RequestParam String period) {
        return ResponseEntity.ok(urgenceService.getTreatedUrgencesCount(period));
    }

    @GetMapping("/stats/repartition-type")
    public ResponseEntity<Map<TypeUrgence, Long>> getUrgenceTypeDistribution() {
        return ResponseEntity.ok(urgenceService.getUrgenceTypeDistribution());
    }

    @GetMapping("/stats/ratio-statut")
    public ResponseEntity<Map<StatutUrgence, Long>> getUrgenceStatutRatio() {
        return ResponseEntity.ok(urgenceService.getUrgenceStatutRatio());
    }


    // CARTE THERMIQUE ET STATISTIQUES AVANCÉES
    @GetMapping("/urgences/domicile/coordinates")
    public ResponseEntity<List<Map<String, Object>>> getUrgencesDomicileCoordinates() {
        List<Urgence> urgences = urgenceService.findByTypeUrgence(TypeUrgence.A_Domicile);

        List<Map<String, Object>> result = urgences.stream()
                .map(urgence -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", urgence.getIdUrgence());
                    map.put("description", urgence.getDescription());
                    map.put("statut", urgence.getStatutUrgence().name());
                    map.put("date", urgence.getDate());
                    map.put("address", urgence.getAddressePatient());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


}