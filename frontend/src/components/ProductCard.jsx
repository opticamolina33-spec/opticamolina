// Archivo: src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  
  // Formateador de moneda para que se vea: $ 150.000,00
  const formatCurrency = (value) => {
    return value?.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }) || '$ 0';
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group block h-full transform transition-all duration-300 hover:-translate-y-2"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
        
        {/* Contenedor de Imagen con Overlay al hacer hover */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={product.imagenUrl || `https://via.placeholder.com/400x300?text=${product.nombre}`} 
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.tieneDescuento && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {product.porcentajeDescuento}% OFF
            </div>
          )}
          {/* Badge de Stock si es bajo */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
              Últimos {product.stock}
            </div>
          )}
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Categoría */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">
            {product.category?.name || 'Óptica'}
          </span>
          
          {/* Nombre del Producto */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {product.nombre}
          </h3>
          
          {/* Descripción Corta */}
          <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-grow">
            {product.descripcion || 'Calidad y estilo garantizado en Óptica Molina.'}
          </p>
          
          {/* Sección de Precio y Acción */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900">
                {formatCurrency(product.precio)}
              </span>
              {product.tieneDescuento && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.precio * 1.2)} 
                </span>
              )}
            </div>

            {/* Botón visual (el Link ya maneja la navegación) */}
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          {/* Estado de Stock Crítico */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl">
                SIN STOCK
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;