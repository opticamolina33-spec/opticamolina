import { useState, useEffect } from 'react';
import api from '../api/axios';

// Paletas de color disponibles para el banner
const PALETTES = [
  { key: 'zinc-pink',    label: 'Rosa oscuro',  preview: 'from-zinc-950 to-pink-950' },
  { key: 'slate-rose',   label: 'Rosa ardiente', preview: 'from-slate-950 to-rose-950' },
  { key: 'gray-indigo',  label: 'Índigo',       preview: 'from-gray-950 to-indigo-950' },
  { key: 'stone-amber',  label: 'Ámbar',        preview: 'from-stone-950 to-amber-950' },
  { key: 'black-purple', label: 'Violeta',      preview: 'from-black to-purple-950' },
];

const initialState = {
  titulo: '',
  descripcion: '',
  precio: '',
  imagen1Url: '',
  imagen2Url: '',
  colorFondo: 'zinc-pink',
  activa: true,
};

const NuevaPromocion = ({ isOpen, onClose, onSuccess, promoToEdit }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promoToEdit) {
      setForm({
        titulo:      promoToEdit.titulo || '',
        descripcion: promoToEdit.descripcion || '',
        precio:      promoToEdit.precio || '',
        imagen1Url:  promoToEdit.imagen1Url || '',
        imagen2Url:  promoToEdit.imagen2Url || '',
        colorFondo:  promoToEdit.colorFondo || 'zinc-pink',
        activa:      promoToEdit.activa ?? true,
      });
    } else {
      setForm(initialState);
    }
  }, [promoToEdit, isOpen]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.precio || !form.imagen1Url) {
      return alert('Título, precio e imagen principal son obligatorios.');
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
      };

      if (promoToEdit) {
        await api.put(`/admin/promociones/${promoToEdit.id}`, payload, getAuthHeader());
      } else {
        await api.post('/admin/promociones', payload, getAuthHeader());
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la promoción.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialState);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-[#111] border border-[#222] text-white p-3 rounded-xl focus:border-[#4a0e2e] focus:ring-1 focus:ring-[#4a0e2e] outline-none transition-all placeholder:text-gray-600 font-medium";
  const labelClass = "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1";

  // Preview del banner con las imágenes del form
  const previewPalette = PALETTES.find(p => p.key === form.colorFondo) || PALETTES[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] shadow-2xl w-full max-w-4xl p-8 md:p-12 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              {promoToEdit ? 'Editar Promoción' : 'Nueva Promoción'}
            </h2>
            <p className="text-[#4a0e2e] text-[10px] font-bold uppercase tracking-[0.3em]">
              Banner Destacado
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white text-4xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* TÍTULO + PRECIO */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Título de la Promoción *</label>
              <input
                className={inputClass}
                placeholder="Ej: Verano 2025 · 30% OFF"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Precio ARS *</label>
              <input
                type="number"
                className={inputClass}
                placeholder="15000"
                value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })}
              />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              className={`${inputClass} h-24`}
              placeholder="Descripción breve de la promo..."
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {/* IMÁGENES */}
          <div className="grid md:grid-cols-2 gap-6 bg-[#111]/50 p-6 rounded-3xl border border-[#1a1a1a]">
            <div>
              <label className={labelClass}>Imagen Principal * (frente)</label>
              <input
                type="text"
                className={inputClass}
                placeholder="https://imagen1.com/foto.jpg"
                value={form.imagen1Url}
                onChange={e => setForm({ ...form, imagen1Url: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Imagen Secundaria (fondo)</label>
              <input
                type="text"
                className={inputClass}
                placeholder="https://imagen2.com/foto.jpg"
                value={form.imagen2Url}
                onChange={e => setForm({ ...form, imagen2Url: e.target.value })}
              />
            </div>
          </div>

          {/* COLOR DE FONDO */}
          <div>
            <label className={labelClass}>Color de fondo del banner</label>
            <div className="flex flex-wrap gap-3">
              {PALETTES.map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setForm({ ...form, colorFondo: p.key })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                    form.colorFondo === p.key
                      ? 'border-white text-white bg-white/10'
                      : 'border-[#333] text-gray-500 hover:border-[#555]'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${p.preview}`} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, activa: !form.activa })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.activa ? 'bg-[#4a0e2e]' : 'bg-[#333]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.activa ? 'left-7' : 'left-1'}`} />
            </button>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {form.activa ? 'Activa — visible en el sitio' : 'Inactiva — oculta'}
            </span>
          </div>

          {/* PREVIEW MINI */}
          {(form.imagen1Url || form.titulo) && (
            <div className="rounded-2xl overflow-hidden border border-[#1a1a1a]">
              <div className={`relative bg-gradient-to-br ${previewPalette.preview} p-6 flex items-center gap-4`}>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-pink-300 uppercase tracking-[0.3em] mb-1">Promoción especial</p>
                  <p className="text-xl font-black text-white uppercase italic tracking-tight leading-none">
                    {form.titulo || 'Título de la promo'}
                  </p>
                  {form.precio && (
                    <p className="text-2xl font-black text-white mt-2 italic">
                      ${parseFloat(form.precio || 0).toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 relative items-end">
                  {form.imagen2Url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center p-1" style={{ transform: 'rotate(5deg)' }}>
                      <img src={form.imagen2Url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {form.imagen1Url && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center p-1 z-10" style={{ transform: 'rotate(-3deg)' }}>
                      <img src={form.imagen1Url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center text-[9px] text-gray-600 uppercase tracking-widest py-2 bg-[#0a0a0a]">
                Vista previa del banner
              </p>
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-400 font-bold hover:text-white uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#4a0e2e] text-white font-black rounded-xl hover:bg-[#6b1442] transition-colors uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (promoToEdit ? 'Actualizar' : 'Publicar Promo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaPromocion;