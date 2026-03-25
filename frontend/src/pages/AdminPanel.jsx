 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NuevoProducto from '../components/NuevoProducto';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (!roles.includes('ROLE_ADMIN')) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const res = await api.get('/public/products');
      setProducts(res.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleUpdateStock = async (id, quantity) => {
    try {
      await api.patch(`/admin/products/${id}/stock`, { quantity });
      fetchData();
    } catch (err) { alert("Error actualizando stock"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que querés eliminarlo?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Panel Óptica Molina</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all"
        >
          + Cargar Anteojo
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full leading-normal">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="py-4 px-6 text-left">Modelo / Marca</th>
              <th className="py-4 px-6 text-left">Categoría</th>
              <th className="py-4 px-6 text-right">Precio</th>
              <th className="py-4 px-6 text-center">Stock</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-bold">{p.nombre} <span className="block text-xs text-gray-400 font-normal">{p.marca}</span></td>
                <td className="py-4 px-6 text-sm">{p.category?.name}</td>
                <td className="py-4 px-6 text-right font-bold text-green-600">${p.precio}</td>
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleUpdateStock(p.id, -1)} className="px-2 bg-red-100 rounded">-</button>
                    <span className="w-4">{p.stock}</span>
                    <button onClick={() => handleUpdateStock(p.id, 1)} className="px-2 bg-green-100 rounded">+</button>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPONENTE HIJO MODAL */}
      <NuevoProducto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
};

export default AdminPanel;
