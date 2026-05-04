package opticamolina.demo.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import opticamolina.demo.model.Venta;
import opticamolina.demo.repository.VentaRepository;
import opticamolina.demo.repository.UserRepository;
import opticamolina.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private UserRepository userRepository;

    // -------------------------------------------------------------------
    // MÉTODO 1: Para Billetera Virtual (Checkout Pro)
    // -------------------------------------------------------------------
    public Map<String, String> createPreference(String title, Double price, Integer quantity) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(title)
                    .quantity(quantity)
                    .unitPrice(new BigDecimal(price))
                    .currencyId("ARS")
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://opticamolina.vercel.app/success")
                    .pending("https://opticamolina.vercel.app/pending")
                    .failure("https://opticamolina.vercel.app/failure")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return Map.of(
                    "id", preference.getId(),
                    "url", preference.getInitPoint()
            );

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al crear la preferencia: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------
    // MÉTODO 2: Para Tarjeta Directa (Card Payment Brick) + GUARDADO EN DB
    // -------------------------------------------------------------------
    public Payment processCardPayment(Map<String, Object> paymentData) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            @SuppressWarnings("unchecked")
            Map<String, Object> payerMap = (Map<String, Object>) paymentData.get("payer");
            String email = payerMap.get("email").toString();

            // Intentamos obtener datos del usuario de nuestra DB para la dirección
            User usuario = userRepository.findByEmail(email).orElse(null);
            String nombre = (usuario != null) ? usuario.getName() : "Cliente Checkout API";
            String direccion = (usuario != null && usuario.getAddress() != null) ? usuario.getAddress() : "Dirección no proporcionada";

            // Armamos la solicitud de cobro directo
            PaymentCreateRequest paymentCreateRequest = PaymentCreateRequest.builder()
                    .transactionAmount(new BigDecimal(paymentData.get("transaction_amount").toString()))
                    .token(paymentData.get("token").toString())
                    .description(paymentData.get("description").toString())
                    .installments(Integer.parseInt(paymentData.get("installments").toString()))
                    .paymentMethodId(paymentData.get("payment_method_id").toString())
                    .payer(PaymentPayerRequest.builder()
                            .email(email)
                            .build())
                    .build();

            PaymentClient client = new PaymentClient();
            Payment payment = client.create(paymentCreateRequest);

            // --- GUARDAR EN LA BASE DE DATOS CON EL NUEVO CONSTRUCTOR ---
            if (payment != null && payment.getId() != null) {
                Venta nuevaVenta = new Venta(
                        payment.getId().toString(),                  // paymentIdMp
                        payment.getDescription(),                     // producto
                        payment.getTransactionAmount().doubleValue(), // monto
                        payment.getStatus(),                          // estado
                        email,                                        // emailCliente
                        nombre,                                       // nombreCliente
                        direccion,                                    // direccionEntrega
                        payment.getPaymentMethodId()                  // metodoPago
                );

                ventaRepository.save(nuevaVenta);
                System.out.println("Venta guardada exitosamente en DB: " + payment.getId());
            }

            return payment;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error procesando el pago con tarjeta: " + e.getMessage());
        }
    }
}