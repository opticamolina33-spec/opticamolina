// Archivo: src/main/java/opticamolina/demo/repository/VentaRepository.java
package opticamolina.demo.repository;

import opticamolina.demo.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findAllByOrderByFechaDesc();
}