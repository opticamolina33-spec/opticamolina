// Archivo: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx'; 
import AdminPanel from './pages/AdminPanel.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import AdminUsers from './pages/AdminUsers.jsx'; 
import AdminPromociones from './pages/AdminPromociones.jsx';
import AdminCategorias from './pages/AdminCategorias.jsx';
import Success from './pages/Success';
import Failure from './pages/Failure';
import Register from './pages/Register.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import PromocionDetail from './pages/PromocionDetail.jsx';
import WhatsAppButton from './components/WhatsappButton.jsx';
import Pending from './pages/Pending.jsx';
import CategoryPage from './pages/CategoryPage';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';


function App() {
  return (
    <Router>
      <CartProvider>
      <div className="min-h-screen bg-paper font-sans text-ink selection:bg-magenta selection:text-white">
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
              <Route path="/admin/usuarios" element={<AdminUsers />} />
              <Route path="/admin/promociones" element={<AdminPromociones />} />
              <Route path="/admin/categorias" element={<AdminCategorias />} />

              {/* Productos y Promociones */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/promocion/:id" element={<PromocionDetail />} />

              {/* Pagos */}
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
              <Route path="/pending" element={<Pending />} />
              <Route path="/categoria/:id" element={<CategoryPage />} />
            </Routes>
          </main>
          <WhatsAppButton />
          <CartDrawer />
        </div>
      </div>
      </CartProvider>
    </Router>
  );
}

export default App;