// Archivo: src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useState } from 'react';

const ProductCard = ({ product }) => {

  const [loading, setLoading] = useState(false);

  const handleBuy = async (e) => {
    e.preventDefault(); // 🚨 evita que el Link se dispare
    e.stopPropagation(); // 🚨 evita navegación accidental

    try {
      setLoading(true);

      const response = await api.post('/payments/create', {
        title: product.nombre,
        price: product.precio,
        quantity: 1
      });

      const { url } = response.data;

      // Redirección a Mercado Pago
      window.location.href = url;

    } catch (error) {
      console.error("Error al iniciar el pago:", error);
      alert("Hubo un error al conectar con Mercado Pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="block group h-full"
    >
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
        
        {/* Imagen */}
        <img 
          src={
            product.imagenUrl || 
            `https://via.placeholder.com/300x200?text=${product.nombre}`
          } 
          alt={product.nombre}
          className="w-full h-48 object-cover"
        />

        {/* Contenido */}
        <div className="p-5 flex-grow flex flex-col">
          
          {/* Categoría */}
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold mb-2 w-fit">
            {product.category?.name || 'Óptica'}
          </span>

          {/* Nombre */}
          <h3 className="text-xl font-bold text-gray-800 mb-1 truncate group-hover:text-blue-600 transition-colors">
            {product.nombre}
          </h3>

          {/* Descripción */}
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
            {product.descripcion || 'Anteojos de alta calidad disponibles en Óptica Molina.'}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            
            {/* Precio */}
            <span className="text-2xl font-extrabold text-green-700">
              ${product.precio?.toLocaleString('es-AR') || '0'}
            </span>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              
              {/* Botón comprar */}
              {product.stock > 0 ? (
                <button 
                  onClick={handleBuy}
                  disabled={loading}
                  className={`flex items-center gap-1 font-bold py-2 px-3 rounded-lg text-sm transition-colors
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-slate-800 text-white'
                    }`}
                >
                  {loading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                      </svg>
                      Comprar
                    </>
                  )}
                </button>
              ) : (
                <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-xs">
                  Sin Stock
                </span>
              )}

              {/* Botón ver más */}
              <span className="bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-lg">
                Ver más
              </span>

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;