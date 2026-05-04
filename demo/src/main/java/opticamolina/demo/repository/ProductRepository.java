// Archivo: src/main/java/opticamolina/demo/repository/ProductRepository.java
package opticamolina.demo.repository;

import opticamolina.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Para filtrar por categoría en el e-commerce
    List<Product> findByCategoryId(Long categoryId);
    Optional<Product> findByIdMercadoLibre(String idMercadoLibre);
}

