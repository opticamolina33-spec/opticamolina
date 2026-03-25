// Archivo: src/main/java/opticamolina/demo/repositories/RoleRepository.java
package opticamolina.demo.repository;

import opticamolina.demo.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}