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
  <div className="min-h-screen bg-[#FDFDFD] p-4 pt-24">
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
        <div>
          <span className="text-[#801a4d] font-black tracking-[0.3em] text-[10px] uppercase mb-2 block">Reporte Detallado de Ventas</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Panel Administrativo</h1>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Total Facturado</p>
          <p className="text-3xl font-black italic text-slate-900">
            ${ventas.reduce((acc, v) => v.estado === 'approved' ? acc + v.monto : acc, 0).toLocaleString('es-AR')}
          </p>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-900 text-white text-[9px] uppercase tracking-[0.2em] font-black">
              <th className="px-6 py-5">Fecha / ID</th>
              <th className="px-6 py-5">Cliente</th>
              <th className="px-6 py-5">Producto</th>
              <th className="px-6 py-5">Monto / Medio</th>
              <th className="px-6 py-5">Dirección</th>
              <th className="px-6 py-5">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ventas.map((venta) => (
              <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                {/* FECHA E ID */}
                <td className="px-6 py-6">
                  <span className="text-xs font-bold text-slate-700 block">
                    {new Date(venta.fecha).toLocaleDateString('es-AR')}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono italic">
                    MP: {venta.paymentIdMp}
                  </span>
                </td>

                {/* CLIENTE */}
                <td className="px-6 py-6">
                  <span className="text-xs font-black text-slate-900 block uppercase">
                    {venta.nombreCliente}
                  </span>
                  <span className="text-[10px] text-gray-500">{venta.emailCliente}</span>
                </td>

                {/* PRODUCTO */}
                <td className="px-6 py-6">
                  <span className="text-xs font-medium text-slate-800 uppercase tracking-tight">
                    {venta.producto || 'Venta General'}
                  </span>
                </td>

                {/* MONTO Y MÉTODO */}
                <td className="px-6 py-6">
                  <span className="text-sm font-black text-slate-900 block">
                    ${venta.monto.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    {venta.metodoPago}
                  </span>
                </td>

                {/* DIRECCIÓN */}
                <td className="px-6 py-6 max-w-[200px]">
                  <p className="text-[10px] text-gray-600 leading-tight uppercase font-medium">
                    {venta.direccionEntrega}
                  </p>
                </td>

                {/* ESTADO */}
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(venta.estado)}`}>
                    {venta.estado === 'approved' ? 'Aprobado' : venta.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;