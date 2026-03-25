// Archivo: src/main/java/opticamolina/demo/models/Product.java
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

    private String name;
    private String description;
    private Double price;
    private Integer stock; // Control de stock para el Admin

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}