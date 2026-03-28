// Archivo: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx'; 
import AdminPanel from './pages/AdminPanel.jsx';
import Success from './pages/Success';
import Failure from './pages/Failure';
import Register from './pages/Register.jsx';
import ProductDetail from './pages/ProductDetail.jsx'; // Asegúrate que esté en pages si es una vista completa

function App() {
  return (
    <Router>
      {/* Cambiamos el fondo a uno más limpio para que resalte el contenido */}
      <div className="min-h-screen bg-[#FDFDFD] font-sans">
        <Navbar />
        {/* Sacamos el 'p-4' del container para que el Hero del Home sea Full Width */}
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} /> 
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;