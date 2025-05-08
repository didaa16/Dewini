package tn.dewini.backend.Security;

import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.RoleRepo;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.User.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;

    public OAuth2AuthenticationSuccessHandler(JwtService jwtService,
                                              UserRepo userRepo,
                                              RoleRepo roleRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();
        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
        String email = extractEmail(attributes, registrationId);
        String name = extractName(attributes, registrationId);
        String avatarUrl = extractAvatarUrl(attributes, registrationId);
        String gender = extractGender(attributes, registrationId);
        LocalDate birthDate = extractBirthDate(attributes, registrationId);
        String phoneNumber = extractPhoneNumber(attributes, registrationId);
        String address = extractAddress(attributes, registrationId);
        Optional<User> existingUser = userRepo.findByEmail(email);
        User user = existingUser.orElseGet(() -> registerOAuth2User(
                email, name, avatarUrl, gender, birthDate, phoneNumber, address, registrationId));
        updateUserInfo(user, avatarUrl, gender, birthDate, phoneNumber, address);
        String jwtToken = jwtService.generateToken(user, user.getId());
        String refreshToken = jwtService.generateRefreshToken(user, user.getId());
        String frontendUrl = buildFrontendRedirectUrl(jwtToken, refreshToken);
        getRedirectStrategy().sendRedirect(request, response, frontendUrl);
    }

    private String extractEmail(Map<String, Object> attributes, String provider) {
        String email = (String) attributes.get("email");
        if (email == null && "github".equals(provider)) {
            email = attributes.get("login") + "@github.com";
        }
        return email;
    }

    private String extractName(Map<String, Object> attributes, String provider) {
        if ("google".equals(provider)) {
            return (String) attributes.get("name");
        } else if ("facebook".equals(provider)) {
            return (String) attributes.get("name");
        } else {
            return (String) attributes.get("name");
        }
    }

    private String extractAvatarUrl(Map<String, Object> attributes, String provider) {
        if ("google".equals(provider)) {
            return (String) attributes.get("picture");
        } else if ("facebook".equals(provider)) {
            Map<String, Object> picture = (Map<String, Object>) attributes.get("picture");
            if (picture != null) {
                Map<String, Object> data = (Map<String, Object>) picture.get("data");
                return (String) data.get("url");
            }
        } else {
            return (String) attributes.get("avatar_url");
        }
        return null;
    }

    private String extractGender(Map<String, Object> attributes, String provider) {
        if ("facebook".equals(provider)) {
            String gender = (String) attributes.get("gender");
            if (gender != null) {
                return gender.equals("male") ? "Male" : "Female";
            }
        }
        return null;
    }

    private LocalDate extractBirthDate(Map<String, Object> attributes, String provider) {
        if ("facebook".equals(provider)) {
            String birthday = (String) attributes.get("birthday");
            if (birthday != null) {
                try {
                    return LocalDate.parse(birthday, DateTimeFormatter.ofPattern("MM/dd/yyyy"));
                } catch (Exception e) {
                    return null;
                }
            }
        }
        return null;
    }

    private String extractPhoneNumber(Map<String, Object> attributes, String provider) {
        return null;
    }

    private String extractAddress(Map<String, Object> attributes, String provider) {
        return null;
    }

    private User registerOAuth2User(String email, String name, String avatarUrl,
                                    String gender, LocalDate birthDate,
                                    String phoneNumber, String address,
                                    String provider) {
        String[] nameParts = name != null ? name.split(" ") : new String[]{"User", "OAuth"};
        String firstname = nameParts[0];
        String lastname = nameParts.length > 1 ? nameParts[1] : provider;

        boolean isFirstUser = userRepo.count() == 0;
        var role = roleRepo.findByName(isFirstUser ? "ADMIN" : "USER")
                .orElseThrow(() -> new IllegalStateException("Required role was not initiated"));

        return userRepo.save(User.builder()
                .firstname(firstname)
                .lastname(lastname)
                .email(email)
                .password(UUID.randomUUID().toString())
                .accountLocked(false)
                .enabled(true)
                .isOAuthUser(true)
                .profilePicUrl(avatarUrl)
                .gender(gender)
                .dateOfBirth(birthDate)
                .phoneNumber(phoneNumber)
                .address(address)
                .roles(List.of(role))
                .build());
    }

    private void updateUserInfo(User user, String avatarUrl, String gender,
                                LocalDate birthDate, String phoneNumber,
                                String address) {
        boolean needsUpdate = false;

        if (avatarUrl != null && user.getProfilePicUrl() == null) {
            user.setProfilePicUrl(avatarUrl);
            needsUpdate = true;
        }

        if (gender != null && user.getGender() == null) {
            user.setGender(gender);
            needsUpdate = true;
        }

        if (birthDate != null && user.getDateOfBirth() == null) {
            user.setDateOfBirth(birthDate);
            needsUpdate = true;
        }

        if (phoneNumber != null && user.getPhoneNumber() == null) {
            user.setPhoneNumber(phoneNumber);
            needsUpdate = true;
        }

        if (address != null && user.getAddress() == null) {
            user.setAddress(address);
            needsUpdate = true;
        }

        if (needsUpdate) {
            userRepo.save(user);
        }
    }

    private String buildFrontendRedirectUrl(String jwtToken, String refreshToken) {
        return "http://localhost:4200/oauth2/redirect" +
                "?token=" + URLEncoder.encode(jwtToken, StandardCharsets.UTF_8) +
                "&refreshToken=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);
    }
}