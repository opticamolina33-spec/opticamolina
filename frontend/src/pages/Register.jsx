import { useState } from 'react';
import api from '../api/axios';

export const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert("¡Cuenta creada! Ahora podés iniciar sesión.");
            // Redirigir al login
            window.location.href = '/login';
        } catch (error) {
            alert(error.response?.data || "Error al registrarse");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta - Óptica Molina</h2>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <input 
                    type="email" 
                    placeholder="Tu email"
                    className="border p-2 rounded"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Tu contraseña"
                    className="border p-2 rounded"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Registrarse
                </button>
            </form>
        </div>
    );
};