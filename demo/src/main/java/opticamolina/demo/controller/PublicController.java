// Archivo: src/main/java/opticamolina/demo/controller/PublicController.java
package opticamolina.demo.controller;

import opticamolina.demo.model.Category;
import opticamolina.demo.model.Product;
import opticamolina.demo.model.Promocion;
import opticamolina.demo.service.ProductService;
import opticamolina.demo.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private ProductService productService;

    @Autowired
    private PromocionService promocionService;

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return productService.getAllCategories();
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/products/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── PROMOCIONES (público) ────────────────────────────────────────────────
    @GetMapping("/promociones")
    public ResponseEntity<List<Promocion>> getPromocionesActivas() {
        return ResponseEntity.ok(promocionService.getPromocionesActivas());
    }

    @GetMapping("/promociones/{id}")
    public ResponseEntity<Promocion> getPromocionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(promocionService.getPromocionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}