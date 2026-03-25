// Archivo: src/components/ProductCard.jsx
import api from '../api/axios';

const ProductCard = ({ product }) => {
  
  // Función temporal para probar Mercado Pago (luego la mejoraremos)
  const handleBuy = async () => {
    try {
      // Le pegamos al backend con los datos básicos del producto
      const response = await api.post('/payments/create', {
        title: product.name,
        price: product.price,
        quantity: 1 // Por defecto compramos de a uno en este flujo rápido
      });

      // El backend nos devuelve la URL de Mercado Pago (init_point)
      const { url } = response.data;
      
      // Redirigimos al usuario a la pasarela de pago
      window.location.href = url;

    } catch (error) {
      console.error("Error al iniciar el pago:", error);
      alert("Hubo un error al conectar con Mercado Pago.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Imagen del producto (placeholder por ahora) */}
      <img 
        src={`https://via.placeholder.com/300x200?text=${product.name}`} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-5 flex-grow flex flex-col">
        {/* Categoría con estilo de badge */}
        <span className="inline-block bg-secondary bg-opacity-20 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wider mb-2 w-fit">
          {product.category?.name || 'Óptica'}
        </span>
        
        <h3 className="text-xl font-bold text-primary mb-1 truncate">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description || 'Anteojos de alta calidad disponibles en Óptica Molina.'}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-green-700">
            ${product.price.toLocaleString('es-AR')}
          </span>
          
          {product.stock > 0 ? (
            <button 
              onClick={handleBuy}
              className="bg-primary hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Comprar</span>
            </button>
          ) : (
            <span className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded">
              Sin Stock
            </span >
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;