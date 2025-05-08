package tn.dewini.backend.Security;

import tn.dewini.backend.Repositories.User.RoleRepo;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.User.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtService jwtService;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/face-auth/**",
                                "/centre-de-don/**",
                                "/dons/**",
                                "/evenement/**",
                                "/api/inscriptions/**",
                                "/api/lieux/**",
                                "/event-engagement/**",
                                "/participation/**",
                                "/api/predictions/**",
                                "/api/planning/**",
                                "/consultation/**",
                                "/dossier/**",
                                "/email/**",
                                "/centre-de-don/**",
                                "/urgence/**",
                                "/consultationUrgente/**",
                                "/api/fatigue/**",
                                "/api/livraisons/**",
                                "/api/medicaments/**",
                                "/api/ordonnances/**",
                                "/api/prescriptions/**",
                                "/api/reponses/**",
                                "/api/diagnostic/**",
                                "/api/rendezvous/**",
                                "/api/**",
                                "/location/**",
                                "/uploads/**"
                               ).permitAll()
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/medecins/**").hasRole("MEDECIN")
                        .requestMatchers("/api/v1/users/**").hasAnyRole("USER", "MEDECIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.getWriter().write("Access Denied: " + accessDeniedException.getMessage());
                        })
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/oauth2/authorization")
                        )
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                        .successHandler(oAuth2SuccessHandler())
                );

        return http.build();
    }

    @Bean
    public OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler() {
        return new OAuth2AuthenticationSuccessHandler(jwtService, userRepo, roleRepo);
    }
}