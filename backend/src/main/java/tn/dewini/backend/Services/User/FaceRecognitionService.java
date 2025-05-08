package tn.dewini.backend.Services.User;

import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import lombok.*;
import org.springframework.core.io.ByteArrayResource;

import org.springframework.core.io.ResourceLoader;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
@Service
@RequiredArgsConstructor
public class FaceRecognitionService {
    private final RestTemplate restTemplate;
    private final UserRepo userRepository;
    private final ResourceLoader resourceLoader;
    private final UserService userService;

    @Value("${application.face.api.url}")
    private String faceApiUrl;

    @Value("${application.file.storage.location}")
    private String storageLocation;

    public FaceComparisonResult verifyUserFace(Integer userId, MultipartFile webcamImage) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

            Path imagePath = validateAndGetProfilePicturePath(user);
            return sendFaceComparisonRequest(imagePath, webcamImage, userId);

        } catch (FaceVerificationException e) {
            throw e;
        } catch (Exception e) {
            throw new FaceVerificationException("Face verification failed: " + e.getMessage(), e);
        }
    }
    public FaceComparisonResult findUserByFace(MultipartFile webcamImage) {
        try {
            List<User> usersWithProfile = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getProfilePicUrl() != null && !u.getProfilePicUrl().isEmpty())
                    .toList();

            for (User user : usersWithProfile) {
                try {
                    Path imagePath = validateAndGetProfilePicturePath(user);
                    FaceComparisonResult result = sendFaceComparisonRequest(imagePath, webcamImage, user.getId());

                    if (result.isMatch()) {
                        return new FaceComparisonResult(true, result.getDistance(), result.getConfidence(), user.getId());
                    }
                } catch (Exception e) {
                    ;
                }
            }

            return new FaceComparisonResult(false, 0, 0, null);

        } catch (Exception e) {
            throw new FaceVerificationException("Face verification failed: " + e.getMessage(), e);
        }
    }
    private Path validateAndGetProfilePicturePath(User user) {
        if (user.getProfilePicUrl() == null || user.getProfilePicUrl().isEmpty()) {
            throw new NoProfilePictureException("No profile picture registered");
        }

        Path imagePath = Paths.get(storageLocation, user.getProfilePicUrl());

        if (!Files.exists(imagePath)) {
            throw new ImageNotFoundException("Profile image not found at: " + imagePath.toAbsolutePath());
        }
        return imagePath;
    }

    private FaceComparisonResult sendFaceComparisonRequest(Path profilePath, MultipartFile webcamImage, Integer userId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("registered_image", createFileResource(profilePath, "profile_" + userId + ".jpg"));
            body.add("webcam_image", createMultipartResource(webcamImage, "webcam_" + System.currentTimeMillis() + ".jpg"));

            ResponseEntity<FaceComparisonResult> response = restTemplate.exchange(
                    faceApiUrl + "/compare-faces/",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    FaceComparisonResult.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new FaceApiException("API returned status: " + response.getStatusCode());
            }

            return response.getBody();
        } catch (Exception e) {
            throw new FaceApiException("API communication error: " + e.getMessage());
        }
    }

    private ByteArrayResource createMultipartResource(MultipartFile file, String filename) throws Exception {
        return new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return filename;
            }
        };
    }

    private ByteArrayResource createFileResource(Path filePath, String filename) throws Exception {
        return new ByteArrayResource(Files.readAllBytes(filePath)) {
            @Override
            public String getFilename() {
                return filename;
            }
        };
    }

    // Custom exceptions and result class remain unchanged
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) { super(message); }
    }

    public static class NoProfilePictureException extends RuntimeException {
        public NoProfilePictureException(String message) { super(message); }
    }

    public static class ImageNotFoundException extends RuntimeException {
        public ImageNotFoundException(String message) { super(message); }
    }

    public static class FaceApiException extends RuntimeException {
        public FaceApiException(String message) { super(message); }
    }

    public static class FaceVerificationException extends RuntimeException {
        public FaceVerificationException(String message, Throwable cause) { super(message, cause); }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FaceComparisonResult {
        private boolean match;
        private double distance;
        private double confidence;
        private Integer userId;

    }
}