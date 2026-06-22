import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const PromocionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBrick, setShowBrick] = useState(false);
  const brickControllerRef = useRef(null);

  useEffect(() => {
    api.get(`/public/promociones/${id}`)
      .then(res => {
        setPromo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const initCardBrick = async () => {
    if (brickControllerRef.current) return;
    const mp = new window.MercadoPago('APP_USR-10780816-0593-4430-b7b9-fbec8b6ad066', { locale: 'es-AR' });
    const bricksBuilder = mp.bricks();

    const settings = {
      initialization: { amount: promo.precio },
      callbacks: {
        onReady: () => {},
        onSubmit: (formData) => {
          const paymentPayload = {
            token: formData.token,
            transaction_amount: formData.transaction_amount,
            description: `Óptica Molina - Promo: ${promo.titulo}`,
            installments: formData.installments,
            payment_method_id: formData.payment_method_id,
            payer: { email: formData.payer.email },
          };

          return new Promise((resolve, reject) => {
            api.post('/payments/process', paymentPayload)
              .then(res => {
                if (res.data.status === 'approved') {
                  navigate('/success');
                  resolve();
                } else {
                  alert('Pago no aprobado: ' + res.data.status);
                  reject();
                }
              })
              .catch(error => {
                console.error('Error en backend', error);
                alert('Error al procesar el pago. Verificá los datos.');
                reject();
              });
          });
        },
        onError: (error) => console.error('Error en Card Brick', error),
      },
    };

    brickControllerRef.current = await bricksBuilder.create(
      'cardPayment',
      'cardPaymentBrick_container_promo',
      settings
    );
  };

  const handlePayment = async (method) => {
    if (method === 'card') {
      setShowBrick(true);
      setTimeout(() => initCardBrick(), 100);
    } else {
      try {
        const response = await api.post('/payments/create', {
          title: promo.titulo,
          price: promo.precio,
          quantity: 1,
        });
        window.location.href = response.data.url;
      } catch {
        alert('Error al conectar con Mercado Pago');
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFD]">
      <div className="w-16 h-1 bg-gray-100 overflow-hidden">
        <div className="w-full h-full bg-[#4a0e2e] animate-pulse"></div>
      </div>
      <p className="mt-4 text-xs font-black tracking-[0.3em] text-gray-400 uppercase">Cargando promoción...</p>
    </div>
  );

  if (!promo) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Promoción no encontrada.</p>
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
          Volver
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── IMÁGENES ── */}
          <div className="relative flex items-center justify-center min-h-[360px]">

            {/* Imagen 2 (fondo) */}
            {promo.imagen2Url && (
              <div
                className="absolute right-0 top-4 w-[46%] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
                style={{ transform: 'rotate(5deg) translateY(12px)' }}
              >
                <img src={promo.imagen2Url} alt="Vista 2" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Imagen 1 (frente) */}
            {promo.imagen1Url && (
              <div
                className="relative left-0 w-[54%] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-10"
                style={{ transform: 'rotate(-3deg) translateY(-6px)' }}
              >
                <img src={promo.imagen1Url} alt="Vista 1" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Solo imagen 1 sin imagen 2 */}
            {promo.imagen1Url && !promo.imagen2Url && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img src={promo.imagen1Url} alt={promo.titulo} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* ── INFO Y PAGO ── */}
          <div className="flex flex-col justify-center">
            <span className="text-[#801a4d] font-black tracking-[0.3em] text-xs uppercase mb-4 border-l-4 border-[#4a0e2e] pl-4">
              Promoción especial
            </span>

            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-none">
              {promo.titulo}
            </h1>

            {promo.descripcion && (
              <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  {promo.descripcion}
                </p>
              </div>
            )}

            <div className="bg-[#1a1a1a] p-8 rounded-3xl text-white mb-8 shadow-2xl relative overflow-hidden">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Precio Promocional</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tighter italic">
                  ${promo.precio?.toLocaleString('es-AR')}
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
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-sm uppercase tracking-widest">Pago con Tarjeta</h3>
                  <button
                    onClick={() => { setShowBrick(false); brickControllerRef.current = null; }}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-tighter"
                  >
                    Cancelar
                  </button>
                </div>
                <div id="cardPaymentBrick_container_promo"></div>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest italic">
              Protección UV400 • Lentes Certificados • Óptica Molina
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromocionDetail;