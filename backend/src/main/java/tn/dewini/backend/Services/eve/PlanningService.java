package tn.dewini.backend.Services.eve;


import tn.dewini.backend.Entities.eve.DateSuggestionResponse;
import tn.dewini.backend.Entities.eve.Evenement;

public interface PlanningService {
    DateSuggestionResponse suggestBestDate(Evenement request);
}
