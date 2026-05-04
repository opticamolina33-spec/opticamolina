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
      const response = await api.post('/auth/login', { email, password });
      const { token, email: userEmail, roles } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('roles', JSON.stringify(roles));
      roles.includes('ROLE_ADMIN') ? navigate('/admin') : navigate('/');
    } catch (err) {
      setError('Credenciales incorrectas. Verificá tu email o contraseña.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-[#FDFDFD] px-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-full max-w-md border border-gray-50 relative overflow-hidden">
        
        {/* Decoración sutil */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1a1a1a] via-[#4a0e2e] to-[#1a1a1a]"></div>

        <div className="text-center mb-10">
          <img src="/IMG_3486.jpg" alt="Logo" className="h-12 mx-auto mb-4 rounded-lg shadow-sm" />
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Bienvenido</h2>
          <p className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mt-2">Acceso Exclusivo Clientes</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-tight italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4a0e2e] transition-all outline-none text-slate-800 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4a0e2e] transition-all outline-none text-slate-800 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex justify-end mt-2">
            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[10px] font-black uppercase tracking-widest text-[#4a0e2e] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#1a1a1a] hover:bg-[#4a0e2e] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-lg uppercase tracking-[0.2em] text-xs transform active:scale-95"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4">¿No tenés cuenta todavía?</p>
          <button 
            onClick={() => navigate('/register')}
            className="w-full bg-white border-2 border-slate-100 text-slate-900 hover:border-[#4a0e2e] hover:text-[#4a0e2e] font-black py-4 rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-xs"
          >
            Crear Nueva Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;