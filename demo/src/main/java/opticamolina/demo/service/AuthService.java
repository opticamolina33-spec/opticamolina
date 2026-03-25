// Archivo: src/main/java/opticamolina/demo/services/AuthService.java
package opticamolina.demo.service;

import opticamolina.demo.model.Role;
import opticamolina.demo.model.User;
import opticamolina.demo.repository.RoleRepository;
import opticamolina.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerUser(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            return "Error: El email ya está registrado.";
        }

        User user = new User();
        user.setEmail(email);
        // Encriptamos la contraseña antes de guardar
        user.setPassword(passwordEncoder.encode(password));

        // Asignamos el rol de CLIENTE por defecto
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Error: El rol no existe."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);
        return "Usuario registrado con éxito.";
    }
}