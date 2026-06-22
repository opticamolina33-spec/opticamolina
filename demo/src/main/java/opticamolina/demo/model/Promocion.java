package opticamolina.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "promociones")
@Data
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Double precio;

    private String imagen1Url;
    private String imagen2Url;

    // Color del fondo (gradient), ej: "from-zinc-900 to-pink-950"
    private String colorFondo;

    // Si la promo está activa y se muestra en el Home
    private Boolean activa = true;
}