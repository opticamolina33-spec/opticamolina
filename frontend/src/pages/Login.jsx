// Archivo: src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, email: userEmail, roles } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('roles', JSON.stringify(roles));

      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      setError('Credenciales incorrectas. Verificá tu email o contraseña.');
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Iniciar Sesión</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Contraseña</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Ingresar
          </button>
        </form>

        {/* --- SECCIÓN DE REGISTRO --- */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-4">¿Aún no tenés una cuenta?</p>
          <button 
            onClick={() => navigate('/register')} // Asegurate de que esta ruta exista en App.jsx
            className="w-full bg-white border-2 border-primary text-primary hover:bg-gray-50 font-bold py-2 px-4 rounded transition-colors"
          >
            Registrarse en Óptica Molina
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;