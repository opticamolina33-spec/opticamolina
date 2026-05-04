// Archivo: src/main/java/opticamolina/demo/DataInitializer.java
package opticamolina.demo;

import opticamolina.demo.model.Role;
import opticamolina.demo.model.User;
import opticamolina.demo.repository.RoleRepository;
import opticamolina.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Aseguramos los Roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_ADMIN");
                    return roleRepository.save(role);
                });

        if (roleRepository.findByName("ROLE_CLIENTE").isEmpty()) {
            Role clientRole = new Role();
            clientRole.setName("ROLE_CLIENTE");
            roleRepository.save(clientRole);
        }

        // 2. Creamos el Admin (Solo con Email y Password, que son tus campos)
        if (userRepository.findByEmail("admin@optica.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@optica.com");
            admin.setPassword(passwordEncoder.encode("admin123"));

            // Asignamos el rol usando el Set de tu entidad
            admin.setRoles(new HashSet<>(Collections.singletonList(adminRole)));

            userRepository.save(admin);

            System.out.println("-----------------------------------------");
            System.out.println("✅ ADMIN CREADO EXITOSAMENTE");
            System.out.println("Login: admin@optica.com / admin123");
            System.out.println("-----------------------------------------");
        }
    }
}