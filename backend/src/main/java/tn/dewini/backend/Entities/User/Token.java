package tn.dewini.backend.Entities.User;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Token
{
    @Id
    @GeneratedValue
    private Integer id;
    private String token;
    private LocalDateTime createAt;
    private LocalDateTime expiresAt;
    private LocalDateTime validatedAt;
    @ManyToOne
    @JoinColumn(name="userId",nullable=false)
    private User user;
}
