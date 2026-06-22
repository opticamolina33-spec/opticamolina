import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PromocionBanner = () => {
  const [promociones, setPromociones] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/public/promociones')
      .then(res => {
        setPromociones(res.data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Auto-slide cada 6 segundos si hay más de 1 promo
  useEffect(() => {
    if (promociones.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % promociones.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [promociones]);

  if (!loaded || promociones.length === 0) return null;

  const promo = promociones[current];

  // Paletas de fondo predefinidas (se elige por colorFondo o por índice)
  const palettes = {
    'zinc-pink':   'from-zinc-950 via-zinc-900 to-pink-950',
    'slate-rose':  'from-slate-950 via-slate-900 to-rose-950',
    'gray-indigo': 'from-gray-950 via-gray-900 to-indigo-950',
    'stone-amber': 'from-stone-950 via-stone-900 to-amber-950',
    'black-purple':'from-black via-zinc-950 to-purple-950',
  };
  const paletteKeys = Object.keys(palettes);
  const gradientClass = palettes[promo.colorFondo] || palettes[paletteKeys[current % paletteKeys.length]];

  return (
    <section className="relative w-full overflow-hidden">
      {/* ── Fondo degradado ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-all duration-1000`} />

      {/* Ruido sutil (grano) */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Orbe decorativo */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

      {/* ── Contenido ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Columna izquierda: texto */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Etiqueta */}
            <div className="inline-flex items-center gap-2 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-300">
                Promoción especial
              </span>
            </div>

            {/* Título */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter italic uppercase leading-none mb-6">
              {promo.titulo}
            </h2>

            {/* Descripción */}
            {promo.descripcion && (
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-md mb-8">
                {promo.descripcion}
              </p>
            )}

            {/* Precio + CTA */}
            <div className="flex flex-wrap items-center gap-6">
              {promo.precio && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Precio</span>
                  <span className="text-4xl font-black text-white tracking-tighter italic">
                    ${promo.precio.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">ARS</span>
                </div>
              )}

              <button
                onClick={() => navigate(`/promocion/${promo.id}`)}
                className="group relative overflow-hidden bg-white text-black font-black py-4 px-10 rounded-2xl text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-pink-50 active:scale-95 shadow-2xl shadow-white/10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Ver promoción
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Columna derecha: dos imágenes */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-[280px] md:min-h-[380px]">

            {/* Imagen 2 (fondo, ladeada) */}
            {promo.imagen2Url && (
              <div
                className="absolute right-0 top-2 w-[42%] md:w-[38%] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 bg-white"
                style={{ transform: 'rotate(7deg) translateY(14px)', padding: '10%' }}
              >
                <img
                  src={promo.imagen2Url}
                  alt="Promo imagen 2"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Imagen 1 (frente, prominente) */}
            {promo.imagen1Url && (
              <div
                className="relative left-0 w-[48%] md:w-[44%] rounded-2xl overflow-hidden shadow-2xl shadow-black/70 border border-white/10 bg-white z-10"
                style={{ transform: 'rotate(-5deg) translateY(-10px)', padding: '10%' }}
              >
                <img
                  src={promo.imagen1Url}
                  alt="Promo imagen 1"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Glow de fondo entre las imágenes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 bg-pink-500/15 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* ── Dots de navegación ── */}
        {promociones.length > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {promociones.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  clearInterval(intervalRef.current);
                }}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromocionBanner;