// Archivo: src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  
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
      className="group block h-full"
    >
      <div className="relative bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(74,14,46,0.15)] transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full">
        
        {/* Badge de Descuento Estilizado */}
        {product.tieneDescuento && (
          <div className="absolute top-4 left-4 z-10 bg-[#4a0e2e] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg tracking-widest uppercase">
            {product.porcentajeDescuento}% OFF
          </div>
        )}

        {/* Contenedor de Imagen */}
        <div className="relative h-64 overflow-hidden bg-[#f9f9f9]">
          <img 
            src={product.imagenUrl || `https://via.placeholder.com/400x300?text=${product.nombre}`} 
            alt={product.nombre}
            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay sutil al hacer hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"></div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Categoría - Cambiamos azul por el uva del logo */}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#801a4d] mb-2">
            {product.category?.name || 'Colección Exclusive'}
          </span>
          
          {/* Nombre - Usamos una fuente que se sienta más pesada y elegante */}
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-[#4a0e2e] transition-colors duration-300">
            {product.nombre}
          </h3>
          
          <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-light leading-relaxed">
            {product.descripcion || 'Diseño ergonómico y cristales con protección premium.'}
          </p>
          
          {/* Precio y Botón */}
          <div className="flex justify-between items-end mt-auto">
            <div className="flex flex-col">
              {product.tieneDescuento && (
                <span className="text-xs text-gray-400 line-through mb-1">
                  {formatCurrency(product.precio * 1.2)} 
                </span>
              )}
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(product.precio)}
              </span>
            </div>

            {/* Botón con el color de identidad */}
            <div className="bg-[#1a1a1a] group-hover:bg-[#4a0e2e] text-white p-3 rounded-xl transition-all duration-300 shadow-lg transform group-hover:rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          {/* Badge de Stock Bajo */}
          {product.stock > 0 && product.stock <= 3 && (
            <div className="mt-4 pt-3 border-t border-gray-50">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter italic">
                ⚠️ Solo quedan {product.stock} unidades
              </span>
            </div>
          )}

          {/* Estado Agotado */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-[#1a1a1a] text-white px-6 py-2 rounded-full font-bold text-xs tracking-widest shadow-2xl">
                AGOTADO
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;