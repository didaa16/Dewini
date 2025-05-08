package tn.dewini.backend.Services.Urgence;

import tn.dewini.backend.Entities.Urgence.ConsultationUrgente;

import java.util.List;

public interface IConsultationUrgenteService {
    List<ConsultationUrgente> retrieveAllConsultationUrgentes();
    ConsultationUrgente retrieveConsultationUrgente(Long idConsultation);
    ConsultationUrgente addConsultationUrgente(ConsultationUrgente cu);
    void removeConsultationUrgente(Long idConsultation);
    ConsultationUrgente modifyConsultationUrgente(ConsultationUrgente consultationUrgente);
    ConsultationUrgente prendreEnChargeUrgence(Long idUrgence, String linkVideo);
    ConsultationUrgente ambulance(Long idConsultationUrgente);
}
