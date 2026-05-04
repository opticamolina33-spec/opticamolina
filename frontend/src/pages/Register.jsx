// Archivo: src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await api.post('/auth/register', { email, password });
      alert("¡Cuenta de Óptica Molina creada con éxito!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Error al intentar registrarse.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-[#FDFDFD] px-4 py-10">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] w-full max-w-lg border border-gray-50">
        
        <div className="text-center mb-8">
          <div className="inline-block bg-[#4a0e2e]/5 text-[#4a0e2e] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Unite a la comunidad
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Registrate</h2>
          <p className="text-gray-400 text-sm mt-2 font-light italic">Descubrí una nueva forma de ver el mundo.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Tu mejor Email</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4a0e2e] transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4a0e2e] transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Confirmar</label>
              <input 
                type="password" 
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4a0e2e] transition-all outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetila"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#4a0e2e] hover:bg-[#1a1a1a] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl uppercase tracking-[0.2em] text-xs mt-4 transform active:scale-95"
          >
            Crear mi cuenta
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-black text-[11px] font-bold uppercase tracking-widest transition-colors"
          >
            ¿Ya tenés cuenta? <span className="underline text-[#4a0e2e]">Iniciá sesión acá</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;