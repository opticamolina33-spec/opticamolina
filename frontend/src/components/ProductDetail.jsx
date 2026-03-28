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
    api.get(`/public/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handlePayment = async (method) => {
    try {
      const response = await api.post('/payments/create', {
        title: product.nombre,
        price: product.precio,
        quantity: 1,
        payment_method: method 
      });
      if (response.data.url) window.location.href = response.data.url;
    } catch (error) {
      alert("Error al procesar el pago.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFD]">
      <div className="w-16 h-1 bg-gray-100 overflow-hidden">
        <div className="w-full h-full bg-[#4a0e2e] animate-[loading_1.5s_infinite]"></div>
      </div>
      <p className="mt-4 text-xs font-black tracking-[0.3em] text-gray-400 uppercase">Ajustando cristales...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        
        {/* Volver con sutileza */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center text-gray-400 hover:text-black mb-10 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la colección
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* GALERÍA DE IMAGEN */}
          <div className="relative group bg-white rounded-3xl p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
            <img 
              src={product.imagenUrl || `https://via.placeholder.com/600x600?text=${product.nombre}`} 
              alt={product.nombre}
              className="w-full h-auto object-contain mix-blend-multiply"
            />
            {product.stock <= 3 && (
              <div className="absolute top-6 right-6 bg-[#4a0e2e] text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-tighter">
                Pieza exclusiva - {product.stock} disponibles
              </div>
            )}
          </div>

          {/* INFORMACIÓN COMPRA */}
          <div className="flex flex-col justify-center">
            <span className="text-[#801a4d] font-black tracking-[0.3em] text-xs uppercase mb-4 border-l-4 border-[#4a0e2e] pl-4">
              {product.category?.name || 'Handmade Eyewear'}
            </span>
            
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
              {product.nombre}
            </h1>
            
            <p className="text-gray-500 text-lg mb-10 font-light leading-relaxed max-w-lg">
              {product.descripcion || "Diseño ergonómico con acabados de alta precisión. La protección que tus ojos merecen con el sello de calidad Molina."}
            </p>

            <div className="bg-[#1a1a1a] p-8 rounded-3xl text-white mb-10 shadow-2xl relative overflow-hidden">
               {/* Decoración fondo precio */}
              <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl font-black italic select-none">M</div>
              
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Precio Final</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tighter italic">
                  ${product.precio?.toLocaleString('es-AR')}
                </span>
                <span className="text-gray-400 text-sm">ARS</span>
              </div>
            </div>

            {/* BOTONES DE PAGO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handlePayment('card')}
                className="bg-white border-2 border-black text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-md active:scale-95"
              >
                Tarjeta de Crédito
              </button>

              <button 
                onClick={() => handlePayment('mercadopago')}
                className="bg-[#009EE3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#008bc7] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                Mercado Pago
              </button>
            </div>

            {/* BENEFICIOS SUTILES */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  <svg className="h-5 w-5 text-[#4a0e2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estuche Premium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  <svg className="h-5 w-5 text-[#4a0e2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Protección UV400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;