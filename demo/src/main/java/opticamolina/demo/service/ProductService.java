// Archivo: src/main/java/opticamolina/demo/service/ProductService.java
package opticamolina.demo.service;

import opticamolina.demo.model.Category;
import opticamolina.demo.model.Product;
import opticamolina.demo.repository.CategoryRepository;
import opticamolina.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

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

        product.setNombre(productDetails.getNombre());
        product.setMarca(productDetails.getMarca());
        product.setDescripcion(productDetails.getDescripcion());
        product.setPrecio(productDetails.getPrecio());
        product.setStock(productDetails.getStock());
        product.setColor(productDetails.getColor());
        product.setTamanio(productDetails.getTamanio());
        product.setMaterial(productDetails.getMaterial());
        product.setForma(productDetails.getForma());
        product.setImagenUrl(productDetails.getImagenUrl());
        product.setTieneDescuento(productDetails.getTieneDescuento());
        product.setPorcentajeDescuento(productDetails.getPorcentajeDescuento());

        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }

        return productRepository.save(product);
    }

    public Product updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int nuevoStock = product.getStock() + quantity;
        if (nuevoStock < 0) throw new RuntimeException("No hay stock suficiente");

        product.setStock(nuevoStock);
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}