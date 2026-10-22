import { useState } from 'react';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatPrice, whatsappUrl } from '../lib/catalog';

const CartDrawer = () => {
  const { items, total, count, open, setOpen, setQty, remove } = useCart();
  const [paying, setPaying] = useState(false);

  if (!open) return null;

  const resumen = items.map((i) => `${i.qty} x ${i.brand} ${i.model}`).join(', ');

  const checkout = async () => {
    setPaying(true);
    try {
      const response = await api.post('/payments/create', {
        title: `Óptica Molina - ${resumen}`.slice(0, 250),
        price: total,
        quantity: 1,
      });
      window.location.href = response.data.url;
    } catch {
      alert('Error al conectar con Mercado Pago');
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-paper flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 h-16 border-b border-black/5">
          <p className="font-display text-lg">Carrito · {count}</p>
          <button onClick={() => setOpen(false)} aria-label="Cerrar carrito" className="p-1">
            <FiX size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <p className="font-display text-2xl">Tu carrito está vacío.</p>
              <p className="mt-2 text-sm text-muted">Explorá el catálogo y agregá tus modelos favoritos.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex gap-4">
                <div className="w-20 h-20 shrink-0 rounded-2xl bg-stone grid place-items-center overflow-hidden">
                  {i.imagen && <img src={i.imagen} alt="" className="w-full h-full object-contain p-2 mix-blend-multiply" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-mono text-[10px] text-muted">{i.brand}</p>
                  <p className="font-medium truncate">{i.model}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-black/10 px-2 h-8">
                      <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Restar"><FiMinus size={13} /></button>
                      <span className="text-sm w-4 text-center">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Sumar"><FiPlus size={13} /></button>
                    </div>
                    <span className="font-semibold text-sm">{formatPrice(i.precio * i.qty)}</span>
                  </div>
                </div>
                <button onClick={() => remove(i.id)} aria-label="Quitar" className="self-start text-muted hover:text-ink">
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-black/5 p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>
            <button
              onClick={checkout}
              disabled={paying}
              className="w-full h-12 rounded-full bg-ink text-white text-sm font-semibold hover:bg-magenta transition-colors disabled:opacity-60"
            >
              {paying ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
            </button>
            <a
              href={whatsappUrl(`Hola! Quiero consultar por: ${resumen}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-full border border-ink/20 text-sm font-medium grid place-items-center hover:bg-white transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
