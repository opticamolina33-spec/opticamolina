import { Link } from 'react-router-dom';

const Pending = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-[#FDFDFD]">
    <div className="relative mb-8">
      {/* Círculo animado */}
      <div className="absolute inset-0 bg-amber-50 rounded-full scale-150 animate-pulse"></div>
      <div className="relative bg-white shadow-xl p-6 rounded-full border border-amber-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-amber-500 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3"
          />
        </svg>
      </div>
    </div>

    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">
      PAGO PENDIENTE
    </h1>

    <p className="text-gray-500 max-w-md mx-auto mb-10 font-light leading-relaxed">
      Estamos procesando tu pago en <span className="font-bold text-[#4a0e2e]">Optica Molina</span>. 
      Esto puede tardar unos instantes. Te avisaremos por correo cuando se confirme.
    </p>

    <div className="flex flex-col sm:flex-row gap-4">
      <Link 
        to="/" 
        className="bg-[#1a1a1a] hover:bg-[#4a0e2e] text-white font-black py-4 px-10 rounded-2xl transition-all duration-300 shadow-lg uppercase tracking-[0.2em] text-xs transform active:scale-95"
      >
        Seguir Explorando
      </Link>

      <button 
        onClick={() => window.location.reload()}
        className="bg-white border-2 border-slate-900 text-slate-900 font-black py-4 px-8 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300 uppercase tracking-[0.15em] text-xs"
      >
        Actualizar Estado
      </button>
    </div>
  </div>
);

export default Pending;