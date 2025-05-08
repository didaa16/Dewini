package tn.dewini.backend.Configs.Urgence;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration ("urgenceConfig")
public class CorsConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Tous les chemins d'accès
                        .allowedOrigins("http://localhost:4200") // Autoriser l'origine spécifique
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Autoriser les méthodes spécifiques
                        .allowedHeaders("*"); // Autoriser tous les en-têtes
            }
        };
    }


}