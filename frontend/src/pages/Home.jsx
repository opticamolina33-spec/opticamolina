import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiSun, FiFeather, FiBox, FiTruck, FiSliders } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { TbSunglasses } from 'react-icons/tb';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import PromocionBanner from '../components/PromocionBanner';
import Footer from '../components/Footer';
import {
  STORE,
  brandsOf,
  firstImage,
  formatPrice,
  isAcetate,
  isGFlex,
  isPolarized,
  specsLine,
  splitName,
  whatsappUrl,
} from '../lib/catalog';

const FEATURES = [
  { icon: FiSun, label: 'Protección UV', short: 'Protección UV' },
  { icon: TbSunglasses, label: 'Lentes polarizados', short: 'Polarizados' },
  { icon: FiFeather, label: 'Material liviano', short: 'Material liviano' },
  { icon: FiBox, label: 'Incluye estuche y paño', short: 'Estuche y paño' },
  { icon: FiTruck, label: 'Envíos a todo el país', short: 'Envíos a todo el país' },
];

const TAGS = [
  { key: 'polarizados', label: 'Polarizados', test: isPolarized },
  { key: 'acetato', label: 'Acetato', test: isAcetate },
  { key: 'gflex', label: 'G-Flex', test: isGFlex },
  { key: 'menos100', label: 'Menos de $100.000', test: (p) => Number(p.precio) < 100000 },
];

const SORTS = {
  destacados: { label: 'Destacados', fn: null },
  precio_asc: { label: 'Menor precio', fn: (a, b) => a.precio - b.precio },
  precio_desc: { label: 'Mayor precio', fn: (a, b) => b.precio - a.precio },
  marca: { label: 'Marca', fn: (a, b) => splitName(a).brand.localeCompare(splitName(b).brand) },
};

const INITIAL_VISIBLE = 8;

