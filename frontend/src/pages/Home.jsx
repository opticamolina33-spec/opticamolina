// Archivo: src/pages/Home.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/public/products');
      // Solo mostramos productos con stock (opcional, depende de la óptica)
      // const productsWithStock = response.data.filter(p => p.stock > 0);
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Banner o Cabecera del Catálogo */}
      <div className="bg-slate-100 p-8 rounded-2xl mb-10 text-center border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3">
          Catálogo Oficial
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Descubrí la colección exclusiva de Óptica Molina. Calidad, estilo y salud visual al mejor precio.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg text-gray-600">Cargando anteojos...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow border">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-600">No encontramos productos disponibles.</h3>
          <p className="text-gray-500 mt-2">¡Estamos renovando el stock de Óptica Molina!</p>
        </div>
      ) : (
        // Grid Responsivo con Tailwind
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pie de página simple */}
      <footer className="mt-20 py-8 border-t border-gray-200 text-center text-gray-500">
        <p>&copy; 2026 Óptica Molina. Todos los derechos reservados.</p>
        <p className="text-sm">Córdoba, Argentina.</p>
      </footer>
    </div>
  );
};

export default Home;