package tn.dewini.backend.Services.eve;



import tn.dewini.backend.Entities.eve.Participant;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    private static final int WIDTH = 300;
    private static final int HEIGHT = 300;
    private static final String FORMAT = "png";

    public String generateQRCode(Participant participant) {
        try {
            String qrContent = String.format(
                    "Participant ID: %d\nEvent ID: %d\nRole: %s\nType: %s",
                    participant.getId(),
                    participant.getEvenement().getId(),
                    participant.getRole(),
                    participant.getType()
            );

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                    qrContent,
                    BarcodeFormat.QR_CODE,
                    WIDTH,
                    HEIGHT,
                    hints
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, FORMAT, outputStream);

            return "data:image/png;base64," +
                    Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (WriterException e) {
            throw new RuntimeException("Erreur lors de la génération du QR Code", e);
        } catch (Exception e) {
            throw new RuntimeException("Erreur système", e);
        }
    }
}