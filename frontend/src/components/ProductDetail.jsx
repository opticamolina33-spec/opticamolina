import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatPrice, productBadge, splitName } from '../lib/catalog';
import Footer from './Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBrick, setShowBrick] = useState(false);
  const [mainImage, setMainImage] = useState(null); // Nuevo estado para la imagen principal
  const [imageGallery, setImageGallery] = useState([]); // Nuevo estado para la lista de imágenes
  
  const brickControllerRef = useRef(null);
  const { add } = useCart();

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
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-16 h-1 bg-stone overflow-hidden rounded-full">
        <div className="w-full h-full bg-magenta animate-pulse"></div>
      </div>
      <p className="mt-4 label-mono text-muted">Ajustando cristales...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-[70vh] grid place-items-center text-center px-6">
      <div>
        <p className="font-display text-3xl">Producto no encontrado</p>
        <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-ink text-white h-12 px-6 text-sm font-semibold">Volver al inicio</button>
      </div>
    </div>
  );

  const { brand, model } = splitName(product);
  const badge = productBadge(product);
  const detalles = (product.descripcion || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const specs = [
    ['Color', product.color],
    ['Material', product.material],
    ['Medida', product.tamanio],
    ['Forma', product.forma],
  ].filter(([, v]) => v);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="label-mono text-[10px] text-muted hover:text-ink mb-8 transition-colors"
        >
          ← Volver a la colección
        </button>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16 items-start">

          {/* GALERÍA */}
          <div className="flex flex-col md:flex-row gap-4">
            {imageGallery.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto scrollbar-hide order-2 md:order-1">
                {imageGallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(imgUrl)}
                    className={`w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-stone border-2 transition-all ${
                      mainImage === imgUrl ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Vista ${index + 1}`} className="w-full h-full object-contain p-1.5 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative aspect-square rounded-[28px] bg-stone flex items-center justify-center order-1 md:order-2 overflow-hidden">
              {badge && (
                <span className={`absolute top-5 left-5 rounded-full px-3 py-1 text-xs font-medium ${badge.accent ? 'bg-magenta text-white' : 'bg-white/80'}`}>
                  {badge.label}
                </span>
              )}
              {mainImage && (
                <img
                  src={mainImage}
                  alt={product.nombre}
                  className="w-full h-full object-contain p-10 md:p-16 mix-blend-multiply"
                />
              )}
            </div>
          </div>

          {/* DATOS DEL PRODUCTO */}
          <div className="flex flex-col">
            <span className="label-mono text-muted">{brand} · {product.category?.name || 'Óptica Molina'}</span>
            <h1 className="font-display text-[44px] md:text-[64px] leading-[0.95] mt-3">{model}</h1>

            <div className="mt-6 flex items-baseline gap-3">
              {product.tieneDescuento && product.porcentajeDescuento > 0 && (
                <span className="text-muted line-through">
                  {formatPrice(product.precio / (1 - product.porcentajeDescuento / 100))}
                </span>
              )}
              <span className="font-display text-4xl">{formatPrice(product.precio)}</span>
              <span className="text-sm text-muted">ARS</span>
            </div>

            {detalles.length > 0 && (
              <ul className="mt-8 space-y-2 text-[15px]">
                {detalles.map((d, i) => (
                  <li key={i} className="flex gap-3"><span className="text-magenta">—</span>{d}</li>
                ))}
              </ul>
            )}

            {specs.length > 0 && (
              <dl className="mt-8 grid grid-cols-[110px_1fr] gap-y-2 text-sm border-t border-black/10 pt-6">
                {specs.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 space-y-3">
              <button
                onClick={() => add(product)}
                disabled={product.stock === 0}
                className="w-full h-14 rounded-full bg-ink text-white font-semibold hover:bg-magenta transition-colors disabled:opacity-40"
              >
                {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
              </button>

              {!showBrick ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePayment('card')}
                    className="h-12 rounded-full border border-ink/20 text-sm font-medium hover:bg-white transition-colors"
                  >
                    Tarjeta de crédito / débito
                  </button>
                  <button
                    onClick={() => handlePayment('mercadopago')}
                    className="h-12 rounded-full bg-[#009EE3] text-white text-sm font-semibold hover:bg-[#008bc7] transition-colors"
                  >
                    Mercado Pago
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-[28px] border border-black/5 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold">Pago con tarjeta</h3>
                    <button
                      onClick={() => {setShowBrick(false); brickControllerRef.current = null;}}
                      className="text-sm text-magenta"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div id="cardPaymentBrick_container"></div>
                </div>
              )}
            </div>

            <p className="mt-10 pt-6 border-t border-black/10 label-mono text-[10px] text-muted">
              Protección UV400 · Lentes certificados · Retiro en el local o envío a todo el país
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
