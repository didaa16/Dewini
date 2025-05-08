package tn.dewini.backend.Controllers.Consultation;

import org.hibernate.TransientPropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(
        value = "tn.dewini.backend.Controllers.Consultation",
        assignableTypes = {ConsultationRestController.class} // Optional: limit to specific controllers
)
public class GlobalExceptionHandlerConsultation {
    @ExceptionHandler(TransientPropertyValueException.class)
    public ResponseEntity<String> handleTransientProperty(TransientPropertyValueException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Referenced Entities not persisted: " + ex.getMessage());
    }
}