// Archivo: src/main/java/opticamolina/demo/controller/PaymentController.java
package opticamolina.demo.controller;

import opticamolina.demo.service.PaymentService;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // -------------------------------------------------------------------
    // ENDPOINT 1: Genera el link para "Billetera Virtual"
    // -------------------------------------------------------------------
    @PostMapping("/create")
    public Map<String, String> create(@RequestBody Map<String, Object> data) {
        try {
            String title = (String) data.get("title");
            Double price = Double.valueOf(data.get("price").toString());
            Integer quantity = Integer.valueOf(data.get("quantity").toString());

            return paymentService.createPreference(title, price, quantity);

        } catch (Exception e) {
            return Map.of("error", "No se pudo crear la preferencia de pago: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------
    // ENDPOINT 2: Procesa el pago directo con Tarjeta
    // -------------------------------------------------------------------
    @PostMapping("/process")
    public Map<String, Object> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            // Mandamos los datos del Brick al Service
            Payment payment = paymentService.processCardPayment(paymentData);

            // Le respondemos a React cómo salió la operación
            return Map.of(
                    "status", payment.getStatus(), // Puede ser "approved", "rejected", "in_process"
                    "id", payment.getId()
            );

        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "message", e.getMessage()
            );
        }
    }
}