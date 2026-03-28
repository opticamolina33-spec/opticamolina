import { Link } from 'react-router-dom';

const Failure = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-[#FDFDFD]">
    <div className="bg-[#4a0e2e]/5 p-8 rounded-full mb-8 border border-[#4a0e2e]/10">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#4a0e2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    
    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">
      Algo no salió bien
    </h1>
    <p className="text-gray-400 max-w-sm mx-auto mb-10 font-light uppercase tracking-widest text-[11px]">
      No pudimos procesar la transacción. Verificá los datos de tu tarjeta o intentá con otro medio de pago.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4">
      <Link 
        to="/" 
        className="bg-white border-2 border-slate-900 text-slate-900 font-black py-4 px-8 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300 uppercase tracking-[0.15em] text-xs"
      >
        Volver al Inicio
      </Link>
      <button 
        onClick={() => window.history.back()}
        className="bg-[#4a0e2e] text-white font-black py-4 px-8 rounded-2xl shadow-lg hover:shadow-[#4a0e2e]/20 transition-all uppercase tracking-[0.15em] text-xs"
      >
        Reintentar Pago
      </button>
    </div>
  </div>
);

export default Failure;