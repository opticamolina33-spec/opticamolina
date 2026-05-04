// Archivo: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx'; 
import AdminPanel from './pages/AdminPanel.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; // <--- NUEVO
import Success from './pages/Success';
import Failure from './pages/Failure';
import Register from './pages/Register.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import WhatsAppButton from './components/WhatsappButton.jsx';
import Pending from './pages/Pending.jsx';
import CategoryPage from './pages/CategoryPage';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-pink-200 selection:text-black">
        
        {/* Gradiente suave opcional (modo claro) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-pink-200 opacity-[0.2] blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-gray-200 opacity-[0.3] blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10">
          <Navbar />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Paneles de Administración */}
              <Route path="/admin" element={<AdminPanel />} /> 
              <Route path="/admin/ventas" element={<AdminDashboard />} /> 

              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
              <Route path="/pending" element={<Pending />} />
              <Route path="/categoria/:id" element={<CategoryPage />} />
            </Routes>
          </main>
          <WhatsAppButton />
        </div>
      </div>
    </Router>
  );
}

export default App;