// Archivo: src/components/NuevoProducto.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

const NuevoProducto = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    nombre: '', marca: '', descripcion: '', precio: '', stock: '',
    color: '', tamanio: '', material: '', forma: '', imagenUrl: [],
    tieneDescuento: false, porcentajeDescuento: 0, categoryId: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/public/categories");
        setCategories(res.data);
      } catch (err) { console.error("Error:", err); }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.categoryId || !newProduct.imagenUrl) {
      return alert("Faltan datos críticos (Categoría o Imagen).");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Sesión expirada.");

    setLoading(true);
    const { categoryId, ...datosParaEnviar } = newProduct;

    try {
      await api.post(`/admin/products/${categoryId}`, {
        ...datosParaEnviar,
        precio: parseFloat(newProduct.precio),
        stock: parseInt(newProduct.stock),
        porcentajeDescuento: parseInt(newProduct.porcentajeDescuento || 0)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error:", error.response);
      alert("Error al guardar. Verificá permisos de ADMIN.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      nombre: '', marca: '', descripcion: '', precio: '', stock: '',
      color: '', tamanio: '', material: '', forma: '', imagenUrl: '',
      tieneDescuento: false, porcentajeDescuento: 0, categoryId: ''
    });
  };

  if (!isOpen) return null;

  // Clase para los inputs oscuros reutilizable
  const inputClass = "w-full bg-[#111] border border-[#222] text-white p-3 rounded-xl focus:border-[#4a0e2e] focus:ring-1 focus:ring-[#4a0e2e] outline-none transition-all placeholder:text-gray-600 font-medium";
  const labelClass = "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] shadow-2xl w-full max-w-4xl p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nueva Pieza</h2>
            <p className="text-[#4a0e2e] text-[10px] font-bold uppercase tracking-[0.3em]">Registro de Colección</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-4xl font-light">&times;</button>
        </div>

        <form onSubmit={handleSaveProduct} className="space-y-8">
          
          {/* SECCIÓN 1: IDENTIDAD VISUAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111]/50 p-6 rounded-3xl border border-[#1a1a1a]">
            <div>
              <label className={labelClass}>Enlace de Imagen</label>
              <input 
                  type="text"
                  placeholder="https://img1.com, https://img2.com"
                  className={inputClass}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    imagenes: e.target.value.split(',') // separa por coma
                  })}
                />
            </div>
            <div>
              <label className={labelClass}>Categoría Curada</label>
              <select 
                className={inputClass} 
                value={newProduct.categoryId} 
                onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                required
              >
                <option value="" className="bg-[#0a0a0a]">-- Seleccionar --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS COMERCIALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className={labelClass}>Nombre del Modelo</label>
              <input type="text" placeholder="Ej: Molina Aviator" className={inputClass} value={newProduct.nombre} onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})} required />
            </div>
            <div>
              <label className={labelClass}>Precio (ARS)</label>
              <input type="number" placeholder="0.00" className={`${inputClass} font-black text-[#801a4d] italic`} value={newProduct.precio} onChange={(e) => setNewProduct({...newProduct, precio: e.target.value})} required />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" placeholder="Cant." className={inputClass} value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
            </div>
          </div>

          {/* SECCIÓN 3: ESPECIFICACIONES TÉCNICAS */}
          <div className="bg-[#050505] p-8 rounded-3xl border border-[#1a1a1a] space-y-6 shadow-inner">
            <h3 className="text-[11px] font-black uppercase text-[#4a0e2e] tracking-[0.4em] text-center mb-4">Detalles de Fabricación</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Color</label>
                <input type="text" placeholder="Mate Black" className={inputClass} value={newProduct.color} onChange={(e) => setNewProduct({...newProduct, color: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Calibre</label>
                <input type="text" placeholder="Medium" className={inputClass} value={newProduct.tamanio} onChange={(e) => setNewProduct({...newProduct, tamanio: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Material</label>
                <input type="text" placeholder="Acetato" className={inputClass} value={newProduct.material} onChange={(e) => setNewProduct({...newProduct, material: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Silueta</label>
                <input type="text" placeholder="Square" className={inputClass} value={newProduct.forma} onChange={(e) => setNewProduct({...newProduct, forma: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Reseña del Producto</label>
              <textarea placeholder="Describe la exclusividad de esta pieza..." className={`${inputClass} h-24 resize-none`} value={newProduct.descripcion} onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})} />
            </div>
          </div>

          {/* PROMOCIÓN */}
          <div className="flex items-center gap-8 bg-[#4a0e2e]/5 p-6 rounded-3xl border border-[#4a0e2e]/10">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="promo"
                className="w-5 h-5 accent-[#4a0e2e] bg-[#111] border-[#222]"
                checked={newProduct.tieneDescuento} 
                onChange={(e) => setNewProduct({...newProduct, tieneDescuento: e.target.checked})} 
              />
              <label htmlFor="promo" className="text-xs font-black text-gray-300 uppercase tracking-widest cursor-pointer">Activar Beneficio</label>
            </div>
            {newProduct.tieneDescuento && (
              <div className="flex items-center gap-4 animate-fade-in">
                <input 
                  type="number" 
                  placeholder="%" 
                  className="w-20 bg-[#111] border border-[#4a0e2e]/50 text-[#801a4d] p-2 rounded-lg text-center font-black" 
                  value={newProduct.porcentajeDescuento} 
                  onChange={(e) => setNewProduct({...newProduct, porcentajeDescuento: e.target.value})} 
                />
                <span className="text-[10px] text-[#4a0e2e] font-black uppercase tracking-widest italic">% OFF</span>
              </div>
            )}
          </div>

          {/* ACCIONES */}
          <div className="flex justify-end gap-6 pt-6 border-t border-[#1a1a1a]">
            <button type="button" onClick={onClose} className="text-[11px] font-black text-gray-600 hover:text-white uppercase tracking-[0.3em] transition-all">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-16 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all ${loading ? 'opacity-30' : 'hover:bg-[#4a0e2e] hover:text-white hover:-translate-y-1 transform active:scale-95'}`}
            >
              {loading ? 'Procesando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProducto;