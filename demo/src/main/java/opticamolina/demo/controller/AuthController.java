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
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RoleRepository roleRepository;

    // --- REGISTRO DE USUARIOS ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // 1. Verificamos si el email ya existe
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El email ya está registrado.");
        }

        // 2. Encriptamos la contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. Le asignamos el rol de CLIENTE (el que ya tenés en la DB por el DataInitializer)
        Role userRole = roleRepository.findByName("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Error: Rol ROLE_CLIENTE no encontrado en la base de datos."));

        user.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        // 4. Guardamos en Railway
        userRepository.save(user);

        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Buscamos al usuario por email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificamos la contraseña con BCrypt
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Generamos el Token JWT
            String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());

            // Obtenemos los nombres de los roles para el frontend
            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), roles));
        } else {
            return ResponseEntity.badRequest().body("Error: Contraseña incorrecta");
        }
    }
}