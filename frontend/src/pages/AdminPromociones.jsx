import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NuevaPromocion from '../components/NuevaPromocion';

const AdminPromociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (!roles.includes('ROLE_ADMIN')) {
      navigate('/');
    } else {
      fetchPromociones();
    }
  }, [navigate]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchPromociones = async () => {
    try {
      const res = await api.get('/admin/promociones', getAuthHeader());
      setPromociones(res.data);
    } catch (err) {
      console.error('Error trayendo promociones:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    try {
      await api.delete(`/admin/promociones/${id}`, getAuthHeader());
      fetchPromociones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActiva = async (promo) => {
    try {
      await api.put(`/admin/promociones/${promo.id}`, { ...promo, activa: !promo.activa }, getAuthHeader());
      fetchPromociones();
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 pb-20 page-transition">
      <div className="max-w-7xl mx-auto px-6 pt-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-[#1a1a1a] pb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Gestión de Promociones
            </h1>
            <p className="text-[#801a4d] text-[10px] font-black tracking-[0.4em] uppercase mt-2">
              Óptica Molina — Banners Destacados
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPromo(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-black font-black py-4 px-10 rounded-2xl shadow-2xl hover:bg-[#4a0e2e] hover:text-white transition-all duration-500 uppercase tracking-[0.2em] text-xs transform active:scale-95"
          >
            + Nueva Promoción
          </button>
        </div>

        {/* TABLA / CARDS */}
        {promociones.length === 0 ? (
          <div className="py-32 text-center text-gray-600 italic tracking-widest uppercase text-[10px]">
            No hay promociones cargadas todavía.
          </div>
        ) : (
          <div className="grid gap-6">
            {promociones.map((promo) => (
              <div
                key={promo.id}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch hover:border-[#2a2a2a] transition-colors"
              >
                {/* Preview */}
                <div className="w-full md:w-64 flex-shrink-0 relative bg-gradient-to-br from-zinc-900 to-pink-950 flex items-center justify-center p-6 gap-3 min-h-[120px]">
                  {promo.imagen2Url && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-white flex items-center justify-center p-1" style={{ transform: 'rotate(4deg)' }}>
                      <img src={promo.imagen2Url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {promo.imagen1Url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xl flex-shrink-0 bg-white flex items-center justify-center p-1 z-10" style={{ transform: 'rotate(-3deg)' }}>
                      <img src={promo.imagen1Url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {!promo.imagen1Url && !promo.imagen2Url && (
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">Sin imágenes</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">
                        {promo.titulo}
                      </h3>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                        promo.activa
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                          : 'bg-[#1a1a1a] text-gray-600 border border-[#222]'
                      }`}>
                        {promo.activa ? 'Activa' : 'Oculta'}
                      </span>
                    </div>
                    {promo.descripcion && (
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{promo.descripcion}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-2xl font-black text-white italic tracking-tighter">
                      ${promo.precio?.toLocaleString('es-AR')}
                      <span className="text-xs text-gray-500 font-normal not-italic ml-1">ARS</span>
                    </span>

                    <div className="flex items-center gap-4">
                      {/* Toggle activa */}
                      <button
                        onClick={() => handleToggleActiva(promo)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-yellow-400 transition-colors"
                      >
                        {promo.activa ? 'Desactivar' : 'Activar'}
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => {
                          setEditingPromo(promo);
                          setIsModalOpen(true);
                        }}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-400 transition-colors"
                      >
                        Editar
                      </button>

                      {/* Ver en sitio */}
                      <button
                        onClick={() => navigate(`/promocion/${promo.id}`)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#801a4d] transition-colors"
                      >
                        Ver
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NuevaPromocion
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        onSuccess={fetchPromociones}
        promoToEdit={editingPromo}
      />
    </div>
  );
};

export default AdminPromociones;