// Archivo: src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      // Llamamos al endpoint que creamos en VentaController
      const res = await api.get('/admin/ventas/historial');
      setVentas(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al traer ventas", err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-gray-400">Cargando Reportes...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
          <div>
            <span className="text-[#801a4d] font-black tracking-[0.3em] text-[10px] uppercase mb-2 block">Control de Gestión</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Óptica Molina <span className="text-gray-300 font-light ml-2">Admin</span></h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Total Facturado</p>
            <p className="text-3xl font-black italic text-slate-900">
              ${ventas.reduce((acc, v) => v.estado === 'approved' ? acc + v.monto : acc, 0).toLocaleString('es-AR')}
            </p>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-8 py-5">Fecha</th>
                <th className="px-8 py-5">Producto / Descripción</th>
                <th className="px-8 py-5">Monto</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">ID Mercado Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                    {new Date(venta.fecha).toLocaleDateString('es-AR')} 
                    <span className="block text-[10px] text-gray-300">
                      {new Date(venta.fecha).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}hs
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                      {venta.producto || 'Venta General'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm">
                    ${venta.monto.toLocaleString('es-AR')}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(venta.estado)}`}>
                      {venta.estado === 'approved' ? 'Aprobado' : venta.estado}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-[10px] text-gray-400">
                    {venta.paymentIdMp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {ventas.length === 0 && (
            <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">
              No hay ventas registradas todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;