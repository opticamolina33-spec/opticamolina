// Archivo: src/main/java/opticamolina/demo/controller/AuthController.java
package opticamolina.demo.controller;

import opticamolina.demo.dto.JwtResponse;
import opticamolina.demo.dto.LoginRequest;
import opticamolina.demo.model.Role;
import opticamolina.demo.model.User;
import opticamolina.demo.repository.RoleRepository;
import opticamolina.demo.repository.UserRepository;
import opticamolina.demo.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El email ya está registrado.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role userRole = roleRepository.findByName("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Error: Rol ROLE_CLIENTE no encontrado."));
        user.setRoles(new HashSet<>(Collections.singletonList(userRole)));
        userRepository.save(user);
        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    // --- LOGIN MANUAL (SIN AUTHENTICATION MANAGER PARA EVITAR BUCLE) ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        // 1. Buscamos el usuario en la DB
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        // 2. Validamos existencia y contraseña
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

            // 3. Sacamos los nombres de los roles
            List<String> roles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList());

            // 4. Generamos el token con los datos que ya tenemos
            String jwt = jwtUtils.generateJwtToken(user.getEmail(), roles);

            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), roles));
        } else {
            return ResponseEntity.status(401).body("Error: Credenciales inválidas");
        }
    }
}