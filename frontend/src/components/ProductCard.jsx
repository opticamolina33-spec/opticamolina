import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { firstImage, formatPrice, productBadge, specsLine, splitName } from '../lib/catalog';

const readFavs = () => {
  try {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
  } catch {
    return [];
  }
};

const ProductCard = ({ product, imgLoading = 'lazy' }) => {
  const { add } = useCart();
  const [fav, setFav] = useState(() => readFavs().includes(product.id));
  const { brand, model } = splitName(product);
  const badge = productBadge(product);
  const image = firstImage(product);
  const agotado = product.stock === 0;

  const toggleFav = (e) => {
    e.preventDefault();
    const next = fav ? readFavs().filter((id) => id !== product.id) : [...readFavs(), product.id];
    try {
      localStorage.setItem('favoritos', JSON.stringify(next));
    } catch {
      // ignorar
    }
    setFav(!fav);
  };

  return (
    <div className="group flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="relative block aspect-square rounded-[22px] bg-stone overflow-hidden">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-medium ${badge.accent ? 'bg-magenta text-white' : 'bg-white/80 text-ink'}`}>
            {badge.label}
          </span>
        )}
        <button
          onClick={toggleFav}
          aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute top-3 right-3 z-10 h-8 w-8 grid place-items-center rounded-full hover:bg-white/70 transition-colors"
        >
          <FiHeart size={15} className={fav ? 'fill-magenta text-magenta' : ''} />
        </button>
        {image && (
          <img
            src={image}
            alt={product.nombre}
            loading={imgLoading}
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain p-6 md:p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {agotado && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-ink text-white text-[10px] font-semibold tracking-widest text-center py-1.5">
            AGOTADO
          </span>
        )}
      </Link>

      <div className="pt-4 px-1 flex flex-col flex-1">
        <span className="label-mono text-[10px] text-muted">{brand}</span>
        <Link to={`/product/${product.id}`} className="mt-1 text-[15px] md:text-base font-medium leading-snug hover:text-magenta transition-colors line-clamp-1">
          {model}
        </Link>
        <p className="hidden md:block mt-1 text-xs text-muted line-clamp-1">{specsLine(product)}</p>

        <div className="mt-3 flex items-center justify-between gap-2 md:mt-auto md:pt-4">
          <span className="font-display text-[15px] md:text-base tracking-normal">{formatPrice(product.precio)}</span>
          <button
            onClick={() => add(product)}
            disabled={agotado}
            className="hidden md:inline-flex rounded-full border border-ink/25 px-4 py-1.5 text-xs font-medium hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
