// Archivo: src/main/java/opticamolina/demo/controllers/AuthController.java
package opticamolina.demo.controller;

import opticamolina.demo.dto.JwtResponse;
import opticamolina.demo.dto.LoginRequest;
import opticamolina.demo.model.User;
import opticamolina.demo.repository.UserRepository;
import opticamolina.demo.config.JwtUtils;
import opticamolina.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Para que React no tenga problemas de CORS al inicio
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest signUpRequest) {
        String result = authService.registerUser(signUpRequest.getEmail(), signUpRequest.getPassword());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Buscamos al usuario
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificamos la contraseña
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Generamos el Token
            String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());

            // Obtenemos los nombres de los roles
            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), roles));
        } else {
            return ResponseEntity.badRequest().body("Error: Contraseña incorrecta");
        }
    }
}