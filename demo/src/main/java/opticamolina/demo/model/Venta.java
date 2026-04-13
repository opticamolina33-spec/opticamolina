// Archivo: src/main/java/opticamolina/demo/model/Venta.java
package opticamolina.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentIdMp; // El ID de Mercado Pago
    private String producto;
    private Double monto;
    private String estado;
    private LocalDateTime fecha;

    // Constructor vacío para JPA
    public Venta() {}

    // Constructor útil para nosotros
    public Venta(String paymentIdMp, String producto, Double monto, String estado) {
        this.paymentIdMp = paymentIdMp;
        this.producto = producto;
        this.monto = monto;
        this.estado = estado;
        this.fecha = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public String getPaymentIdMp() { return paymentIdMp; }
    public String getProducto() { return producto; }
    public Double getMonto() { return monto; }
    public String getEstado() { return estado; }
    public LocalDateTime getFecha() { return fecha; }
}