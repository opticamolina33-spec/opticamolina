// Archivo: src/main/java/opticamolina/demo/controller/VentaController.java
package opticamolina.demo.controller;

import opticamolina.demo.model.Venta;
import opticamolina.demo.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @GetMapping("/historial")
    public List<Venta> getHistorial() {
        return ventaRepository.findAllByOrderByFechaDesc();
    }
}