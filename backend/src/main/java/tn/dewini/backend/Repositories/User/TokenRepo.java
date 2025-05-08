package tn.dewini.backend.Repositories.User;

import tn.dewini.backend.Entities.User.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepo extends JpaRepository<Token,Integer> {
    Optional<Token>findByToken(String Token);
}
