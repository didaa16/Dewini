package tn.dewini.backend.Services.Pharmacie;

import org.springframework.web.multipart.MultipartFile;

public interface IFatigueService {
    public String uploadPdfEtEnvoyerWhatsApp(MultipartFile file, String numeroPatient);
    public String uploadImageEtEnvoyerWhatsApp(MultipartFile file, String numeroPatient);

    }
