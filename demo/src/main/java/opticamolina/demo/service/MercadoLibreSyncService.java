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

import java.util.List;
import java.util.Map;

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
            // 1. Obtener el ID del Usuario (Seller)
            ResponseEntity<Map> userResponse = restTemplate.exchange(
                    "https://api.mercadolibre.com/users/me", HttpMethod.GET, entity, Map.class);
            String userId = userResponse.getBody().get("id").toString();

            // 2. Buscar todos los items de este usuario
            ResponseEntity<Map> searchResponse = restTemplate.exchange(
                    "https://api.mercadolibre.com/users/" + userId + "/items/search", HttpMethod.GET, entity, Map.class);
            List<String> itemIds = (List<String>) searchResponse.getBody().get("results");

            if (itemIds == null || itemIds.isEmpty()) return "No se encontraron productos en Mercado Libre.";

            // 3. Crear Categoría "Importado de ML" si no existe
            Category defaultCategory = categoryRepository.findAll().stream()
                    .filter(c -> c.getName().equalsIgnoreCase("Importado de ML"))
                    .findFirst()
                    .orElseGet(() -> {
                        Category c = new Category();
                        c.setName("Importado de ML");
                        return categoryRepository.save(c);
                    });

            // 4. Traer detalles de los items (Máximo 20 por petición según la API de ML)
            String idsParam = String.join(",", itemIds);
            ResponseEntity<List> itemsResponse = restTemplate.exchange(
                    "https://api.mercadolibre.com/items?ids=" + idsParam, HttpMethod.GET, entity, List.class);

            int agregados = 0;
            int actualizados = 0;

            for (Object obj : itemsResponse.getBody()) {
                Map<String, Object> itemData = (Map<String, Object>) ((Map<String, Object>) obj).get("body");
                String mlId = (String) itemData.get("id");

                Product product = productRepository.findByIdMercadoLibre(mlId).orElse(new Product());

                product.setIdMercadoLibre(mlId);
                product.setNombre((String) itemData.get("title"));
                product.setPrecio(Double.valueOf(itemData.get("price").toString()));
                product.setStock((Integer) itemData.get("available_quantity"));

                // Aplicamos tu lógica para la imagen de alta calidad
                String imgUrl = (String) itemData.get("secure_thumbnail");
                if (imgUrl != null) {
                    product.setImagenUrl(imgUrl.replace("-I.jpg", "-O.jpg"));
                }

                if (product.getId() == null) {
                    product.setCategory(defaultCategory); // Solo le ponemos esta categoría si es nuevo
                    agregados++;
                } else {
                    actualizados++;
                }

                productRepository.save(product);
            }

            return "Sincronización completa: " + agregados + " nuevos, " + actualizados + " actualizados.";

        } catch (Exception e) {
            throw new RuntimeException("Error sincronizando con ML: " + e.getMessage());
        }
    }
}