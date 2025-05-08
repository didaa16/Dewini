package tn.dewini.backend.Controllers.User;

import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.User.AuthenticationService;
import tn.dewini.backend.Services.User.MedecinService;
import tn.dewini.backend.Services.User.StatsService;
import tn.dewini.backend.Services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepo userRepository;
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final StatsService statsService;
    private final MedecinService medecinService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/list_user")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();

            if (users.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/ban/{id}")
    public ResponseEntity<String> banUser(
            @PathVariable Integer id,
            @RequestParam(required = false) String reason) {
        try {
            authenticationService.banUser(id, reason); // Use AuthenticationService
            return ResponseEntity.ok("Utilisateur banni avec notification envoyée");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors du bannissement: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/unban/{id}")
    public ResponseEntity<String> unbanUser(@PathVariable Integer id) {
        try {
            authenticationService.unbanUser(id); // Use AuthenticationService
            return ResponseEntity.ok("Utilisateur réactivé avec notification envoyée");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors du débanissement: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("Utilisateur supprimé avec succès !");
        }
        return ResponseEntity.badRequest().body("Utilisateur introuvable !");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/request-unban")
    public ResponseEntity<String> requestUnban(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!user.isEnabled()) { // User is banned
                userService.sendUnbanRequestEmail(user);
                return ResponseEntity.ok("Demande de débanissement envoyée avec succès !");
            } else {
                return ResponseEntity.badRequest().body("Votre compte est déjà actif.");
            }
        }
        return ResponseEntity.badRequest().body("Utilisateur introuvable !");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        String authenticatedEmail = getAuthenticatedUserEmail();
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent() && user.get().getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(403).build(); // Forbidden if user ID does not match
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer userId,
            @RequestBody Map<String, Object> updateData) {

        System.out.println("[ADMIN] Received update request for user ID: " + userId);
        System.out.println("[ADMIN] Update data: " + updateData);

        Optional<User> existingUser = userService.getUserById(userId);
        if (!existingUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User userToUpdate = existingUser.get();

        if (updateData.containsKey("firstname")) {
            userToUpdate.setFirstname((String) updateData.get("firstname"));
        }
        if (updateData.containsKey("lastname")) {
            userToUpdate.setLastname((String) updateData.get("lastname"));
        }
        if (updateData.containsKey("email")) {
            userToUpdate.setEmail((String) updateData.get("email"));
        }
        if (updateData.containsKey("phoneNumber")) {
            userToUpdate.setPhoneNumber((String) updateData.get("phoneNumber"));
        }
        if (updateData.containsKey("address")) {
            userToUpdate.setAddress((String) updateData.get("address"));
        }
        if (updateData.containsKey("gender")) {
            userToUpdate.setGender((String) updateData.get("gender"));
        }
        if (updateData.containsKey("dateOfBirth")) {
            userToUpdate.setDateOfBirthFromString((String) updateData.get("dateOfBirth"));
        }
        if (updateData.containsKey("profilePicUrl")) {
            userToUpdate.setProfilePicUrl((String) updateData.get("profilePicUrl"));
        }

        if (updateData.containsKey("password")) {
            String newPassword = (String) updateData.get("password");
            userToUpdate.setPassword(newPassword); // Le service va encoder le mot de passe
        }

        try {
            User updatedUser = userService.updateUser(userId, userToUpdate);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String getAuthenticatedUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        return statsService.getAdminStats();
    }

}
