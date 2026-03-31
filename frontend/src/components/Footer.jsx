// Archivo: src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-[#050505] text-gray-500 py-16 border-t border-[#1a1a1a] relative overflow-hidden">
      {/* Resplandor decorativo sutil en el footer */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#4a0e2e] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="flex flex-col items-center">
          <img 
            src="/IMG_3486.jpg" 
            alt="Logo Óptica Molina" 
            className="h-12 w-auto mb-6 opacity-80 hover:opacity-100 transition-opacity rounded-lg"
          />
          <div className="text-white font-black tracking-[0.4em] uppercase italic mb-2">
            ÓPTICA MOLINA
          </div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#801a4d] mb-8">
            Salud visual con distinción
          </p>
          
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#4a0e2e] to-transparent mb-8"></div>
          
          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-2xl text-[11px] font-medium tracking-widest uppercase mb-8">
            <span className="hover:text-white transition-colors cursor-pointer">Colecciones</span>
            
            <a 
              href="https://maps.app.goo.gl/witpKBazKWnxEsLz9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Ubicación Córdoba
            </a>
            
            <a 
              href="https://wa.me/543516797785" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Contacto Directo
            </a>
          </div>

          {/* Info adicional */}
          <div className="text-[10px] text-gray-400 tracking-wider uppercase space-y-2 mb-10">
            <p>
              📍 <a 
                href="https://maps.app.goo.gl/witpKBazKWnxEsLz9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Ver ubicación en mapa
              </a>
            </p>
            <p>📞 351 679 7785</p>
            <p>🕒 Lunes a viernes: 9 a 13 hs — 16 a 20 hs</p>
          </div>
          
          <p className="text-[9px] text-gray-600 tracking-[0.3em] uppercase">
            &copy; 2026 Óptica Molina. Vanguardia Visual. Argentina.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;