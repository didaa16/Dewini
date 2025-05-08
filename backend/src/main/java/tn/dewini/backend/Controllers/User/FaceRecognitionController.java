package tn.dewini.backend.Controllers.User;

import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.User.FaceRecognitionService;
import tn.dewini.backend.Services.User.JwtService;
import tn.dewini.backend.Services.User.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
@RestController
@RequestMapping("/api/face-auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class FaceRecognitionController {
    private final FaceRecognitionService faceRecognitionService;
    private final UserRepo userRepository;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @GetMapping("/can-use-face-auth/{userId}")
    public ResponseEntity<Map<String, Object>> canUseFaceAuth(@PathVariable Integer userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean hasProfilePicture = user.getProfilePicUrl() != null && !user.getProfilePicUrl().isEmpty();

            return ResponseEntity.ok(Map.of(
                    "canUseFaceAuth", hasProfilePicture,
                    "profilePicUrl", hasProfilePicture ? user.getProfilePicUrl() : null
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyUserFace(
            @RequestParam("image") MultipartFile webcamImage) {
        try {
            if (webcamImage.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "No image provided"
                ));
            }

            FaceRecognitionService.FaceComparisonResult result =
                    faceRecognitionService.findUserByFace(webcamImage);

            if (!result.isMatch()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "No matching face found in our database"
                ));
            }

            User user = userRepository.findById(result.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails, user.getId());
            String refreshToken = jwtService.generateRefreshToken(userDetails, user.getId());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Face verification successful",
                    "confidence", result.getConfidence(),
                    "token", token,
                    "refreshToken", refreshToken,
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "firstname", user.getFirstname(),
                            "lastname", user.getLastname()
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Internal server error",
                    "error", e.getMessage()
            ));
        }
    }
}