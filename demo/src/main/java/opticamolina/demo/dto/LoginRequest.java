// Archivo: src/main/java/opticamolina/demo/dto/LoginRequest.java
package opticamolina.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
