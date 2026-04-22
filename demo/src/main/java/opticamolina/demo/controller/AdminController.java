// Archivo: src/main/java/opticamolina/demo/controller/AdminController.java
package opticamolina.demo.controller;

import opticamolina.demo.model.Category;
import opticamolina.demo.model.Product;
import opticamolina.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductService productService;

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(productService.saveCategory(category));
    }

    @PostMapping("/products/{categoryId}")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, @PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.saveProduct(product, categoryId));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Producto eliminado correctamente");
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStockOnly(@PathVariable Long id, @RequestBody Map<String, Integer> update) {
        Integer quantity = update.get("quantity");
        return ResponseEntity.ok(productService.updateStock(id, quantity));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Dentro de src/main/java/opticamolina/demo/controller/AdminController.java

    @Autowired
    private opticamolina.demo.service.MercadoLibreSyncService mlSyncService;

    @PostMapping("/mercadolibre/sync")
    public ResponseEntity<Map<String, String>> syncMercadoLibre() {
        try {
            String result = mlSyncService.syncProductsFromML();
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}