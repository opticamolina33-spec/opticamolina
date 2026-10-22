// Archivo: src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { STORE } from '../lib/catalog';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/ventas', label: 'Ventas' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/promociones', label: 'Promos' },
];

const AnnouncementBar = () => (
  <div className="bg-ink text-white">
    <div className="label-mono text-[10px] md:text-[11px] py-2 px-4 text-center whitespace-nowrap overflow-hidden">
      <span className="hidden md:inline">
        Liquidación sol · Hasta 40% OFF <span className="mx-4 opacity-50">/</span> Envíos a todo el país{' '}
        <span className="mx-4 opacity-50">/</span> Retiro en {STORE.address}
      </span>
      <span className="md:hidden">Sol hasta 40% OFF · Envíos a todo el país</span>
    </div>
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { count, setOpen } = useCart();
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const userRef = useRef(null);

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const userRoles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  useEffect(() => {
    api.get('/public/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    const close = (e) => userRef.current && !userRef.current.contains(e.target) && setUserOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const findCategory = (...words) => categories.find((c) => words.some((w) => c.name?.toLowerCase().includes(w)));
  const solCat = findCategory('sol');
  const armazonesCat = findCategory('armaz', 'receta');

  const links = [
    { label: 'Lentes de sol', to: solCat ? `/categoria/${solCat.id}` : '/#catalogo' },
    { label: 'Armazones', to: armazonesCat ? `/categoria/${armazonesCat.id}` : '/#catalogo' },
    { label: 'Marcas', to: '/#marcas' },
    { label: 'Liquidación', to: '/#liquidacion', accent: true },
    { label: 'La óptica', to: '/#visitanos' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}#catalogo` : '/#catalogo');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <nav className="bg-paper/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center gap-6">
          {/* Mobile: hamburguesa */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden -ml-1 p-2"
            aria-label="Abrir menú"
          >
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 mx-auto lg:mx-0">
            <img src="/IMG_3486.jpg" alt="" className="hidden lg:block h-9 w-9 rounded-md object-cover" />
            <span className="font-display text-[17px] md:text-lg tracking-[0.08em] text-magenta lg:text-ink lg:font-semibold">
              ÓPTICA MOLINA
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden lg:flex items-center gap-7 text-[14px] ml-4">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className={`transition-colors hover:text-magenta ${l.accent ? 'text-magenta font-medium' : 'text-ink/80'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 lg:ml-auto">
            {/* Buscador desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 bg-white/70 border border-black/5 rounded-full px-4 h-10 w-60">
              <FiSearch className="text-muted shrink-0" size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar modelo o marca"
                className="bg-transparent outline-none text-[13px] w-full placeholder:text-muted"
              />
            </form>
            <button onClick={() => setSearchOpen((v) => !v)} className="lg:hidden p-2" aria-label="Buscar">
              <FiSearch size={20} />
            </button>

            {/* Usuario */}
            <div className="relative hidden lg:block" ref={userRef}>
              <button
                onClick={() => (token ? setUserOpen((v) => !v) : navigate('/login'))}
                className="h-10 w-10 grid place-items-center rounded-full hover:bg-black/5 transition-colors"
                aria-label="Mi cuenta"
              >
                <FiUser size={18} />
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/5 p-2 text-sm">
                  {email && <p className="px-3 py-2 text-xs text-muted truncate">{email}</p>}
                  {isAdmin &&
                    ADMIN_LINKS.map((l) => (
                      <Link key={l.to} to={l.to} className="block px-3 py-2 rounded-xl hover:bg-paper">
                        {l.label}
                      </Link>
                    ))}
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl hover:bg-paper text-magenta">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Carrito */}
            <button
              onClick={() => setOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-ink text-white rounded-full h-10 px-5 text-[13px] font-semibold hover:bg-magenta transition-colors"
            >
              <FiShoppingBag size={15} /> Carrito · {count}
            </button>
            <button onClick={() => setOpen(true)} className="lg:hidden relative p-2" aria-label="Carrito">
              <FiShoppingBag size={21} />
              {count > 0 && (
                <span className="absolute top-0 right-0 h-[18px] min-w-[18px] px-1 rounded-full bg-magenta text-white text-[10px] font-bold grid place-items-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Buscador mobile */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden px-4 pb-3">
            <div className="flex items-center gap-2 bg-white border border-black/5 rounded-full px-4 h-11">
              <FiSearch className="text-muted" size={16} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar modelo o marca"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </form>
        )}
      </nav>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[82%] max-w-sm bg-paper p-6 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <span className="font-display text-lg tracking-[0.08em] text-magenta">ÓPTICA MOLINA</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="p-1">
                <FiX size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className={`font-display text-2xl py-2 ${l.accent ? 'text-magenta' : ''}`}>
                  {l.label}
                </Link>
              ))}
            </div>
            {isAdmin && (
              <div className="mt-8">
                <p className="label-mono text-muted mb-2">Administración</p>
                {ADMIN_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} className="block py-1.5 text-sm">
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-auto pt-6 border-t border-black/10">
              {token ? (
                <button onClick={handleLogout} className="text-sm text-magenta">Cerrar sesión</button>
              ) : (
                <Link to="/login" className="text-sm font-semibold">Ingresar</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
