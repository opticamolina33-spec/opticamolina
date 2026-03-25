// Archivo: src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Chequeamos de forma sencilla si el usuario está logueado
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
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">
          ÓPTICA MOLINA
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-secondary transition-colors">Catálogo</Link>
          
          {isAdmin && (
            <Link to="/admin" className="hover:text-secondary font-semibold text-yellow-300">
              Panel Admin
            </Link>
          )}

          {token ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
            >
              Salir
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-secondary hover:bg-blue-400 text-primary font-semibold px-4 py-2 rounded transition-colors"
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