package tn.dewini.backend.Services.User;

import tn.dewini.backend.Entities.User.RegistrationRequest;
import tn.dewini.backend.Entities.User.Role;
import tn.dewini.backend.Entities.User.Token;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.RoleRepo;
import tn.dewini.backend.Repositories.User.TokenRepo;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Template.EmailTemplateName;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepository;
    private final TokenRepo tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final FaceRecognitionService faceRecognitionService;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
    @Value("${application.urls.frontend.login}")
    private String loginUrl;
    @Value("${application.urls.frontend.unban-request}")
    private String unbanRequestUrl;

    @Transactional
    public void register(RegistrationRequest request) throws MessagingException {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use.");
        }

        boolean isFirstUser = userRepository.count() == 0;
        String roleName = isFirstUser ? "ADMIN" : (request.getIsMedecin() ? "MEDECIN" : "USER");
        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> {
                    return new IllegalStateException("Required role " + roleName + " was not initiated");
                });

        // Build User entity
        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .profilePicUrl(request.getProfilePicUrl())
                .specialite(request.getIsMedecin() ? request.getSpecialite() : null)
                .anneesExperience(request.getIsMedecin() ? request.getAnneesExperience() : null)
                .accountLocked(false)
                .enabled(false) // Account disabled until email activation
                .createdDate(LocalDateTime.now())
                .roles(List.of(role))
                .build();

        User savedUser = userRepository.save(user);

        sendActivationEmail(savedUser);
    }

    private void sendActivationEmail(User user) throws MessagingException {
        try {
            String activationToken = generateAndSaveActivationToken(user);
            String confirmationUrl = activationUrl + "?token=" + activationToken;

            Map<String, Object> variables = new HashMap<>();
            variables.put("username", user.getFirstname());
            variables.put("activation_code", activationToken); // Code numérique à 6 chiffres
            variables.put("confirmationUrl", confirmationUrl);

            emailService.sendEmail(
                    user.getEmail(),
                    user.getFirstname(),
                    EmailTemplateName.ACTIVATE_ACCOUNT,
                    variables,
                    "Activate Your Dewini Account - Code: " + activationToken // Ajout du code dans le sujet
            );

        } catch (Exception e) {
            throw new MessagingException("Failed to send activation email", e);
        }
    }

    private String generateAndSaveActivationToken(User user) {
        // Utilisez votre méthode existante pour générer un code numérique
        String generatedToken = generateActivationCode(6); // 6 chiffres

        var token = Token.builder()
                .token(generatedToken)
                .createAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .user(user)
                .build();

        tokenRepository.save(token);
        return generatedToken;
    }



    private String generateActivationCode(int length) {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < length; i++) {
            code.append(secureRandom.nextInt(10)); // Chiffres de 0 à 9
        }

        return code.toString();
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account disabled");
        }

        if (user.isAccountLocked()) {
            throw new RuntimeException("Account locked");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        var jwtToken = jwtService.generateToken(userDetails, user.getId());
        var refreshToken = jwtService.generateRefreshToken(userDetails, user.getId());

        return new AuthenticationResponse(jwtToken, refreshToken);
    }

    public AuthenticationResponse refreshAccessToken(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            Integer userId = Math.toIntExact(jwtService.extractUserId(refreshToken));
            String newAccessToken = jwtService.generateToken(userDetails, userId);
            return new AuthenticationResponse(newAccessToken, refreshToken);
        } else {
            System.err.println("[AuthService] Invalid refresh token for user: " + username);
            throw new RuntimeException("Invalid Refresh Token");
        }
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        // Vérifie que le token est bien un code numérique
        if (!token.matches("\\d{6}")) {
            throw new RuntimeException("Invalid activation code format");
        }

        Token activationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid activation code"));

        if (LocalDateTime.now().isAfter(activationToken.getExpiresAt())) {
            tokenRepository.delete(activationToken);
            sendActivationEmail(activationToken.getUser());
            throw new RuntimeException("Activation code has expired. A new code has been sent.");
        }

        User user = activationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        activationToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(activationToken);
    }

    public void requestPasswordReset(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.err.println("[AuthService] User not found for password reset: " + email);
                    return new RuntimeException("User not found");
                });

        String resetToken = generateResetToken(6);
        Token token = Token.builder()
                .token(resetToken)
                .createAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        Map<String, Object> variables = new HashMap<>();
        variables.put("reset_token", resetToken);
        variables.put("reset_url", "http://localhost:4200/reset-password?token=" + resetToken);
        emailService.sendEmail(
                user.getEmail(),
                user.getFirstname(),
                EmailTemplateName.RESET_PASSWORD,
                variables,
                "Réinitialisation de mot de passe"
        );
        System.out.println("[AuthService] Password reset email sent to: " + user.getEmail());
    }

    public void resetPassword(String token, String newPassword) {
        Token resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    System.err.println("[AuthService] Invalid or expired reset token: " + token);
                    return new RuntimeException("Invalid or expired token");
                });

        if (LocalDateTime.now().isAfter(resetToken.getExpiresAt())) {
            System.err.println("[AuthService] Reset token expired for user: " + resetToken.getUser().getEmail());
            throw new RuntimeException("Reset token has expired.");
        }

        User user = resetToken.getUser();
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        tokenRepository.delete(resetToken);
        System.out.println("[AuthService] Password reset for user: " + user.getEmail() + ", new hash: " + encodedPassword);
    }

    private String generateResetToken(int length) {
        SecureRandom secureRandom = new SecureRandom();
        return secureRandom.ints(length, 0, 10)
                .mapToObj(String::valueOf)
                .reduce("", String::concat);
    }

    public AuthenticationResponse authenticateWithFaceId(MultipartFile faceImage) {
        FaceRecognitionService.FaceComparisonResult result = faceRecognitionService.findUserByFace(faceImage);

        if (!result.isMatch()) {
            System.err.println("[AuthService] Face verification failed - no matching user found");
            throw new RuntimeException("Face verification failed - no matching user found");
        }

        User user = userRepository.findById(result.getUserId())
                .orElseThrow(() -> {
                    System.err.println("[AuthService] User not found for face ID: " + result.getUserId());
                    return new UsernameNotFoundException("User not found");
                });

        if (!user.isEnabled()) {
            System.err.println("[AuthService] Account disabled for user: " + user.getEmail());
            throw new RuntimeException("Votre compte est désactivé");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails, user.getId());
        String refreshToken = jwtService.generateRefreshToken(userDetails, user.getId());
        System.out.println("[AuthService] Face authentication successful for user: " + user.getEmail());
        return new AuthenticationResponse(jwtToken, refreshToken);
    }

    @Transactional
    public void banUser(Integer userId, String reason) throws MessagingException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.err.println("[AuthService] User not found for ban, ID: " + userId);
                    return new RuntimeException("User not found");
                });

        user.setEnabled(false);
        userRepository.save(user);
        System.out.println("[AuthService] User banned: " + user.getEmail());
        sendBanNotification(user, reason);
    }

    @Transactional
    public void unbanUser(Integer userId) throws MessagingException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.err.println("[AuthService] User not found for unban, ID: " + userId);
                    return new RuntimeException("User not found");
                });

        user.setEnabled(true);
        userRepository.save(user);
        System.out.println("[AuthService] User unbanned: " + user.getEmail());
        sendUnbanNotification(user);
    }

    private void sendBanNotification(User user, String reason) throws MessagingException {
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
        System.out.println("[AuthService] Ban notification sent to: " + user.getEmail());
    }

    private void sendUnbanNotification(User user) throws MessagingException {
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
        System.out.println("[AuthService] Unban notification sent to: " + user.getEmail());
    }
}