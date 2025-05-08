package tn.dewini.backend.Services.Consultation;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.Consultation.Consultation;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.Consultation.ConsultationRepository;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.util.List;
@AllArgsConstructor
@Service
public class ConsultationServiceImpl implements IConsultationService {
    @Autowired
    private ConsultationRepository consultationRepository;

    private final UserRepo utilisateurRepository;
    @Override
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    @Override
    public Consultation getConsultationById(Integer id) {
        return consultationRepository.findById(id).orElseThrow(() -> new RuntimeException("Consultation not found"));
    }
    @Override
    public Consultation addConsultation(Consultation consultation, Integer UserId) {
        // Récupérer le médecin (utilisateur connecté)
        User medecin = utilisateurRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));

        // Récupérer le patient depuis la consultation
        User patient = consultation.getPatient();

        if(patient == null) {
            throw new RuntimeException("Patient non spécifié");
        }

        // Vérifier que le patient existe
        if(!utilisateurRepository.existsById(patient.getId())) {
            throw new RuntimeException("Patient non trouvé");
        }

        // Affecter les relations
        consultation.setMedecin(medecin);
        consultation.setPatient(patient); // Conserve le patient envoyé depuis le front

        return consultationRepository.save(consultation);
    }

    @Override
    public Consultation modifyConsultation(Consultation consultation) {
        // Vérifier que la consultation existe
        Consultation existing = consultationRepository.findById(consultation.getId_consultation())
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));

        // Mettre à jour les champs modifiables
        existing.setDate(consultation.getDate());
        existing.setHeure(consultation.getHeure());
        existing.setRapport(consultation.getRapport());
        existing.setRecommandations(consultation.getRecommandations());

        // Mettre à jour le patient si fourni
        if (consultation.getPatient() != null) {
            User patient = utilisateurRepository.findById(consultation.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
            existing.setPatient(patient);
        }

        // Mettre à jour le dossier médical si fourni
        if (consultation.getDossierMedical() != null) {
            existing.setDossierMedical(consultation.getDossierMedical());
        }

        return consultationRepository.save(existing);
    }
    @Override
    public void deleteConsultation(Integer id) {
        consultationRepository.deleteById(id);
    }
}