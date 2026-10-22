import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import api from '../api/axios';
import { formatPrice, parsePromoTitle } from '../lib/catalog';

// Bloque "Liquidación" + marcas + disponibilidad inmediata.
const PromocionBanner = ({ brands = [], onBrand }) => {
  const [promociones, setPromociones] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/public/promociones').then((res) => setPromociones(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (promociones.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % promociones.length), 6000);
    return () => clearInterval(t);
  }, [promociones]);

  const promo = promociones[current];
  const { title, subtitle } = promo
    ? parsePromoTitle(promo.titulo)
    : { title: 'Liquidación de lentes de sol', subtitle: 'Hasta 40% OFF' };

  return (
    <section id="liquidacion" className="max-w-[1320px] mx-auto px-4 md:px-8 grid lg:grid-cols-[1.75fr_1fr] gap-4 md:gap-5 scroll-mt-32">
      {/* Liquidación */}
      <div className="relative overflow-hidden rounded-[28px] bg-ink text-white p-7 md:p-10 min-h-[340px] md:min-h-[420px] flex flex-col">
        <span className="label-mono text-[10px] md:text-[11px] text-pink-400">Promoción especial</span>
        <h2 className="font-display text-[40px] leading-[0.95] md:text-[56px] mt-4 md:max-w-[60%] relative z-10">{title}</h2>
        <p className="mt-5 text-sm md:text-[15px] text-white/80 md:max-w-[45%] relative z-10">
          {subtitle ? `${subtitle} en modelos seleccionados.` : 'Modelos seleccionados.'}
          <span className="hidden md:inline"> Livianos y con estuche incluido.</span>
        </p>

        <div className="mt-auto pt-8 flex items-end gap-4 relative z-10">
          {promo?.precio != null && (
            <div>
              <span className="text-xs text-white/60">Desde</span>
              <p className="font-display text-4xl md:text-[44px] leading-none">{formatPrice(promo.precio)}</p>
            </div>
          )}
          <Link
            to={promo ? `/promocion/${promo.id}` : '/#catalogo'}
            className="shrink-0 whitespace-nowrap rounded-full bg-white text-ink px-5 md:px-6 h-11 md:h-12 grid place-items-center text-sm font-medium hover:bg-pink-100 transition-colors"
          >
            <span className="hidden md:inline">Ver la liquidación</span>
            <span className="md:hidden">Ver promo</span>
          </Link>
        </div>

        {promo?.imagen1Url && (
          <div className="hidden md:block absolute right-[-4%] bottom-[-8%] w-[52%] rotate-[-6deg] rounded-3xl bg-white p-6 shadow-2xl">
            <img src={promo.imagen1Url} alt="" loading="eager" fetchPriority="high" className="w-full h-auto object-contain" />
          </div>
        )}

        {promociones.length > 1 && (
          <div className="absolute top-7 right-7 flex gap-1.5 z-10">
            {promociones.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Promoción ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:grid grid-rows-2 gap-5">
        {/* Marcas */}
        <div id="marcas" className="rounded-[28px] bg-white/70 border border-black/5 p-8 scroll-mt-32">
          <span className="label-mono text-[10px] text-muted">Nuestras marcas</span>
          <ul className="mt-4 space-y-1">
            {brands.slice(0, 4).map((b) => (
              <li key={b}>
                <button onClick={() => onBrand?.(b)} className="font-display text-[32px] leading-tight flex items-center gap-2 hover:text-magenta transition-colors">
                  {b} <FiArrowUpRight size={26} strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Disponibilidad inmediata */}
        <div className="rounded-[28px] bg-magenta text-white p-8 flex flex-col">
          <span className="label-mono text-[10px] text-white/70">Disponibilidad inmediata</span>
          <p className="font-display text-[26px] leading-[1.05] mt-auto">Probátelos en el local y llevalos en el día.</p>
        </div>
      </div>
    </section>
  );
};

export default PromocionBanner;
