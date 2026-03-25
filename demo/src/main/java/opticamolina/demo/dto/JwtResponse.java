
// Archivo: src/main/java/opticamolina/demo/dto/JwtResponse.java
package opticamolina.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String email;
    private List<String> roles;
}