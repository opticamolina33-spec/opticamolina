import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificación de seguridad: Solo ADMIN
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (!roles.includes('ROLE_ADMIN')) {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Cargando base de datos...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#1a1a1a] pb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            Base de Clientes
          </h1>
          <p className="text-[#801a4d] text-[10px] font-black tracking-[0.4em] uppercase mt-2">
            Óptica Molina — Database Management
          </p>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-[#1a1a1a] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#111] text-gray-500 border-b border-[#1a1a1a]">
                  <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.3em]">Usuario</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.3em]">Email</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.3em]">Dirección</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.3em]">Nacimiento</th>
                  <th className="py-6 px-8 text-center text-[10px] font-black uppercase tracking-[0.3em]">Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151515]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#4a0e2e] flex items-center justify-center text-white font-black text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-white uppercase italic tracking-tight group-hover:text-[#801a4d] transition-colors">
                            {user.name}
                          </div>
                          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest block">
                            ID: #{user.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-sm font-medium text-gray-400">
                      {user.email}
                    </td>
                    <td className="py-6 px-8 text-sm text-gray-500">
                      {user.address || <span className="italic opacity-30">No especificada</span>}
                    </td>
                    <td className="py-6 px-8 text-sm text-gray-500">
                      {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-6 px-8 text-center">
                      <div className="flex justify-center gap-2">
                        {user.roles?.map((role, idx) => (
                          <span key={idx} className="bg-[#1a1a1a] text-[9px] font-black px-3 py-1 rounded-full text-[#801a4d] border border-[#801a4d]/20 uppercase">
                            {role.name.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="py-20 text-center text-gray-600 italic tracking-widest uppercase text-[10px]">
              No hay usuarios registrados en el sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;