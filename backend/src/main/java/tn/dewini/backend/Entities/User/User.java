package tn.dewini.backend.Entities.User;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import tn.dewini.backend.Entities.Consultation.DossierMedicale;
import tn.dewini.backend.Entities.Rdv.Rendezvous;

import java.io.Serializable;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "_user")
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails, Principal, Serializable {
    @Id
    @GeneratedValue
    private Integer id;
    private String firstname;
    private String lastname;
    @Column(unique = true)
    private String email;
    private String password;
    private boolean accountLocked;
    private boolean enabled;
    private boolean isOAuthUser;
    private String specialite;
    private Integer anneesExperience;
    private LocalDateTime lastLogin;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    private String phoneNumber;
    private String gender;

    private String profilePicUrl;
    private String address;
    private String gouvernorat;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;
    public void setDateOfBirthFromString(String dateString) {
        if (dateString != null && !dateString.isEmpty()) {
            this.dateOfBirth = LocalDate.parse(dateString);
        }
    }


    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;






    @PrePersist
    @PreUpdate
    public void updateTimestamps() {
        this.lastModifiedDate = LocalDateTime.now();
    }

    @JsonIgnore
    @Override
    public String getName() {
        return email;
    }
    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles
                .stream()
                .map(r -> new SimpleGrantedAuthority(r.getName()))
                .collect(Collectors.toList());
    }
    @JsonIgnore
    @Override
    public String getPassword() {
        return password;
    }
    @JsonIgnore
    @Override
    public String getUsername() {
        return email;
    }
    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }
    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String Fullname() {
        return firstname + " " + lastname;
    }

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    @JsonBackReference
    private DossierMedicale dossierMedicale;
    public void setDossierMedicale(DossierMedicale dossierMedicale) {
        this.dossierMedicale = dossierMedicale;
    }




}