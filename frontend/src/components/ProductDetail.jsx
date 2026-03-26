// Archivo: src/pages/ProductDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Pedimos el producto al endpoint público
    api.get(`/public/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar producto:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handlePayment = async (method) => {
    try {
      // Enviamos el cobro al backend
      const response = await api.post('/payments/create', {
        title: product.nombre,
        price: product.precio,
        quantity: 1,
        payment_method: method // 'card' o 'mercadopago'
      });

      // El backend nos devuelve la init_point de Mercado Pago
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error en el pago:", error);
      alert("No se pudo iniciar el proceso de pago. Reintentá en unos minutos.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-medium">Buscando tus anteojos...</p>
    </div>
  );

  if (error || !product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">Ups! Producto no encontrado</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Volver al inicio</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-0 border border-gray-100">
        
        {/* Lado Izquierdo: Imagen */}
        <div className="bg-gray-50 flex items-center justify-center p-8">
          <img 
            src={product.imagenUrl || `https://via.placeholder.com/600x600?text=${product.nombre}`} 
            alt={product.nombre}
            className="max-h-[500px] w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Lado Derecho: Info y Pagos */}
        <div className="p-10 flex flex-col justify-center">
          <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2">
            {product.category?.name || 'Colección Óptica'}
          </span>
          
          <h1 className="text-4xl font-black text-gray-900 mb-4">{product.nombre}</h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {product.descripcion || "Diseño exclusivo y máxima protección UV. Ideales para tu estilo diario."}
          </p>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-5xl font-black text-gray-900">
              ${product.precio?.toLocaleString('es-AR')}
            </span>
            <span className="text-gray-400 text-sm font-medium">IVA incluido</span>
          </div>

          {/* Sección de Acciones de Pago */}
          <div className="space-y-4">
            <h4 className="text-gray-800 font-bold mb-2">Elegí tu medio de pago:</h4>
            
            {/* Opción 1: Tarjeta Directa */}
            <button 
              onClick={() => handlePayment('card')}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Tarjeta de Crédito o Débito
            </button>

            {/* Opción 2: Mercado Pago Oficial */}
            <button 
              onClick={() => handlePayment('mercadopago')}
              className="w-full bg-[#009EE3] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#008bc7] transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-95"
            >
              <img 
                src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.19.1/mercadopago/logo__small@2x.png" 
                alt="MP" 
                className="h-6" 
              />
              Pagar con Mercado Pago
            </button>
          </div>

          {/* Información Extra */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
              Garantía Oficial
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 012.45 2.45H18a1 1 0 001-1V9.414a1 1 0 00-.293-.707l-2-2A1 1 0 0016 6.5h-2z" /></svg>
              Envíos a todo el país
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;