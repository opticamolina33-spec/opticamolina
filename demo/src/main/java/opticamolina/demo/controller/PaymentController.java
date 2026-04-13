// Archivo: src/main/java/opticamolina/demo/controller/PaymentController.java
package opticamolina.demo.controller;

import opticamolina.demo.service.PaymentService;
import opticamolina.demo.model.Venta;
import opticamolina.demo.repository.VentaRepository;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.client.payment.PaymentClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private VentaRepository ventaRepository;

    // -------------------------------------------------------------------
    // 1. GENERA EL LINK PARA BILLETERA VIRTUAL (Checkout Pro)
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
    // 2. PROCESA EL PAGO DIRECTO CON TARJETA (Checkout API)
    // -------------------------------------------------------------------
    @PostMapping("/process")
    public Map<String, Object> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            // El service procesa el cobro y YA guarda en DB (según el service que armamos)
            Payment payment = paymentService.processCardPayment(paymentData);

            return Map.of(
                    "status", payment.getStatus(),
                    "id", payment.getId()
            );

        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "message", e.getMessage()
            );
        }
    }

    // -------------------------------------------------------------------
    // 3. CONFIRMA Y GUARDA PAGO DE BILLETERA (Al volver a /success)
    // -------------------------------------------------------------------
    @GetMapping("/confirm-order")
    public Map<String, Object> confirmOrder(@RequestParam("payment_id") String paymentId) {
        try {
            // Usamos el SDK para traer los datos reales del pago desde MP
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.parseLong(paymentId));

            if (payment != null) {
                // Verificamos si ya existe en nuestra DB para no duplicar
                // (Opcional, pero recomendado)

                Venta nuevaVenta = new Venta(
                        payment.getId().toString(),
                        payment.getDescription(),
                        payment.getTransactionAmount().doubleValue(),
                        payment.getStatus()
                );

                ventaRepository.save(nuevaVenta);

                return Map.of(
                        "status", "saved",
                        "payment_status", payment.getStatus()
                );
            }
            return Map.of("status", "error", "message", "Pago no encontrado en Mercado Pago");

        } catch (Exception e) {
            return Map.of("status", "error", "message", e.getMessage());
        }
    }
}