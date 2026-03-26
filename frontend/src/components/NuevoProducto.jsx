// Archivo: src/components/NuevoProducto.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

const NuevoProducto = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    nombre: '',
    marca: '',
    descripcion: '',
    precio: '',
    stock: '',
    color: '',
    tamanio: '',
    material: '',
    forma: '',
    imagenUrl: '',
    tieneDescuento: false,
    porcentajeDescuento: 0,
    categoryId: ''
  });

  // 1. CARGAMOS CATEGORÍAS (Ruta Pública, sin token)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Le pegamos a la ruta pública que armamos en el backend
        const res = await api.get("/public/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  // 2. GUARDAMOS EL PRODUCTO (Ruta Privada, CON token)
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.categoryId) return alert("Por favor, selecciona una categoría.");
    if (!newProduct.imagenUrl) return alert("Por favor, pega la URL de la imagen.");

    setLoading(true);

    try {
      // Recuperamos el token del Admin
      const token = localStorage.getItem("token");

      // Enviamos el JSON y adjuntamos el Token en los Headers
      await api.post(`/admin/products/${newProduct.categoryId}`, {
        ...newProduct,
        precio: parseFloat(newProduct.precio),
        stock: parseInt(newProduct.stock),
        porcentajeDescuento: parseInt(newProduct.porcentajeDescuento || 0)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("¡Producto guardado exitosamente!");
      onSuccess(); 
      resetForm();
      onClose();   
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo guardar: " + (error.response?.data || "Error de red"));
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-slate-800">📦 Cargar Nuevo Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>

        <form onSubmit={handleSaveProduct} className="space-y-6">
          
          {/* SECCIÓN 1: IMAGEN Y CATEGORÍA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">URL de la Imagen</label>
              <input 
                type="text" 
                placeholder="https://ejemplo.com/anteojo.jpg" 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                value={newProduct.imagenUrl} 
                onChange={(e) => setNewProduct({...newProduct, imagenUrl: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
              <select 
                className="w-full p-2.5 border rounded-lg bg-white font-medium focus:ring-2 focus:ring-blue-400 outline-none" 
                value={newProduct.categoryId} 
                onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                required
              >
                <option value="">-- Seleccionar --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Modelo / Nombre</label>
              <input type="text" placeholder="Ej: Aviator Classic" className="w-full p-2.5 border rounded-lg" value={newProduct.nombre} onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Marca</label>
              <input type="text" placeholder="Ej: Ray-Ban" className="w-full p-2.5 border rounded-lg" value={newProduct.marca} onChange={(e) => setNewProduct({...newProduct, marca: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Precio ($)</label>
              <input type="number" placeholder="0.00" className="w-full p-2.5 border rounded-lg font-bold text-green-700" value={newProduct.precio} onChange={(e) => setNewProduct({...newProduct, precio: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Stock Inicial</label>
              <input type="number" placeholder="Ej: 10" className="w-full p-2.5 border rounded-lg" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
            </div>
          </div>

          {/* SECCIÓN 3: ESPECIFICACIONES (DETALLES TÉCNICOS) */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Color</label>
                <input type="text" placeholder="Negro" className="w-full p-2 border rounded" value={newProduct.color} onChange={(e) => setNewProduct({...newProduct, color: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Tamaño</label>
                <input type="text" placeholder="52-18" className="w-full p-2 border rounded" value={newProduct.tamanio} onChange={(e) => setNewProduct({...newProduct, tamanio: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Material</label>
                <input type="text" placeholder="Metal" className="w-full p-2 border rounded" value={newProduct.material} onChange={(e) => setNewProduct({...newProduct, material: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Forma</label>
                <input type="text" placeholder="Gota" className="w-full p-2 border rounded" value={newProduct.forma} onChange={(e) => setNewProduct({...newProduct, forma: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
              <textarea placeholder="Detalles adicionales del producto..." className="w-full p-2.5 border rounded-lg h-20 resize-none" value={newProduct.descripcion} onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})} />
            </div>
          </div>

          {/* DESCUENTO */}
          <div className="flex items-center gap-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="promo"
                className="w-6 h-6 accent-yellow-600"
                checked={newProduct.tieneDescuento} 
                onChange={(e) => setNewProduct({...newProduct, tieneDescuento: e.target.checked})} 
              />
              <label htmlFor="promo" className="text-sm font-bold text-yellow-800">Activar Oferta</label>
            </div>
            {newProduct.tieneDescuento && (
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="%" 
                  className="w-20 p-2 border border-yellow-300 rounded-lg text-center font-bold text-yellow-700" 
                  value={newProduct.porcentajeDescuento} 
                  onChange={(e) => setNewProduct({...newProduct, porcentajeDescuento: e.target.value})} 
                />
                <span className="text-yellow-700 font-bold">% de descuento</span>
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">
              Descartar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-12 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-xl transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:-translate-y-1'}`}
            >
              {loading ? 'Guardando...' : 'FINALIZAR CARGA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProducto;