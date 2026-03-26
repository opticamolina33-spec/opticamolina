// Archivo: src/main/java/opticamolina/demo/repository/CategoryRepository.java
package opticamolina.demo.repository;

import opticamolina.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}