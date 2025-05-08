package tn.dewini.backend;

import tn.dewini.backend.Entities.User.Role;
import tn.dewini.backend.Repositories.User.RoleRepo;
import tn.dewini.backend.Services.Rdv.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class backendApplication {

	@Bean
	public CommandLineRunner runner(RoleRepo roleRepository) {
		return args -> {
			if (roleRepository.findByName("USER").isEmpty()) {
				roleRepository.save(Role.builder().name("USER").build());
			}
			if (roleRepository.findByName("ADMIN").isEmpty()) {
				roleRepository.save(Role.builder().name("ADMIN").build());
			}
			if (roleRepository.findByName("MEDECIN").isEmpty()) {
				roleRepository.save(Role.builder().name("MEDECIN").build());
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(backendApplication.class, args);
	}


	@Bean
	public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
//    @Bean
//    CommandLineRunner testEmail(EmailService emailService) {
//        return args -> {
//            emailService.sendEmail(
//                    "samalitasnim83@gmail.com",  // Remplacez
//                    "Test réussi",
//                    "Email envoyé depuis Spring Boot avec Gmail !"
//            );
//            System.out.println("✅ Email envoyé ! Vérifiez les spams si non reçu.");
//        };
//    }

}

