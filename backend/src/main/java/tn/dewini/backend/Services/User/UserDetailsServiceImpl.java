package tn.dewini.backend.Services.User;


import tn.dewini.backend.Entities.User.Role;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepo userRepo;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        System.out.println("User loaded: " + user.getEmail());
        System.out.println("Roles: " + user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName())) // Ensure ROLE_ prefix
                        .collect(Collectors.toList()))
                .build();
    }
}
