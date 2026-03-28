import { Link } from 'react-router-dom';

const Success = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-[#FDFDFD]">
    <div className="relative mb-8">
      {/* Círculo de fondo sutil */}
      <div className="absolute inset-0 bg-emerald-50 rounded-full scale-150 animate-pulse"></div>
      <div className="relative bg-white shadow-xl p-6 rounded-full border border-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">
      ¡PAGO CONFIRMADO!
    </h1>
    <p className="text-gray-500 max-w-md mx-auto mb-10 font-light leading-relaxed">
      Gracias por elegir la distinción de <span className="font-bold text-[#4a0e2e]">Óptica Molina</span>. 
      En breve recibirás un correo con el detalle de tu orden y el seguimiento del envío.
    </p>
    
    <Link 
      to="/" 
      className="bg-[#1a1a1a] hover:bg-[#4a0e2e] text-white font-black py-4 px-10 rounded-2xl transition-all duration-300 shadow-lg uppercase tracking-[0.2em] text-xs transform active:scale-95"
    >
      Continuar Explorando
    </Link>
  </div>
);

export default Success;