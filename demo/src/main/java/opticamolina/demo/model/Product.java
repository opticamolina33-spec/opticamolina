// Archivo: src/main/java/opticamolina/demo/model/Product.java
package opticamolina.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- NUEVO CAMPO PARA ML ---
    @Column(unique = true)
    private String idMercadoLibre;

    // Datos principales
    private String nombre;
    private String marca;
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    private Double precio;
    private Integer stock;

    // Especificaciones
    private String color;
    private String tamanio;
    private String material;
    private String forma;

    // Imagen
    private String imagenUrl;

    // Descuento
    private Boolean tieneDescuento;
    private Integer porcentajeDescuento;

    // Relación
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}