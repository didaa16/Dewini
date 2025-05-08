package tn.dewini.backend.Services.User;

import tn.dewini.backend.Handlers.EmailSendingException;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Template.EmailTemplateName;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.thymeleaf.TemplateEngine;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder; // Ajoutez cette ligne
    private final TemplateEngine templateEngine;
    private final EmailService emailService;

    @Value("${application.file.storage.location}")
    private String uploadDir;
    @Value("${application.urls.frontend.unban-request}")
    private String unbanRequestUrl;
    @Value("${application.urls.frontend.login}")
    private String loginUrl;


    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
    public Optional<User> getUserById(Integer id) {
        return userRepo.findById(id);
    }
    public User updateUser(Integer userId, User updatedUser) {
        return userRepo.findById(userId).map(user -> {
            user.setFirstname(updatedUser.getFirstname());
            user.setLastname(updatedUser.getLastname());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setAddress(updatedUser.getAddress());
            user.setGender(updatedUser.getGender());

            if (updatedUser.getDateOfBirth() != null) {
                user.setDateOfBirth(updatedUser.getDateOfBirth());
            }

            if (updatedUser.getProfilePicUrl() != null) {
                user.setProfilePicUrl(updatedUser.getProfilePicUrl());
            }

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            // Handle MEDECIN-specific fields
            if (updatedUser.getSpecialite() != null) {
                user.setSpecialite(updatedUser.getSpecialite());
            }
            if (updatedUser.getAnneesExperience() != null) {
                user.setAnneesExperience(updatedUser.getAnneesExperience());
            }

            return userRepo.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String saveProfilePicture(MultipartFile file, Integer userId) throws IOException {
        ensureUploadDirExists();
        if (userId != null) {
            userRepo.findById(userId).ifPresent(user -> {
                if (user.getProfilePicUrl() != null) {
                    deleteProfilePicture(user.getProfilePicUrl());
                }
            });
        }
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String filename = (userId != null ? userId + "_" : "temp_") + UUID.randomUUID() + fileExtension;

        Path filePath = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    public void deleteProfilePicture(String filename) {
        try {
            if (filename != null && !filename.isEmpty()) {
                Path filePath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete profile picture", e);
        }
    }

    private void ensureUploadDirExists() throws IOException {
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }

    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf("."));
    }

    @Async
    public void sendBanNotificationEmail(User user, String reason) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("username", user.getFirstname());
        variables.put("reason", reason);
        variables.put("unbanRequestUrl", unbanRequestUrl + "?email=" + user.getEmail());

        emailService.sendEmail(
                user.getEmail(),
                user.getFirstname(),
                EmailTemplateName.BAN_NOTIFICATION,
                variables,
                "❌ Votre compte a été désactivé"
        );
    }

    @Async
    public void sendUnbanNotificationEmail(User user) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("username", user.getFirstname());
        variables.put("loginUrl", loginUrl);

        emailService.sendEmail(
                user.getEmail(),
                user.getFirstname(),
                EmailTemplateName.UNBAN_NOTIFICATION,
                variables,
                "✅ Votre compte a été réactivé"
        );
    }

    public void sendUnbanRequestEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("rahmanimuhamed7@gmail.com");
            message.setTo("toumi.mohamedamine@gmail.com");
            message.setSubject("🔔 Demande de débanissement");
            message.setText(String.format(
                    "Demande de débanissement\n\n" +
                            "L'utilisateur %s (%s) demande à être débani.\n" +
                            "ID: %d\n" +
                            "Veuillez examiner sa demande.",
                    user.getEmail(),
                    user.getFirstname() + " " + user.getLastname(),
                    user.getId()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendingException("Failed to send unban request email", e);
        }
    }
}
