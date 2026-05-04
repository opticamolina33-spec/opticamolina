// Archivo: src/main/java/opticamolina/demo/service/MercadoLibreSyncService.java
package opticamolina.demo.service;

import opticamolina.demo.model.Category;
import opticamolina.demo.model.Product;
import opticamolina.demo.repository.CategoryRepository;
import opticamolina.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MercadoLibreSyncService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public String syncProductsFromML() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 1. Obtener usuario (seller)
            ResponseEntity<Map> userResponse = restTemplate.exchange(
                    "https://api.mercadolibre.com/users/me",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            String userId = userResponse.getBody().get("id").toString();

            // 2. Buscar items del usuario
            ResponseEntity<Map> searchResponse = restTemplate.exchange(
                    "https://api.mercadolibre.com/users/" + userId + "/items/search",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Object resultsObj = searchResponse.getBody().get("results");

            List<String> itemIds = new ArrayList<>();

            if (resultsObj instanceof List<?> list) {
                for (Object o : list) {
                    itemIds.add(o.toString());
                }
            }

            if (itemIds.isEmpty()) {
                return "No se encontraron productos en Mercado Libre.";
            }

            // 3. Categoría por defecto
            Category defaultCategory = categoryRepository.findAll().stream()
                    .filter(c -> c.getName().equalsIgnoreCase("Importado de ML"))
                    .findFirst()
                    .orElseGet(() -> {
                        Category c = new Category();
                        c.setName("Importado de ML");
                        return categoryRepository.save(c);
                    });

            // 4. Obtener detalles de items
            String idsParam = itemIds.stream().collect(Collectors.joining(","));

            ResponseEntity<List> itemsResponse = restTemplate.exchange(
                    "https://api.mercadolibre.com/items?ids=" + idsParam,
                    HttpMethod.GET,
                    entity,
                    List.class
            );

            int agregados = 0;
            int actualizados = 0;

            for (Object obj : itemsResponse.getBody()) {

                Map<String, Object> wrapper = (Map<String, Object>) obj;
                Map<String, Object> itemData = (Map<String, Object>) wrapper.get("body");

                String mlId = (String) itemData.get("id");

                Product product = productRepository
                        .findByIdMercadoLibre(mlId)
                        .orElse(new Product());

                product.setIdMercadoLibre(mlId);
                product.setNombre((String) itemData.get("title"));

                Object priceObj = itemData.get("price");
                if (priceObj != null) {
                    product.setPrecio(Double.parseDouble(priceObj.toString()));
                }

                Object stockObj = itemData.get("available_quantity");
                if (stockObj != null) {
                    product.setStock(Integer.parseInt(stockObj.toString()));
                }

                String imgUrl = (String) itemData.get("secure_thumbnail");
                if (imgUrl != null) {
                    product.setImagenUrl(List.of(imgUrl.replace("-I.jpg", "-O.jpg")));
                }

                if (product.getId() == null) {
                    product.setCategory(defaultCategory);
                    agregados++;
                } else {
                    actualizados++;
                }

                productRepository.save(product);
            }

            return "Sincronización completa: " + agregados + " nuevos, " + actualizados + " actualizados.";

        } catch (Exception e) {
            throw new RuntimeException("Error sincronizando con ML: " + e.getMessage(), e);
        }
    }
}