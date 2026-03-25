// Archivo: src/main/java/opticamolina/demo/repositories/CategoryRepository.java
package opticamolina.demo.repository;

import opticamolina.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}