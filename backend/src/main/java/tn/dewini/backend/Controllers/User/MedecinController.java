package tn.dewini.backend.Controllers.User;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Services.User.MedecinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/medecins")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class MedecinController {

    private final MedecinService medecinService;
    @GetMapping
    @PreAuthorize("hasAuthority('MEDECIN')") // ou une autre restriction
    public ResponseEntity<List<User>> getAllMedecins() {
        return ResponseEntity.ok(medecinService.getAllMedecins());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MEDECIN', 'ADMIN')")
    public ResponseEntity<User> getMedecinById(@PathVariable Integer id) {
        String authenticatedEmail = getAuthenticatedUserEmail();
        User medecin = medecinService.getMedecinById(id);

        if (hasRole("ADMIN") || medecin.getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.ok(medecin);
        }

        if (hasRole("MEDECIN")) {
            return ResponseEntity.ok(medecin);
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    private String getAuthenticatedUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }

    private boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + role));
    }
    @GetMapping("/specialite/{specialite}")
    @PreAuthorize("hasAuthority('MEDECIN')") // ou une autre restriction
    public ResponseEntity<List<User>> getMedecinsBySpecialite(@PathVariable String specialite) {
        return ResponseEntity.ok(medecinService.getMedecinsBySpecialite(specialite));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MEDECIN')") // ou une autre restriction
    public ResponseEntity<User> updateMedecin(
            @PathVariable Integer id,
            @RequestBody User updatedMedecin) {
        return ResponseEntity.ok(medecinService.updateMedecin(id, updatedMedecin));
    }
}