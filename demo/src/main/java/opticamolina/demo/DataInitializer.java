// Archivo: src/main/java/opticamolina/demo/DataInitializer.java
package opticamolina.demo;

import opticamolina.demo.model.Role;
import opticamolina.demo.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }
        if (roleRepository.findByName("ROLE_CLIENTE").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("ROLE_CLIENTE");
            roleRepository.save(userRole);
        }
    }
}