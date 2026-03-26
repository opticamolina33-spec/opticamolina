// Archivo: src/main/java/opticamolina/demo/security/JwtUtils.java
package opticamolina.demo.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    private final String jwtSecret = "OpticaMolinaSecretKeySuperSecure2026_For_Development";
    private final int jwtExpirationMs = 86400000; // 24 horas

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // 1. MODIFICADO: Ahora recibe la Autenticación para sacar los roles
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        // Extraemos los roles de la autoridad de Spring
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("roles", roles) // <--- GUARDAMOS LOS ROLES EN EL TOKEN
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Asegurate de que el método de generación use .claim("roles", roles)
// Y el de lectura sea así:
    public List<String> getRolesFromJwtToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Retornamos la lista de roles, o null si no existe (el Filter lo manejará)
            return claims.get("roles", List.class);
        } catch (Exception e) {
            return null;
        }
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}