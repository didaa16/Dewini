package tn.dewini.backend.Controllers.eve;



import tn.dewini.backend.Entities.eve.DateSuggestionResponse;
import tn.dewini.backend.Entities.eve.Evenement;
import tn.dewini.backend.Services.eve.PlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/planning")

public class PlanningController {

    @Autowired
    private PlanningService planningService;

    @PostMapping("/suggest-best-date")
    public DateSuggestionResponse suggestBestDate(@RequestBody Evenement evenement) {
        return planningService.suggestBestDate(evenement);
    }
}
