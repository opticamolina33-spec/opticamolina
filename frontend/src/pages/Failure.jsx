import { Link } from 'react-router-dom';

const Failure = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
    <div className="bg-red-100 p-6 rounded-full mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h1 className="text-4xl font-extrabold text-primary mb-2">Hubo un problema</h1>
    <p className="text-xl text-gray-600 mb-8">No pudimos procesar tu pago. Por favor, intentá nuevamente.</p>
    <Link to="/" className="bg-secondary hover:bg-blue-400 text-primary font-bold py-3 px-8 rounded-lg transition-colors">
      Reintentar Compra
    </Link>
  </div>
);

export default Failure;