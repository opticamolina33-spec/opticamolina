import { FaWhatsapp } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { whatsappUrl } from '../lib/catalog';

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const { count, setOpen } = useCart();
  const url = whatsappUrl();

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Desktop: botón flotante */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="hidden lg:grid fixed bottom-6 right-6 z-40 place-items-center w-12 h-12 rounded-full bg-ink text-white text-xl shadow-lg hover:bg-magenta transition-colors"
      >
        <FaWhatsapp />
      </a>

      {/* Mobile: barra inferior */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex gap-2 bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-black/5">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-ink text-white rounded-full h-12 text-sm font-semibold"
          >
            <FaWhatsapp size={17} /> WhatsApp
          </a>
          <button
            onClick={() => setOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-full h-12 text-sm font-medium"
          >
            <FiShoppingBag size={16} /> Ver carrito · {count}
          </button>
        </div>
      </div>
    </>
  );
}
