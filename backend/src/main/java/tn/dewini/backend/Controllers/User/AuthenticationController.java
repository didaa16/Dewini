package tn.dewini.backend.Controllers.User;

import tn.dewini.backend.Entities.User.RegistrationRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.dewini.backend.Services.User.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserService userService;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<String> register(
            @RequestPart("userData") @Valid RegistrationRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {

            if (file != null && !file.isEmpty()) {
                String imagePath = userService.saveProfilePicture(file, null);
                request.setProfilePicUrl(imagePath);
            }

            service.register(request);
            return ResponseEntity.accepted().body("Registration successful. Please check your email for activation link.");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send activation email.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile picture.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public ResponseEntity<String> confirm(@RequestParam String token) throws MessagingException {
        service.activateAccount(token);
        return ResponseEntity.ok("Account activated successfully.");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(service.refreshAccessToken(refreshToken));
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) throws MessagingException {
        service.requestPasswordReset(email);
        return ResponseEntity.ok("Password reset link has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token and new password are required."));
        }

        service.resetPassword(token, newPassword);

        return ResponseEntity.ok(Map.of("message", "Your password has been successfully reset."));
    }

    @GetMapping("/oauth2/user")
    public ResponseEntity<Map<String, Object>> getOAuth2User(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(principal.getAttributes());
    }


    @PostMapping(value = "/auth-with-face", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> authWithFaceId(@RequestParam("image") MultipartFile faceImage) {
        try {
            AuthenticationResponse response = service.authenticateWithFaceId(faceImage);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "success", false,
                            "message", "Authentication failed",
                            "error", e.getMessage()
                    ));
        }
    }

}
