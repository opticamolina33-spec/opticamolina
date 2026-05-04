import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBrick, setShowBrick] = useState(false);
  const [mainImage, setMainImage] = useState(null); // Nuevo estado para la imagen principal
  const [imageGallery, setImageGallery] = useState([]); // Nuevo estado para la lista de imágenes
  
  const brickControllerRef = useRef(null);

  useEffect(() => {
    api.get(`/public/products/${id}`)
      .then(res => {
        setProduct(res.data);
        
        // Procesamos las imágenes para la galería
        const imgs = res.data.imagenUrl;
        if (Array.isArray(imgs) && imgs.length > 0) {
          setImageGallery(imgs);
          setMainImage(imgs[0]); // Por defecto muestra la primera
        } else if (typeof imgs === 'string') {
          setImageGallery([imgs]);
          setMainImage(imgs);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando producto", err);
        setLoading(false);
      });
  }, [id]);

  const initCardBrick = async () => {
    if (brickControllerRef.current) return;
    const mp = new window.MercadoPago('APP_USR-10780816-0593-4430-b7b9-fbec8b6ad066', { locale: 'es-AR' });
    const bricksBuilder = mp.bricks();

    const settings = {
      initialization: { amount: product.precio },
      callbacks: {
        onReady: () => console.log("Card Brick listo"),
        onSubmit: (formData) => {
          const paymentPayload = {
            token: formData.token,
            transaction_amount: formData.transaction_amount,
            description: `Óptica Molina - ${product.nombre}`,
            installments: formData.installments,
            payment_method_id: formData.payment_method_id,
            payer: { email: formData.payer.email }
          };

          return new Promise((resolve, reject) => {
            api.post('/payments/process', paymentPayload)
              .then((res) => {
                if (res.data.status === 'approved') {
                  navigate('/success');
                  resolve();
                } else {
                  alert("Pago no aprobado: " + res.data.status);
                  reject();
                }
              })
              .catch((error) => {
                console.error("Error en backend", error);
                alert("Error al procesar el pago. Verificá los datos.");
                reject();
              });
          });
        },
        onError: (error) => console.error("Error en Card Brick", error),
      },
    };

    brickControllerRef.current = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
  };

  const handlePayment = async (method) => {
    if (method === 'card') {
      setShowBrick(true);
      setTimeout(() => initCardBrick(), 100);
    } else {
      try {
        const response = await api.post('/payments/create', {
          title: product.nombre,
          price: product.precio,
          quantity: 1
        });
        window.location.href = response.data.url;
      } catch (error) {
        alert("Error al conectar con Mercado Pago");
      }
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
          
          {/* GALERÍA DE IMÁGENES ESTILO VULK */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnails (Miniaturas a la izquierda) */}
            {imageGallery.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible order-2 md:order-1">
                {imageGallery.map((imgUrl, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(imgUrl)}
                    className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      mainImage === imgUrl ? 'border-[#4a0e2e] opacity-100 shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Imagen Principal */}
            <div className="flex-1 relative bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 flex items-center justify-center order-1 md:order-2">
              <img 
                src={mainImage || `https://via.placeholder.com/600x600?text=${product.nombre}`} 
                alt={product.nombre}
                className="w-full h-auto object-contain mix-blend-multiply transition-opacity duration-500"
              />
            </div>
          </div>

          {/* DATOS DEL PRODUCTO */}
          <div className="flex flex-col justify-center">
            <span className="text-[#801a4d] font-black tracking-[0.3em] text-xs uppercase mb-4 border-l-4 border-[#4a0e2e] pl-4">
              {product.category?.name || 'Handmade Eyewear'}
            </span>
            
            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
              {product.nombre}
            </h1>
            
            <p className="text-gray-500 font-bold tracking-widest text-xs mb-8 uppercase">
              REF: {product.marca || 'Molina Exclusive'}
            </p>
            
            <div className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-slate-900 border-b border-gray-200 pb-2">Descripción</h4>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                {product.descripcion}
              </p>
              
              {/* Detalles extra si existen en el producto */}
              <ul className="mt-4 space-y-2 text-xs text-gray-500 font-medium">
                {product.color && <li><strong className="text-slate-900">Color:</strong> {product.color}</li>}
                {product.material && <li><strong className="text-slate-900">Material:</strong> {product.material}</li>}
                {product.tamanio && <li><strong className="text-slate-900">Talle/Medida:</strong> {product.tamanio}</li>}
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 rounded-3xl text-white mb-10 shadow-2xl relative overflow-hidden">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Precio Final</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tighter italic">
                  ${product.precio?.toLocaleString('es-AR')}
                </span>
                <span className="text-gray-400 text-sm">ARS</span>
              </div>
            </div>

            {!showBrick ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handlePayment('card')}
                  className="bg-white border-2 border-black text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-md active:scale-95"
                >
                  Tarjeta de Crédito / Débito
                </button>

                <button 
                  onClick={() => handlePayment('mercadopago')}
                  className="bg-[#009EE3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#008bc7] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  Mercado Pago
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-sm uppercase tracking-widest">Pago con Tarjeta</h3>
                  <button 
                    onClick={() => {setShowBrick(false); brickControllerRef.current = null;}}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-tighter"
                  >
                    Cancelar
                  </button>
                </div>
                <div id="cardPaymentBrick_container"></div>
              </div>
            )}

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