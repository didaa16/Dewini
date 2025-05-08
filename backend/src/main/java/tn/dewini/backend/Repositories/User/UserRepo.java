package tn.dewini.backend.Repositories.User;

import tn.dewini.backend.Entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByRolesName(String roleName);
    Optional<User> findByIdAndRolesName(Integer id, String roleName);
    List<User> findBySpecialiteAndRolesName(String specialite, String roleName);

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = :roleName")
    Long countByRolesName(@Param("roleName") String roleName);

    @Query("SELECT COUNT(u) FROM User u WHERE u.enabled = :enabled")
    Long countByEnabled(@Param("enabled") boolean enabled);

    @Query("SELECT COUNT(u) FROM User u WHERE u.gender = :gender")
    Long countByGender(@Param("gender") String gender);

    @Query("SELECT COUNT(u) FROM User u WHERE u.gender NOT IN :genders AND u.gender IS NOT NULL")
    Long countByGenderNotAndGenderNotNull(@Param("genders") List<String> genders);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin BETWEEN :start AND :end")
    Long countByLastLoginBetween(@Param("start") LocalDateTime start,
                                 @Param("end") LocalDateTime end);

    @Query("SELECT DISTINCT u.specialite FROM User u JOIN u.roles r WHERE r.name = 'MEDECIN' AND u.specialite IS NOT NULL")
    List<String> findDistinctSpecialites();

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = 'MEDECIN' AND u.specialite = :specialite")
    Long countBySpecialite(@Param("specialite") String specialite);

    @Query("SELECT AVG(u.anneesExperience) FROM User u JOIN u.roles r WHERE r.name = 'MEDECIN'")
    Double avgAnneesExperience();

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdDate > :date")
    Long countByCreatedDateAfter(@Param("date") LocalDateTime date);
}