// Archivo: src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { STORE } from '../lib/catalog';

const Footer = () => (
  <footer className="bg-ink text-white pb-24 lg:pb-0">
    <div className="max-w-[1320px] mx-auto px-6 md:px-8 pt-16 pb-10">
      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl md:text-4xl tracking-[0.02em]">ÓPTICA MOLINA</p>
          <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
            Su óptica de confianza en Córdoba. Colecciones de autor, disponibilidad inmediata y envíos a todo el país.
          </p>
        </div>

        <div>
          <p className="label-mono text-[10px] text-white/50 mb-4">Tienda</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/#catalogo" className="hover:text-magenta transition-colors">Lentes de sol</Link></li>
            <li><Link to="/#catalogo" className="hover:text-magenta transition-colors">Armazones</Link></li>
            <li><Link to="/#liquidacion" className="hover:text-magenta transition-colors">Liquidación</Link></li>
          </ul>
        </div>

        <div>
          <p className="label-mono text-[10px] text-white/50 mb-4">Marcas</p>
          <ul className="space-y-2 text-sm">
            {['Vulk', 'Rusty', 'Tascani'].map((b) => (
              <li key={b}>
                <Link to={`/?marca=${b}#catalogo`} className="hover:text-magenta transition-colors">{b}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-mono text-[10px] text-white/50 mb-4">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li><a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-magenta transition-colors">{STORE.address}</a></li>
            <li><a href={STORE.phoneHref} className="hover:text-magenta transition-colors">{STORE.phone}</a></li>
            <li className="text-white/80">{STORE.hoursShort}</li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-6 border-t border-white/10 text-[11px] text-white/40">
        © 2026 Óptica Molina · Vanguardia visual · Argentina
      </div>
    </div>
  </footer>
);

export default Footer;
