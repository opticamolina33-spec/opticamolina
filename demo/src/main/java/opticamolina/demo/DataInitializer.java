package opticamolina.demo;

import opticamolina.demo.model.Role;
import opticamolina.demo.model.User;
import opticamolina.demo.model.Category;
import opticamolina.demo.repository.RoleRepository;
import opticamolina.demo.repository.UserRepository;
import opticamolina.demo.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // ========================
        // 1. ROLES
        // ========================
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

        // ========================
        // 2. ADMIN
        // ========================
        if (userRepository.findByEmail("admin@optica.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@optica.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(new HashSet<>(Collections.singletonList(adminRole)));

            userRepository.save(admin);

            System.out.println("✅ ADMIN CREADO");
        }

        // ========================
        // 3. CATEGORÍAS
        // ========================
        List<String> categoryNames = Arrays.asList(
                "Lentes de sol",
                "Lentes recetados",
                "Lentes de contacto",
                "Liquidos",
                "Niños",
                "Accesorios"
        );

        List<Category> existingCategories = categoryRepository.findAll();

        for (String name : categoryNames) {

            boolean exists = existingCategories.stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(name));

            if (!exists) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);

                System.out.println("✔ Categoría creada: " + name);
            }
        }
    }
}