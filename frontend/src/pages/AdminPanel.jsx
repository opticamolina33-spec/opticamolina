import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: ''
  });

  const navigate = useNavigate();

  // Verificación de admin
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
      const resProducts = await api.get('/public/products');
      setProducts(resProducts.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  // Guardar producto
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/products/${newProduct.categoryId}`, {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      });

      setIsModalOpen(false);

      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: ''
      });

      fetchData();
      alert("¡Producto cargado con éxito!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el producto");
    }
  };

  // Actualizar stock
  const handleUpdateStock = async (id, quantity) => {
    try {
      await api.patch(`/admin/products/${id}/stock`, { quantity });
      fetchData();
    } catch (error) {
      alert("Error al actualizar stock: " + (error.response?.data || error.message));
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este producto?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Panel de Administración
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Categoría</th>
              <th className="py-3 px-6 text-right">Precio</th>
              <th className="py-3 px-6 text-center">Stock</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No hay productos cargados.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 font-bold">{p.id}</td>
                  <td className="py-3 px-6">{p.name}</td>
                  <td className="py-3 px-6">{p.category?.name || 'Sin categoría'}</td>
                  <td className="py-3 px-6 text-right font-bold text-green-600">
                    ${p.price}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleUpdateStock(p.id, -1)}
                        className="bg-red-200 text-red-700 px-2 py-1 rounded hover:bg-red-300"
                      >
                        -
                      </button>

                      <span className="font-bold w-6 text-center">{p.stock}</span>

                      <button
                        onClick={() => handleUpdateStock(p.id, 1)}
                        className="bg-green-200 text-green-700 px-2 py-1 rounded hover:bg-green-300"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center space-x-3">
                      <button className="text-blue-500 hover:text-blue-700">
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
              Nuevo Anteojo
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Modelo
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-secondary outline-none"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-secondary"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-secondary"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Categoría
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-secondary"
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoryId: e.target.value })
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  * Por ahora usar ID numérico
                </p>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800 font-bold"
                >
                  Guardar Producto
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;