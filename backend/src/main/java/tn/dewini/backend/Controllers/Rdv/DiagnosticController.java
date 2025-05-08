package tn.dewini.backend.Controllers.Rdv;

import tn.dewini.backend.Dtos.DrBertResponse;
import tn.dewini.backend.Services.Rdv.DrBertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Autowired
    private DrBertService drBertService;

    @GetMapping(value = "/analyze", produces = MediaType.APPLICATION_JSON_VALUE)
    public DrBertResponse[] analyze(@RequestParam String text) {
        return drBertService.analyzeText(text);
    }
}

