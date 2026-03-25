// Archivo: src/main/java/opticamolina/demo/services/PaymentService.java
package opticamolina.demo.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    public String createPreference(String title, Double price, Integer quantity) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            // 1. Definimos el producto (anteojos, lentes, etc)
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(title)
                    .quantity(quantity)
                    .unitPrice(new BigDecimal(price))
                    .currencyId("ARS")
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            // 2. Configuramos las URLs de retorno (donde vuelve el usuario después de pagar)
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173/success") // Tu front en React
                    .pending("http://localhost:5173/pending")
                    .failure("http://localhost:5173/failure")
                    .build();

            // 3. Creamos la preferencia total
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .autoReturn("approved") // Vuelve solo al front si el pago se aprueba
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            // Devolvemos el link de pago (init_point)
            return preference.getInitPoint();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error al crear la preferencia: " + e.getMessage();
        }
    }
}