const Chip = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`shrink-0 rounded-full px-4 h-9 text-[13px] border transition-colors ${
      active ? 'bg-ink text-white border-ink' : 'bg-white/60 border-black/10 text-ink/80 hover:border-ink/40'
    }`}
  >
    {children}
  </button>
);

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const marcaParam = params.get('marca') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(marcaParam);
  const [tag, setTag] = useState('');
  const [sortBy, setSortBy] = useState('destacados');
  const [showAll, setShowAll] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    api
      .get('/public/products')
      .then((res) => setProducts(res.data || []))
      .catch((error) => console.error('Error al cargar datos:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setBrand(marcaParam);
  }, [marcaParam]);

  // Scroll a la sección del hash (#catalogo, #visitanos...) una vez cargado
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash, location.search, loading]);

  const brands = useMemo(() => brandsOf(products), [products]);

  const featured = useMemo(
    () => products.find((p) => /levol/i.test(p.nombre)) || products.find((p) => firstImage(p)),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const tagTest = TAGS.find((t) => t.key === tag)?.test;
    let list = products.filter(
      (p) =>
        (!brand || splitName(p).brand.toLowerCase() === brand.toLowerCase()) &&
        (!tagTest || tagTest(p)) &&
        (!q || `${p.nombre} ${p.descripcion} ${p.color}`.toLowerCase().includes(q))
    );
    const fn = SORTS[sortBy]?.fn;
    if (fn) list = [...list].sort(fn);
    return list;
  }, [products, brand, tag, query, sortBy]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  const selectBrand = (b) => {
    setBrand(b);
    setShowAll(false);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearSearch = () => navigate('/#catalogo');

  const featuredName = featured ? splitName(featured) : null;

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-8 md:pb-12 grid lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 items-center">
        <div>
          <span className="label-mono inline-block rounded-full border border-ink/40 px-4 py-1.5 text-[10px] md:text-[11px]">
            Su optica de confianza<span className="hidden md:inline"> · Córdoba</span>
          </span>
          <h1 className="font-display text-[64px] leading-[0.92] md:text-[96px] lg:text-[104px] mt-6 md:mt-8">
            Ver más
            <br />
            allá<span className="inline-block w-[0.16em] h-[0.16em] bg-magenta ml-[0.04em] align-baseline" />
          </h1>
          <p className="mt-6 text-[15px] md:text-base text-ink/70 max-w-md leading-relaxed">
            <span className="hidden md:inline">Colecciones de autor para quienes ven más allá.<br /></span>
            <span className="md:hidden">Colecciones de autor. </span>
            Diseño, precisión y exclusividad en cada detalle.
          </p>

          <div className="hidden md:flex flex-wrap gap-3 mt-8">
            <Link to="/#catalogo" className="inline-flex items-center gap-2 rounded-full bg-ink text-white h-12 px-6 text-sm font-semibold hover:bg-magenta transition-colors">
              Explorar catálogo <FiArrowRight />
            </Link>
            <a
              href={whatsappUrl('Hola! Quiero asesoramiento para elegir anteojos')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 h-12 px-6 text-sm font-medium hover:bg-white transition-colors"
            >
              <FaWhatsapp /> Asesoramiento por WhatsApp
            </a>
          </div>

          <dl className="hidden md:grid grid-cols-3 gap-6 mt-12 max-w-md border-t border-black/10 pt-6">
            <div>
              <dt className="font-display text-3xl">{products.length || '—'}</dt>
              <dd className="text-xs text-muted mt-1">modelos disponibles</dd>
            </div>
            <div>
              <dt className="font-display text-3xl">{brands.length || '—'}</dt>
              <dd className="text-xs text-muted mt-1">{brands.slice(0, 3).join(', ') || 'marcas'}</dd>
            </div>
            <div>
              <dt className="font-display text-3xl">UV400</dt>
              <dd className="text-xs text-muted mt-1">protección en toda la línea sol</dd>
            </div>
          </dl>
        </div>

        {/* Producto destacado */}
        <div className="relative rounded-[28px] bg-gradient-to-br from-[#efe9e9] to-stone aspect-[5/4] md:aspect-[4/3.4] overflow-hidden">
          <span className="font-display absolute top-[6%] left-[6%] text-[110px] md:text-[180px] leading-none text-black/[0.04] select-none">SOL</span>
          <span className="hidden md:block absolute top-6 right-6 rounded-full bg-magenta text-white text-xs font-semibold px-4 py-1.5">Hasta 40% OFF</span>
          {featured && firstImage(featured) && (
            <img
              src={firstImage(featured)}
              alt={featured.nombre}
              fetchPriority="high"
              className="absolute inset-x-[8%] top-[14%] w-[84%] h-[62%] object-contain mix-blend-multiply"
            />
          )}
          {featured && (
            <Link
              to={`/product/${featured.id}`}
              className="absolute left-4 right-4 bottom-4 md:left-6 md:right-6 md:bottom-6 rounded-2xl bg-white/90 backdrop-blur px-5 py-4 flex items-center justify-between gap-4 group"
            >
              <div className="min-w-0">
                <p className="label-mono text-[10px] text-muted">
                  <span className="hidden md:inline">Destacado · </span>
                  {featuredName.brand}
                  <span className="md:hidden"> · {featuredName.model}</span>
                </p>
                <p className="hidden md:block mt-1 font-medium truncate">
                  {featuredName.model}
                  {featured.descripcion && ` — ${specsLine(featured)}`}
                </p>
                <p className="md:hidden mt-1 text-lg font-medium">{formatPrice(featured.precio)}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="hidden md:block font-semibold">{formatPrice(featured.precio)}</span>
                <span className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-ink text-white group-hover:bg-magenta transition-colors">
                  <FiArrowUpRight />
                </span>
                <span className="md:hidden rounded-full bg-ink text-white px-5 h-10 grid place-items-center text-sm font-semibold">Ver</span>
              </div>
            </Link>
          )}
        </div>

        <Link to="/#catalogo" className="md:hidden flex items-center justify-center rounded-full bg-ink text-white h-14 text-base font-semibold">
          Explorar catálogo
        </Link>
      </section>

      {/* ── BENEFICIOS ── */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 mb-6 md:mb-10">
        <div className="hidden md:flex items-center justify-between rounded-2xl bg-white/60 border border-black/5 px-6 h-14 text-[13px] text-ink/70">
          {FEATURES.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon size={15} /> {label}
            </span>
          ))}
        </div>
        <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {FEATURES.map(({ short }) => (
            <span key={short} className="shrink-0 rounded-full bg-white/70 border border-black/5 px-4 h-10 grid place-items-center text-sm">
              {short}
            </span>
          ))}
        </div>
      </section>

      {/* ── LIQUIDACIÓN + MARCAS ── */}
      <PromocionBanner brands={brands} onBrand={selectBrand} />

      {/* ── CATÁLOGO ── */}
      <section id="catalogo" className="max-w-[1320px] mx-auto px-4 md:px-8 pt-14 md:pt-20 scroll-mt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="label-mono text-[10px] md:text-[11px] text-muted">
              {loading ? 'Cargando' : `${filtered.length} modelos`}
            </span>
            <h2 className="font-display text-[40px] leading-none md:text-[56px] mt-2">
              {query ? `“${query}”` : 'Lentes de sol'}
            </h2>
            {query && (
              <button onClick={clearSearch} className="mt-2 text-sm text-magenta underline underline-offset-4">
                Limpiar búsqueda
              </button>
            )}
          </div>

          <div className="relative">
            <label className="hidden md:flex items-center gap-3 text-[13px] text-muted">
              Ordenar por
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full bg-white/70 border border-black/10 h-10 px-4 text-ink outline-none cursor-pointer"
              >
                {Object.entries(SORTS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
            </label>
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="md:hidden flex items-center gap-2 rounded-full border border-black/10 bg-white/70 h-11 px-5 text-sm"
            >
              <FiSliders size={15} /> Filtrar
            </button>
            {sortOpen && (
              <div className="md:hidden absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-black/5 p-2 z-20">
                {Object.entries(SORTS).map(([key, s]) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setSortOpen(false); }}
                    className={`block w-full text-left px-3 py-2 rounded-xl text-sm ${sortBy === key ? 'bg-paper font-semibold' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          <Chip active={!brand} onClick={() => setBrand('')}>Todos</Chip>
          {brands.map((b) => (
            <Chip key={b} active={brand === b} onClick={() => setBrand(brand === b ? '' : b)}>{b}</Chip>
          ))}
          <span className="hidden md:block w-px bg-black/10 mx-2" />
          {TAGS.map((t) => (
            <Chip key={t.key} active={tag === t.key} onClick={() => setTag(tag === t.key ? '' : t.key)}>{t.label}</Chip>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-12">
          {loading
            ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            : visible.map((product, idx) => (
                // Primera fila carga eager, el resto lazy
                <ProductCard key={product.id} product={product} imgLoading={idx < 4 ? 'eager' : 'lazy'} />
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 rounded-[28px] bg-white/50 border border-black/5">
            <p className="font-display text-2xl">Sin resultados</p>
            <p className="text-sm text-muted mt-2">Probá con otra marca o filtro.</p>
          </div>
        )}

        {!loading && filtered.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full md:w-auto rounded-full border border-ink/30 h-12 md:h-12 px-8 text-sm hover:bg-ink hover:text-white transition-colors"
            >
              {showAll ? 'Ver menos' : `Ver los ${filtered.length} modelos`}
            </button>
          </div>
        )}
      </section>

      {/* ── VISITANOS ── */}
      <section id="visitanos" className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20 scroll-mt-28">
        <div className="rounded-[28px] bg-white/60 border border-black/5 p-6 md:p-4 grid lg:grid-cols-[1fr_1.1fr] gap-6">
          <div className="md:p-8 flex flex-col">
            <span className="label-mono text-[10px] md:text-[11px] text-muted">Visitanos</span>
            <h2 className="font-display text-[34px] leading-[1.02] md:text-[48px] mt-4">Salud visual con distinción.</h2>

            <div className="lg:hidden mt-6 rounded-2xl overflow-hidden h-56 bg-stone">
              <MapFrame />
            </div>

            <dl className="mt-6 md:mt-8 grid grid-cols-[100px_1fr] gap-y-3 text-sm">
              <dt className="text-muted">Dirección</dt>
              <dd>{STORE.address}<span className="hidden md:inline">, {STORE.city}</span></dd>
              <dt className="text-muted">Horario</dt>
              <dd>
                <span className="hidden md:inline">{STORE.hoursLong}</span>
                <span className="md:hidden">{STORE.hoursShort}</span>
              </dd>
              <dt className="text-muted">Teléfono</dt>
              <dd><a href={STORE.phoneHref} className="underline underline-offset-4 decoration-black/30">{STORE.phone}</a></dd>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none grid place-items-center rounded-full bg-ink text-white h-12 px-6 text-sm font-semibold hover:bg-magenta transition-colors"
              >
                Cómo llegar
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:grid place-items-center rounded-full border border-ink/20 h-12 px-6 text-sm font-medium hover:bg-white transition-colors"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </div>

          <div className="hidden lg:block rounded-[22px] overflow-hidden min-h-[380px] bg-stone">
            <MapFrame />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const MapFrame = () => (
  <iframe
    title="Ubicación de Optica Molina"
    src={`https://www.google.com/maps?q=${encodeURIComponent(`${STORE.address}, ${STORE.city}, Argentina`)}&z=16&output=embed`}
    className="w-full h-full border-0 grayscale-[0.85] contrast-[0.95]"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
);

export default Home;
