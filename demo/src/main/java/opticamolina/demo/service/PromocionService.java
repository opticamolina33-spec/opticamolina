package opticamolina.demo.service;

import opticamolina.demo.model.Promocion;
import opticamolina.demo.repository.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromocionService {

    @Autowired
    private PromocionRepository promocionRepository;

    public List<Promocion> getAllPromociones() {
        return promocionRepository.findAll();
    }

    public List<Promocion> getPromocionesActivas() {
        return promocionRepository.findByActivaTrue();
    }

    public Promocion getPromocionById(Long id) {
        return promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada con id: " + id));
    }

    public Promocion savePromocion(Promocion promocion) {
        if (promocion.getActiva() == null) {
            promocion.setActiva(true);
        }
        return promocionRepository.save(promocion);
    }

    public Promocion updatePromocion(Long id, Promocion details) {
        Promocion existing = getPromocionById(id);
        existing.setTitulo(details.getTitulo());
        existing.setDescripcion(details.getDescripcion());
        existing.setPrecio(details.getPrecio());
        existing.setImagen1Url(details.getImagen1Url());
        existing.setImagen2Url(details.getImagen2Url());
        existing.setColorFondo(details.getColorFondo());
        existing.setActiva(details.getActiva());
        return promocionRepository.save(existing);
    }

    public void deletePromocion(Long id) {
        promocionRepository.deleteById(id);
    }
}