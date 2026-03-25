// Archivo: src/main/java/opticamolina/demo/controllers/PaymentController.java
package opticamolina.demo.controller;

import opticamolina.demo.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public Map<String, String> create(@RequestBody Map<String, Object> data) {
        // Obtenemos los datos del JSON que manda el front
        String title = (String) data.get("title");
        Double price = Double.parseDouble(data.get("price").toString());
        Integer quantity = Integer.parseInt(data.get("quantity").toString());

        String url = paymentService.createPreference(title, price, quantity);

        return Map.of("url", url);
    }
}