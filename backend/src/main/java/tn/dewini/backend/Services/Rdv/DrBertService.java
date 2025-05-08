package tn.dewini.backend.Services.Rdv;

import tn.dewini.backend.Dtos.DrBertResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class DrBertService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String DRBERT_API_URL = "http://127.0.0.1:8000/analyze";

    public DrBertResponse[] analyzeText(String text) {
        String url = UriComponentsBuilder.fromHttpUrl(DRBERT_API_URL)
                .queryParam("text", text)
                .toUriString();

        return restTemplate.getForObject(url, DrBertResponse[].class);
    }
}
