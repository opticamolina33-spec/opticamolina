import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminCategorias = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para nueva categoría
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  // Estado para edición inline
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [savingId, setSavingId] = useState(null);

  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (!roles.includes('ROLE_ADMIN')) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [navigate]);

  // Focus automático al entrar en modo edición
  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        api.get('/public/categories'),
        api.get('/public/products'),
      ]);
      setCategories(catsRes.data);
      setProducts(prodsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cuenta cuántos productos tiene cada categoría
  const countFor = (catId) => products.filter(p => p.category?.id === catId).length;

  // ── Crear ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setCreating(true);
    setError('');
    try {
      await api.post('/admin/categories', { name }, getAuthHeader());
      setNewName('');
      await fetchData();
    } catch (err) {
      setError('No se pudo crear la categoría.');
    } finally {
      setCreating(false);
    }
  };

  // ── Editar inline ──────────────────────────────────────────────────────────
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id) => {
    const name = editingName.trim();
    if (!name) return;

    setSavingId(id);
    setError('');
    try {
      await api.put(`/admin/categories/${id}`, { name }, getAuthHeader());
      setEditingId(null);
      await fetchData();
    } catch (err) {
      setError('No se pudo guardar el cambio.');
    } finally {
      setSavingId(null);
    }
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') handleSaveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (cat) => {
    const count = countFor(cat.id);
    const msg = count > 0
      ? `"${cat.name}" tiene ${count} producto(s). Debés reasignarlos o eliminarlos antes.`
      : `¿Eliminar la categoría "${cat.name}"? Esta acción no se puede deshacer.`;

    if (!window.confirm(msg)) return;
    if (count > 0) return; // El backend también lo rechaza, pero avisamos antes

    setError('');
    try {
      await api.delete(`/admin/categories/${cat.id}`, getAuthHeader());
      await fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo eliminar la categoría.';
      setError(msg);
    }
  };

  // ─── Estilos compartidos ───────────────────────────────────────────────────
  const inputClass = "bg-[#111] border border-[#222] text-white p-3 rounded-xl focus:border-[#4a0e2e] focus:ring-1 focus:ring-[#4a0e2e] outline-none transition-all placeholder:text-gray-600 font-medium";

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 pb-20 page-transition">
      <div className="max-w-3xl mx-auto px-6 pt-12">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-[#1a1a1a] pb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Categorías
            </h1>
            <p className="text-[#801a4d] text-[10px] font-black tracking-[0.4em] uppercase mt-2">
              Óptica Molina — Gestión de Colecciones
            </p>
          </div>
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-[#111] px-4 py-2 rounded-xl border border-[#1a1a1a]">
            {categories.length} categorías · {products.length} productos
          </div>
        </div>

        {/* ── ERROR GLOBAL ── */}
        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-900/50 text-red-400 text-xs font-bold px-5 py-4 rounded-2xl tracking-wide">
            {error}
          </div>
        )}

        {/* ── NUEVA CATEGORÍA ── */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-6 mb-8">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">
            Nueva categoría
          </p>
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Ej: Solar Premium, Deportivos, Infantiles..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-[#4a0e2e] hover:text-white transition-all uppercase text-xs tracking-widest disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap"
            >
              {creating ? 'Creando...' : '+ Agregar'}
            </button>
          </form>
        </div>

        {/* ── LISTA ── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-600 italic tracking-widest uppercase text-[10px]">
            No hay categorías todavía. ¡Creá la primera!
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => {
              const count = countFor(cat.id);
              const isEditing = editingId === cat.id;
              const isSaving = savingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`group bg-[#0a0a0a] border rounded-2xl px-6 py-4 flex items-center gap-4 transition-all ${
                    isEditing ? 'border-[#4a0e2e]/60' : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                  }`}
                >
                  {/* Ícono */}
                  <div className="w-8 h-8 rounded-xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9V5a2 2 0 012-2z" />
                    </svg>
                  </div>

                  {/* Nombre / Input edición */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        className={`${inputClass} w-full text-sm py-2`}
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, cat.id)}
                      />
                    ) : (
                      <>
                        <p className="font-black text-white uppercase italic tracking-tight text-lg leading-none">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                          {count === 0 ? 'Sin productos' : `${count} producto${count !== 1 ? 's' : ''}`}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          disabled={isSaving || !editingName.trim()}
                          className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40"
                        >
                          {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(cat)}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100 ${
                            count > 0
                              ? 'text-gray-700 cursor-not-allowed'
                              : 'text-gray-700 hover:text-red-500'
                          }`}
                          title={count > 0 ? `Tiene ${count} producto(s) — no se puede eliminar` : 'Eliminar'}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>

                  {/* Badge cantidad - visible siempre */}
                  {!isEditing && count > 0 && (
                    <span className="text-[9px] font-black bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 px-2.5 py-1 rounded-full uppercase tracking-widest flex-shrink-0">
                      {count}
                    </span>
                  )}

                  {/* Candado si tiene productos */}
                  {!isEditing && count > 0 && (
                    <svg className="w-3 h-3 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Nota explicativa */}
        <p className="mt-8 text-[10px] text-gray-700 text-center uppercase tracking-widest">
          Las categorías con productos no se pueden eliminar — reasigná o eliminá los productos primero.
        </p>

      </div>
    </div>
  );
};

export default AdminCategorias;