// Archivo: src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRoles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    navigate('/login');
  };

  return (
    <nav className="bg-[#0a0a0a] text-white py-4 px-6 sticky top-0 z-50 shadow-xl border-b border-[#222]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo con branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/IMG_3486.jpg" 
            alt="Logo Óptica Molina" 
            className="h-10 w-auto rounded-sm brightness-110 group-hover:scale-105 transition-transform"
          />
          <span className="hidden md:block text-xl font-black tracking-[0.2em] uppercase italic">
            ÓPTICA MOLINA
          </span>
        </Link>

        <div className="flex items-center space-x-6 md:space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-[#801a4d] transition-colors tracking-widest uppercase">
            Catálogo
          </Link>
          
          {/* Opciones exclusivas para Admin */}
          {isAdmin && (
            <>
              <Link to="/admin" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase">
                Productos
              </Link>
              <Link to="/admin/ventas" className="text-sm font-bold text-[#801a4d] hover:text-[#a62164] transition-colors uppercase flex items-center gap-1">
                <span className="w-2 h-2 bg-[#801a4d] rounded-full animate-pulse"></span>
                Ventas
              </Link>
            </>
          )}

          {token ? (
            <button 
              onClick={handleLogout}
              className="border border-[#4a0e2e] text-[#ff4d4d] hover:bg-[#4a0e2e] hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-tighter"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-black hover:bg-[#4a0e2e] hover:text-white px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;