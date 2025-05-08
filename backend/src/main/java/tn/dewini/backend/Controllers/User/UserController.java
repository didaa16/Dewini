package tn.dewini.backend.Controllers.User;


import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.User.JwtService;
import tn.dewini.backend.Services.User.StatsService;
import tn.dewini.backend.Services.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepo userRepo;
    private final StatsService statsService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_MEDECIN', 'ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_MEDECIN', 'ROLE_ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        String authenticatedEmail = getAuthenticatedUserEmail();
        Optional<User> user = userService.getUserById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (hasRole("ADMIN") || user.get().getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.ok(user.get());
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    private boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + role));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_MEDECIN', 'ROLE_ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> updateData) {

        System.out.println("Received update request for user ID: " + id);
        System.out.println("Update data: " + updateData);
        System.out.println("Authenticated user: " + getAuthenticatedUserEmail());

        Optional<User> existingUser = userService.getUserById(id);
        if (!existingUser.isPresent()) {
            System.out.println("User not found for ID: " + id);
            return ResponseEntity.notFound().build();
        }

        User userToUpdate = existingUser.get();
        String authenticatedEmail = getAuthenticatedUserEmail();

        if (!hasRole("ADMIN") && !userToUpdate.getEmail().equals(authenticatedEmail)) {
            System.out.println("Unauthorized: " + authenticatedEmail + " cannot update " + userToUpdate.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own profile");
        }

        if (updateData.containsKey("firstname")) {
            userToUpdate.setFirstname((String) updateData.get("firstname"));
        }
        if (updateData.containsKey("lastname")) {
            userToUpdate.setLastname((String) updateData.get("lastname"));
        }
        if (updateData.containsKey("email")) {
            String newEmail = (String) updateData.get("email");
            if (!newEmail.equals(userToUpdate.getEmail()) && userService.getUserByEmail(newEmail).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }
            userToUpdate.setEmail(newEmail);
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
        if (updateData.containsKey("specialite")) {
            userToUpdate.setSpecialite((String) updateData.get("specialite"));
        }
        if (updateData.containsKey("anneesExperience")) {
            userToUpdate.setAnneesExperience(((Number) updateData.get("anneesExperience")).intValue());
        }

        if (updateData.containsKey("password")) {
            String newPassword = (String) updateData.get("password");
            userToUpdate.setPassword(passwordEncoder.encode(newPassword)); // Ensure password is encoded
            jwtService.invalidateAllTokensForUser(userToUpdate.getEmail());
        }


        try {
            User updated = userService.updateUser(id, userToUpdate);
            System.out.println("User updated successfully: " + updated.getEmail());

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadProfilePicture(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        String authenticatedEmail = getAuthenticatedUserEmail();
        Optional<User> user = userService.getUserById(id);

        System.out.println("📸 Upload request received for User ID: " + id);
        System.out.println("📧 Authenticated User: " + authenticatedEmail);

        if (!user.isPresent()) {
            System.out.println("❌ User not found for ID: " + id);
            return ResponseEntity.status(404).body("User not found");
        }

        if (!user.get().getEmail().equals(authenticatedEmail)) {
            System.out.println("❌ Unauthorized: User " + authenticatedEmail + " is not allowed to modify " + user.get().getEmail());
            return ResponseEntity.status(403).body("Unauthorized");
        }

        if (file == null || file.isEmpty()) {
            System.out.println("⚠️ File is missing or empty!");
            return ResponseEntity.badRequest().body("File is required!");
        }

        try {
            String imageUrl = userService.saveProfilePicture(file, id);
            System.out.println("✅ File uploaded successfully! URL: " + imageUrl);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            System.out.println("❌ Error uploading file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error uploading file");
        }
    }

    private String getAuthenticatedUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }


    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Integer id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();

        stats.put("registrationDate", user.getCreatedDate());
        stats.put("lastLogin", user.getLastLogin());
        stats.put("profileCompletion", calculateProfileCompletion(user));

        if (user.getRoles().stream().anyMatch(r -> r.getName().equals("MEDECIN"))) {
            stats.put("yearsOfExperience", user.getAnneesExperience());
            stats.put("speciality", user.getSpecialite());
        }

        return ResponseEntity.ok(stats);
    }

    private int calculateProfileCompletion(User user) {
        int totalFields = 8;
        int completedFields = 0;

        if (user.getFirstname() != null && !user.getFirstname().isEmpty()) completedFields++;
        if (user.getLastname() != null && !user.getLastname().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) completedFields++;
        if (user.getGender() != null && !user.getGender().isEmpty()) completedFields++;
        if (user.getDateOfBirth() != null) completedFields++;
        if (user.getAddress() != null && !user.getAddress().isEmpty()) completedFields++;
        if (user.getProfilePicUrl() != null && !user.getProfilePicUrl().isEmpty()) completedFields++;

        return (completedFields * 100) / totalFields;
    }
}

