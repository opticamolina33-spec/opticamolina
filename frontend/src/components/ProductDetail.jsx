import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/public/products/${id}`) // Ajustá la ruta según tu backend
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handlePayment = async (method) => {
    try {
      // Mandamos al backend la info del producto
      const response = await api.post('/payments/create', {
        title: product.nombre,
        price: product.precio,
        quantity: 1,
        method: method // Aquí podrías diferenciar en el backend
      });
      window.location.href = response.data.url;
    } catch (error) {
      alert("Error al procesar el pago");
    }
  };

  if (loading) return <div className="text-center py-20">Cargando producto...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-10 bg-white shadow-xl rounded-3xl my-10">
      <img 
        src={product.imagenUrl} 
        className="w-full rounded-2xl object-cover shadow-md" 
        alt={product.nombre} 
      />
      
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-black text-gray-800 mb-4">{product.nombre}</h1>
        <p className="text-gray-600 mb-6 text-lg">{product.descripcion}</p>
        <span className="text-4xl font-bold text-green-600 mb-8">
          ${product.precio?.toLocaleString('es-AR')}
        </span>

        <div className="space-y-4">
          {/* Botón 1: Tarjeta (Checkout personalizado o Mercado Pago Card) */}
          <button 
            onClick={() => handlePayment('card')}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex justify-center items-center gap-2"
          >
            💳 Pagar con Tarjeta de Crédito/Débito
          </button>

          {/* Botón 2: Mercado Pago (Billetera virtual) */}
          <button 
            onClick={() => handlePayment('mercadopago')}
            className="w-full bg-[#009EE3] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0081ba] transition-all flex justify-center items-center gap-2"
          >
            <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.19.1/mercadopago/logo__small@2x.png" className="h-6" alt="MP" />
            Pagar con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;