// Archivo: src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Si el correo existe, recibirás un link para restablecer tu contraseña.');
    } catch (err) {
      setError('Ocurrió un error. Intentá de nuevo más tarde.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-[#FDFDFD] px-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-full max-w-md border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#4a0e2e]"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Recuperar Acceso</h2>
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-2">Seguridad Visual Optica Molina</p>
        </div>

        {message && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-tight italic border-l-4 border-green-500">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-tight italic border-l-4 border-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Tu Email de Registro</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4a0e2e] outline-none text-slate-800 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-[#4a0e2e] text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-[0.2em] text-xs">
            Enviar Instrucciones
          </button>
        </form>

        <button onClick={() => navigate('/login')} className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;