// Archivo: src/pages/ProductDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Referencia para el contenedor de Mercado Pago
  const mpContainerRef = useRef(null);

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
      // 1. Pedimos la preferencia al backend
      const response = await api.post('/payments/create', {
        title: product.nombre,
        price: product.precio,
        quantity: 1,
        payment_method: method 
      });

      // El backend debe devolver el preferenceId (id) además de la url
      const preferenceId = response.data.id; 

      if (method === 'mercadopago') {
        // Si es MP directo, lo mandamos a la billetera
        window.location.href = response.data.url;
      } else {
        // 2. Si es TARJETA, inicializamos el Checkout Pro In-Context
        const mp = new window.MercadoPago('APP_USR-10780816-0593-4430-b7b9-fbec8b6ad066', { // <--- PONÉ TU PUBLIC KEY
          locale: 'es-AR'
        });

        mp.checkout({
          preference: {
            id: preferenceId
          },
          autoOpen: true // Abre el modal automáticamente
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con la pasarela de pagos.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFD]">
      <div className="w-16 h-1 bg-gray-100 overflow-hidden">
        <div className="w-full h-full bg-[#4a0e2e] animate-pulse"></div>
      </div>
      <p className="mt-4 text-xs font-black tracking-[0.3em] text-gray-400 uppercase">Ajustando cristales...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        
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
          <div className="relative group bg-white rounded-3xl p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
            <img 
              src={product.imagenUrl || `https://via.placeholder.com/600x600?text=${product.nombre}`} 
              alt={product.nombre}
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[#801a4d] font-black tracking-[0.3em] text-xs uppercase mb-4 border-l-4 border-[#4a0e2e] pl-4">
              {product.category?.name || 'Handmade Eyewear'}
            </span>
            
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
              {product.nombre}
            </h1>
            
            <p className="text-gray-500 text-lg mb-10 font-light leading-relaxed max-w-lg">
              {product.descripcion}
            </p>

            <div className="bg-[#1a1a1a] p-8 rounded-3xl text-white mb-10 shadow-2xl relative overflow-hidden">
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
              {/* Botón Tarjeta: Ahora abre el Modal */}
              <button 
                onClick={() => handlePayment('card')}
                className="bg-white border-2 border-black text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-md active:scale-95"
              >
                Tarjeta de Débito o Crédito
              </button>

              <button 
                onClick={() => handlePayment('mercadopago')}
                className="bg-[#009EE3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#008bc7] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                Billetera Virtual
              </button>
            </div>

            {/* Este div es necesario por si usás Bricks más adelante */}
            <div id="wallet_container" ref={mpContainerRef} className="mt-4"></div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 italic text-[10px] text-gray-400 uppercase tracking-widest">
                Protección UV400 • Lentes Certificados • Óptica Molina
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;