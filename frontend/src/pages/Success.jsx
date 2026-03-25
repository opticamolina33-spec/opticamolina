import { Link } from 'react-router-dom';

const Success = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
    <div className="bg-green-100 p-6 rounded-full mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 className="text-4xl font-extrabold text-primary mb-2">¡Pago Exitoso!</h1>
    <p className="text-xl text-gray-600 mb-8">Gracias por confiar en Óptica Molina. Tu pedido está en camino.</p>
    <Link to="/" className="bg-primary hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg transition-colors">
      Volver al Catálogo
    </Link>
  </div>
);

export default Success;