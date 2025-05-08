package tn.dewini.backend.Entities.User;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {
    @NotEmpty(message = "Firstname is mandatory")
    @NotNull(message = "Firstname is mandatory")
    private String firstname;
    @NotEmpty(message = "Lastname is mandatory")
    @NotNull(message = "Lastname is mandatory")
    private String lastname;
    @Email(message = "Email is not well formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotNull(message = "Email is mandatory")
    private String email;
    @NotEmpty(message = "Password is mandatory")
    @NotNull(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String password;
    @NotEmpty(message = "Phone number is mandatory")
    @NotNull(message = "Phone number is mandatory")
    private String phoneNumber;
    @NotEmpty(message = "Gender is mandatory")
    @NotNull(message = "Gender is mandatory")
    private String gender;
    @NotNull(message = "Date of Birth is mandatory")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    @NotEmpty(message = "Address is mandatory")
    @NotNull(message = "Address is mandatory")
    private String address;
    private String gouvernorat;
    private String profilePicUrl;
    private Boolean isMedecin;
    @NotEmpty(message = "Speciality is mandatory for doctors", groups = MedecinValidation.class)
    private String specialite;
    @Min(value = 0, message = "Years of experience cannot be negative", groups = MedecinValidation.class)
    private Integer anneesExperience;
    public interface MedecinValidation {}
}

