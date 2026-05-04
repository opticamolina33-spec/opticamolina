import { useState, useEffect } from 'react';
import api from '../api/axios';

const NuevoProducto = ({ isOpen, onClose, onSuccess, productToEdit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialState = {
    nombre: '',
    marca: '',
    descripcion: '',
    precio: '',
    stock: '',
    color: '',
    tamanio: '',
    material: '',
    forma: '',
    imagenUrl: '', // Se maneja como string en el input
    tieneDescuento: false,
    porcentajeDescuento: 0,
    categoryId: ''
  };

  const [newProduct, setNewProduct] = useState(initialState);

  // 📦 Traer categorías
  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      try {
        const res = await api.get("/public/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [isOpen]);

  // ✏️ Cargar datos para edición
  useEffect(() => {
    if (productToEdit) {
      // Si la imagen viene como array (List) desde el backend, la unimos con comas
      const imagenFormateada = Array.isArray(productToEdit.imagenUrl) 
        ? productToEdit.imagenUrl.join(", ") 
        : (productToEdit.imagenUrl || '');

      setNewProduct({
        nombre: productToEdit.nombre || '',
        marca: productToEdit.marca || '',
        descripcion: productToEdit.descripcion || '',
        precio: productToEdit.precio || '',
        stock: productToEdit.stock || '',
        color: productToEdit.color || '',
        tamanio: productToEdit.tamanio || '',
        material: productToEdit.material || '',
        forma: productToEdit.forma || '',
        imagenUrl: imagenFormateada,
        tieneDescuento: productToEdit.tieneDescuento || false,
        porcentajeDescuento: productToEdit.porcentajeDescuento || 0,
        categoryId: productToEdit.category?.id || ''
      });
    } else {
      setNewProduct(initialState);
    }
  }, [productToEdit, isOpen]);

  // 💾 Guardar o Editar
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.categoryId || !newProduct.imagenUrl) {
      return alert("Faltan datos críticos (Categoría o Imagen).");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Sesión expirada. Por favor, iniciá sesión de nuevo.");

    // Configuración explícita del Token para evitar el error 403
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setLoading(true);

    try {
      // Formateamos la imagen para que siempre sea un Array al enviar al backend
      const imagenesArray = typeof newProduct.imagenUrl === 'string'
        ? newProduct.imagenUrl.split(",").map(url => url.trim()).filter(url => url !== "")
        : newProduct.imagenUrl;

      if (productToEdit) {
        // ✏️ EDITAR (PUT)
        await api.put(`/admin/products/${productToEdit.id}`, {
          ...newProduct,
          precio: parseFloat(newProduct.precio),
          stock: parseInt(newProduct.stock),
          porcentajeDescuento: parseInt(newProduct.porcentajeDescuento || 0),
          imagenUrl: imagenesArray,
          category: { id: parseInt(newProduct.categoryId) }
        }, config);
      } else {
        // 🆕 CREAR (POST)
        const { categoryId, ...data } = newProduct;
        await api.post(`/admin/products/${categoryId}`, {
          ...data,
          precio: parseFloat(newProduct.precio),
          stock: parseInt(newProduct.stock),
          porcentajeDescuento: parseInt(newProduct.porcentajeDescuento || 0),
          imagenUrl: imagenesArray,
          category: { id: parseInt(categoryId) }
        }, config);
      }

      onSuccess();
      handleClose();

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar. Revisá la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewProduct(initialState);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-[#111] border border-[#222] text-white p-3 rounded-xl focus:border-[#4a0e2e] focus:ring-1 focus:ring-[#4a0e2e] outline-none transition-all placeholder:text-gray-600 font-medium";
  const labelClass = "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] shadow-2xl w-full max-w-4xl p-8 md:p-12 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              {productToEdit ? 'Editar Pieza' : 'Nueva Pieza'}
            </h2>
            <p className="text-[#4a0e2e] text-[10px] font-bold uppercase tracking-[0.3em]">
              Registro de Colección
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white text-4xl">×</button>
        </div>

        <form onSubmit={handleSaveProduct} className="space-y-8">

          {/* IMÁGENES + CATEGORÍA */}
          <div className="grid md:grid-cols-2 gap-6 bg-[#111]/50 p-6 rounded-3xl border border-[#1a1a1a]">
            <div>
              <label className={labelClass}>Imágenes (separadas por coma)</label>
              <input
                type="text"
                placeholder="https://img1.com, https://img2.com"
                className={inputClass}
                value={newProduct.imagenUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imagenUrl: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Categoría</label>
              <select
                className={inputClass}
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
              >
                <option value="">-- Seleccionar --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* DATOS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className={labelClass}>Nombre</label>
              <input
                className={inputClass}
                value={newProduct.nombre}
                onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Precio</label>
              <input
                type="number"
                className={inputClass}
                value={newProduct.precio}
                onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                className={inputClass}
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </div>
          </div>

          {/* DETALLES */}
          <div className="grid md:grid-cols-4 gap-4">
            {["color", "tamanio", "material", "forma"].map((field) => (
              <input
                key={field}
                placeholder={field}
                className={inputClass}
                value={newProduct[field]}
                onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
              />
            ))}
          </div>

          {/* DESCRIPCIÓN */}
          <textarea
            placeholder="Descripción"
            className={`${inputClass} h-24`}
            value={newProduct.descripcion}
            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
          />

          {/* DESCUENTO */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={newProduct.tieneDescuento}
              onChange={(e) => setNewProduct({ ...newProduct, tieneDescuento: e.target.checked })}
            />
            {newProduct.tieneDescuento && (
              <input
                type="number"
                placeholder="%"
                className="bg-[#111] border border-[#222] text-white p-2 rounded-lg outline-none w-20"
                value={newProduct.porcentajeDescuento}
                onChange={(e) => setNewProduct({ ...newProduct, porcentajeDescuento: e.target.value })}
              />
            )}
          </div>

          {/* ACCIONES */}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={handleClose} className="px-6 py-3 text-gray-400 font-bold hover:text-white uppercase text-xs tracking-widest">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-[#4a0e2e] text-white font-black rounded-xl hover:bg-[#6b1442] transition-colors uppercase text-xs tracking-widest">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProducto;