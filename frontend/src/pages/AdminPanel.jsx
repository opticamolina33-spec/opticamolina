// Archivo: src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NuevoProducto from '../components/NuevoProducto';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Estado para las categorías disponibles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (!roles.includes('ROLE_ADMIN')) {
      navigate('/');
    } else {
      fetchData();
      fetchCategories();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const res = await api.get('/public/products');
      setProducts(res.data);
    } catch (error) { console.error("Error trayendo productos:", error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/public/categories');
      setCategories(res.data);
    } catch (error) { console.error("Error trayendo categorías:", error); }
  };

  const handleSyncML = async () => {
    setIsSyncing(true);
    try {
      const res = await api.post('/admin/mercadolibre/sync'), {};
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert("Error al sincronizar: " + (err.response?.data?.error || err.message));
    } finally {
      setIsSyncing(false);
    }
  };

  // --- NUEVA FUNCIÓN: CAMBIAR CATEGORÍA RÁPIDO ---
  const handleCategoryChange = async (product, newCategoryId) => {
    try {
      const updatedProduct = {
        ...product,
        category: { id: parseInt(newCategoryId) }
      };
      await api.put(`/admin/products/${product.id}`, updatedProduct);
      fetchData(); // Recargamos para ver el cambio reflejado
    } catch (err) {
      alert("Error al mover el producto de categoría");
      console.error(err);
    }
  };

  const handleUpdateStock = async (id, quantity) => {
    try {
      await api.patch(`/admin/products/${id}/stock`, { quantity });
      fetchData();
    } catch (err) { alert("Error actualizando stock"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta pieza de la colección?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 pb-20 page-transition">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Header del Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-[#1a1a1a] pb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Gestión de Inventario
            </h1>
            <p className="text-[#801a4d] text-[10px] font-black tracking-[0.4em] uppercase mt-2">
              Óptica Molina — Control Center
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleSyncML}
              disabled={isSyncing}
              className="group relative overflow-hidden bg-[#ffe600] text-[#2d3277] font-black py-4 px-8 rounded-2xl shadow-lg hover:bg-[#ffeb3b] transition-all duration-500 uppercase tracking-[0.2em] text-xs transform active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10">{isSyncing ? 'Sincronizando...' : '↻ Traer de ML'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden bg-white text-black font-black py-4 px-10 rounded-2xl shadow-2xl hover:bg-[#4a0e2e] hover:text-white transition-all duration-500 uppercase tracking-[0.2em] text-xs transform active:scale-95"
            >
              <span className="relative z-10">+ Cargar Nuevo Modelo</span>
            </button>
          </div>
        </div>

        {/* Tabla Minimalista Dark */}
        <div className="bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-[#1a1a1a] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#111] text-gray-500 border-b border-[#1a1a1a]">
                  <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.3em]">Pieza / Referencia</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.3em]">Categoría</th>
                  <th className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-[0.3em]">Valor ARS</th>
                  <th className="py-6 px-8 text-center text-[10px] font-black uppercase tracking-[0.3em]">Stock</th>
                  <th className="py-6 px-8 text-center text-[10px] font-black uppercase tracking-[0.3em]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151515]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        {p.imagenUrl && (
                          <img src={p.imagenUrl} alt={p.nombre} className="w-14 h-14 object-cover rounded-xl border border-[#1a1a1a]" />
                        )}
                        <div>
                          <div className="font-black text-white italic text-lg tracking-tight uppercase group-hover:text-[#801a4d] transition-colors flex items-center gap-2">
                            {p.nombre}
                            {p.idMercadoLibre && (
                              <span className="bg-[#ffe600] text-[#2d3277] text-[8px] px-2 py-0.5 rounded-full not-italic tracking-widest font-black">ML</span>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest block mt-1">
                            Ref: {p.marca || 'Molina Eyewear'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SELECTOR DE CATEGORÍA DINÁMICO */}
                    <td className="py-6 px-8">
                      <select
                        value={p.category?.id || ""}
                        onChange={(e) => handleCategoryChange(p, e.target.value)}
                        className={`bg-[#111] border border-[#222] text-[10px] font-bold uppercase tracking-tighter rounded-lg px-3 py-2 outline-none focus:border-[#801a4d] transition-all cursor-pointer ${p.category?.name === 'Importado de ML' ? 'text-yellow-500 border-yellow-900/50' : 'text-gray-400'}`}
                      >
                        <option value="" disabled>Seleccionar...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <span className="text-xl font-black text-white tracking-tighter italic">
                        ${p.precio?.toLocaleString('es-AR')}
                      </span>
                    </td>

                    <td className="py-6 px-8">
                      <div className="flex justify-center items-center gap-3">
                        <button 
                          onClick={() => handleUpdateStock(p.id, -1)} 
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#111] border border-[#222] hover:border-red-900/50 hover:text-red-500 transition-all font-bold"
                        >
                          -
                        </button>
                        <span className={`text-sm font-black w-6 text-center ${p.stock <= 2 ? 'text-[#801a4d]' : 'text-gray-300'}`}>
                          {p.stock}
                        </span>
                        <button 
                          onClick={() => handleUpdateStock(p.id, 1)} 
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#111] border border-[#222] hover:border-emerald-900/50 hover:text-emerald-500 transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-6 px-8 text-center">
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {products.length === 0 && (
            <div className="py-20 text-center text-gray-600 italic tracking-widest uppercase text-[10px]">
              La colección está vacía actualmente.
            </div>
          )}
        </div>
      </div>

      <NuevoProducto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
};

export default AdminPanel;