// Archivo: src/main/java/opticamolina/demo/repositories/UserRepository.java
package opticamolina.demo.repository;

import opticamolina.demo.model.Role;
import opticamolina.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
