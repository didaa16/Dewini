package tn.dewini.backend.Entities.Urgence;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "consultation_urgente")
public class ConsultationUrgente implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsultationUrgente;

    @OneToOne
    @JoinColumn(name = "id_urgence", nullable = false)
    @JsonBackReference
    private Urgence urgence;

    @NotNull(message = "La date ne peut pas être null")
    private Date date;

    @Column(nullable = true)
    @Nullable
    private String lienVideo;

    @NotNull(message = "A suivre ne peut pas être null")
    private Boolean ambulance;

}
