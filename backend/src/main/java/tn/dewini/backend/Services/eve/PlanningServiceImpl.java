package tn.dewini.backend.Services.eve;

import tn.dewini.backend.Entities.eve.DateSuggestionResponse;
import tn.dewini.backend.Entities.eve.DateSuggestionRequest;
import tn.dewini.backend.Entities.eve.Evenement;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;

@Service
public class PlanningServiceImpl implements PlanningService {

    private static final String FASTAPI_URL = "http://localhost:8001/recommend_date";
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PlanningServiceImpl.class);

    private final RestTemplate restTemplate;

    public PlanningServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public DateSuggestionResponse suggestBestDate(Evenement request) {
        log.info("Received Evenement request: {}", request);
        validateRequest(request);

        try {
            DateSuggestionRequest apiRequest = buildApiRequest(request);
            log.info("Sending to FastAPI: {}", apiRequest);

            HttpEntity<DateSuggestionRequest> httpEntity = new HttpEntity<>(
                    apiRequest,
                    createHeaders()
            );

            ResponseEntity<DateSuggestionResponse> response = restTemplate.exchange(
                    FASTAPI_URL,
                    HttpMethod.POST,
                    httpEntity,
                    DateSuggestionResponse.class
            );

            log.info("Raw FastAPI response: status={}, body={}", response.getStatusCode(), response.getBody());
            return validateResponse(response);

        } catch (DateTimeParseException e) {
            log.error("Invalid date format in event data", e);
            throw new RuntimeException("Invalid date format in event data", e);
        } catch (Exception e) {
            log.error("API call failed", e);
            throw new RuntimeException("Failed to communicate with recommendation service: " + e.getMessage(), e);
        }
    }

    private void validateRequest(Evenement request) {
        Objects.requireNonNull(request, "Event request cannot be null");
        Objects.requireNonNull(request.getDateDebut(), "Start date cannot be null");
        Objects.requireNonNull(request.getDateFin(), "End date cannot be null");

        // Enforce strict range: dateDebut must be before dateFin
        if (request.getDateDebut().isAfter(request.getDateFin()) ||
                request.getDateDebut().equals(request.getDateFin())) {
            log.error("Invalid date range: dateDebut={} is not strictly before dateFin={}",
                    request.getDateDebut(), request.getDateFin());
            throw new IllegalArgumentException("Start date must be strictly before end date");
        }
    }

    private DateSuggestionRequest buildApiRequest(Evenement request) {
        DateSuggestionRequest apiRequest = new DateSuggestionRequest();
        apiRequest.setDateDebut(formatDateTime(request.getDateDebut()));
        apiRequest.setDateFin(formatDateTime(request.getDateFin()));
        apiRequest.setNom(request.getNom());
        apiRequest.setSeuilMinimum(request.getSeuilMinimum());
        apiRequest.setPrix(request.getPrix() != null ? request.getPrix().floatValue() : 0.0f);
        return apiRequest;
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            throw new IllegalArgumentException("DateTime cannot be null");
        }
        return dateTime.format(DATETIME_FORMATTER); // Formats to YYYY-MM-DD HH:MM
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("Accept-Charset", "UTF-8");
        headers.set("Content-Type", "application/json;charset=UTF-8");
        return headers;
    }

    private DateSuggestionResponse validateResponse(ResponseEntity<DateSuggestionResponse> response) {
        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("FastAPI returned non-2xx status: {}", response.getStatusCode());
            throw new RuntimeException("API returned status: " + response.getStatusCode());
        }

        DateSuggestionResponse body = response.getBody();
        if (body == null) {
            log.error("Empty response body from FastAPI");
            throw new RuntimeException("Empty response body from API");
        }

        if (body.getDateRecommandee() == null) {
            log.warn("FastAPI response contains null dateRecommandee: {}", body);
        }

        return body;
    }
}