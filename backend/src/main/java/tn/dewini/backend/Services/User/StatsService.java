package tn.dewini.backend.Services.User;

import tn.dewini.backend.Repositories.User.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final UserRepo userRepo;

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        Map<String, Long> usersByRole = new HashMap<>();
        usersByRole.put("PATIENT", userRepo.countByRolesName("USER"));
        usersByRole.put("DOCTOR", userRepo.countByRolesName("MEDECIN"));
        usersByRole.put("ADMIN", userRepo.countByRolesName("ADMIN"));
        stats.put("usersByRole", usersByRole);

        stats.put("activeAccounts", userRepo.countByEnabled(true));
        stats.put("inactiveAccounts", userRepo.countByEnabled(false));

        Map<String, Long> genderDistribution = new HashMap<>();
        genderDistribution.put("MALE", userRepo.countByGender("MALE"));
        genderDistribution.put("FEMALE", userRepo.countByGender("FEMALE"));
        genderDistribution.put("OTHER", userRepo.countByGenderNotAndGenderNotNull(Arrays.asList("MALE", "FEMALE")));
        stats.put("genderDistribution", genderDistribution);

        Map<String, Long> monthlyLoginStats = getMonthlyLoginStats();
        stats.put("weeklyLoginStats", monthlyLoginStats); // Garde le même nom pour le front

        stats.put("loginComparison", calculateLoginComparison(monthlyLoginStats));

        List<String> specialties = userRepo.findDistinctSpecialites();
        Map<String, Long> specialtyStats = new HashMap<>();

        specialties.forEach(spec ->
                specialtyStats.put(spec, userRepo.countBySpecialite(spec)));

        if (!specialtyStats.isEmpty()) {
            String mostCommonSpecialty = specialtyStats.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .get().getKey();
            stats.put("mostCommonSpecialty", mostCommonSpecialty);
        }

        stats.put("specialtyDistribution", specialtyStats);

        return stats;
    }

    private Map<String, Long> getMonthlyLoginStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        int currentYear = LocalDate.now().getYear();

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        for (int i = 0; i < months.length; i++) {
            LocalDateTime start = LocalDateTime.of(currentYear, i+1, 1, 0, 0);
            LocalDateTime end = start.plusMonths(1);
            long count = userRepo.countByLastLoginBetween(start, end);
            stats.put(months[i], count);
        }

        return stats;
    }

    private String calculateLoginComparison(Map<String, Long> currentStats) {
        int currentYear = LocalDate.now().getYear();
        int lastYear = currentYear - 1;

        long currentYearTotal = currentStats.values().stream().mapToLong(Long::longValue).sum();
        long lastYearTotal = 0;

        for (int month = 1; month <= 12; month++) {
            LocalDateTime start = LocalDateTime.of(lastYear, month, 1, 0, 0);
            LocalDateTime end = start.plusMonths(1);
            lastYearTotal += userRepo.countByLastLoginBetween(start, end);
        }

        if (lastYearTotal == 0) {
            return currentYearTotal > 0 ? "100% higher than last year" : "0% higher than last year";
        }

        double percentage = ((double)(currentYearTotal - lastYearTotal) / lastYearTotal) * 100;
        return String.format("%.0f%% higher than last year", percentage);
    }
}