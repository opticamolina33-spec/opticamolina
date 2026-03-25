// Archivo: src/main/java/opticamolina/demo/service/ProductService.java
package opticamolina.demo.service;

import opticamolina.demo.model.Category;
import opticamolina.demo.model.Product;
import opticamolina.demo.repository.CategoryRepository;
import opticamolina.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // --- Categorías ---
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // --- Productos ---
    public Product saveProduct(Product product, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        product.setCategory(category);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock()); // Actualización manual de stock

        // Si cambia de categoría
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }

        return productRepository.save(product);
    }

    // Método específico para "sacar" o "agregar" unidades rápidamente
    public Product updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int nuevoStock = product.getStock() + quantity;
        if (nuevoStock < 0) throw new RuntimeException("No hay stock suficiente");

        product.setStock(nuevoStock);
        return productRepository.save(product);
    }
    // En ProductService.java
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}