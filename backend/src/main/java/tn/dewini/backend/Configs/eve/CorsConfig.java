package tn.dewini.backend.Configs.eve;  // Assure-toi que c'est le bon package !

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // Indique à Spring que c'est une classe de configuration
public class CorsConfig {

    @Bean  // Crée un bean Spring qui sera chargé au démarrage
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // Autorise tous les endpoints
                        .allowedOrigins("http://localhost:4200")  // Autorise Angular
                        .allowedMethods("GET", "POST", "PUT", "DELETE")  // Méthodes HTTP autorisées
                        .allowedHeaders("*");  // Headers autorisés
            }
        };
    }
}