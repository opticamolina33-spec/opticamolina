package opticamolina.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentIdMp;
    private String producto;
    private Double monto;
    private String estado;
    private LocalDateTime fecha;

    // --- NUEVOS CAMPOS ---
    private String emailCliente;
    private String nombreCliente;
    private String direccionEntrega;
    private String metodoPago; // ej: visa, mastercard, account_money

    public Venta() {}

    public Venta(String paymentIdMp, String producto, Double monto, String estado, 
                 String emailCliente, String nombreCliente, String direccionEntrega, String metodoPago) {
        this.paymentIdMp = paymentIdMp;
        this.producto = producto;
        this.monto = monto;
        this.estado = estado;
        this.emailCliente = emailCliente;
        this.nombreCliente = nombreCliente;
        this.direccionEntrega = direccionEntrega;
        this.metodoPago = metodoPago;
        this.fecha = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getPaymentIdMp() { return paymentIdMp; }
    public String getProducto() { return producto; }
    public Double getMonto() { return monto; }
    public String getEstado() { return estado; }
    public LocalDateTime getFecha() { return fecha; }
    public String getEmailCliente() { return emailCliente; }
    public String getNombreCliente() { return nombreCliente; }
    public String getDireccionEntrega() { return direccionEntrega; }
    public String getMetodoPago() { return metodoPago; }
}