package tn.dewini.backend.Services.Consultation;

import tn.dewini.backend.Entities.Consultation.Consultation;

import java.util.List;

public interface IConsultationService {
    // Retrieve all consultations
    List<Consultation> getAllConsultations();

    // Retrieve a consultation by ID
    Consultation getConsultationById(Integer id);

    // Add a new consultation
    Consultation addConsultation(Consultation consultation,Integer UserId);

    // Update an existing consultation
    Consultation modifyConsultation(Consultation consultation);

    // Delete a consultation by ID
    void deleteConsultation(Integer id);
}