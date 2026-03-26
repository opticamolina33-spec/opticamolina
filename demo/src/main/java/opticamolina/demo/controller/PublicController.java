// Archivo: src/main/java/opticamolina/demo/controller/PublicController.java
package opticamolina.demo.controller;

import opticamolina.demo.model.Category;
import opticamolina.demo.model.Product;
import opticamolina.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private ProductService productService;

    // ESTE ENDPOINT ES VITAL PARA QUE EL FORMULARIO DE REACT CARGUE LAS OPCIONES
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
}