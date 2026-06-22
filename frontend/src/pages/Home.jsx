import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import PromocionBanner from '../components/PromocionBanner';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/public/products'),
        api.get('/public/categories')
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);

    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedProducts = categories.map((cat) => ({
    ...cat,
    items: products.filter(
      (p) => p.category?.id === cat.id
    )
  }));

  return (
    <div className="min-h-screen bg-white text-gray-800">
      
      {/* HERO */}
      <div className="relative py-24 px-6 overflow-hidden border-b border-gray-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-pink-200/40 via-transparent to-transparent opacity-60"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-5 py-1.5 border border-pink-300 rounded-full bg-pink-100">
            <span className="tracking-[0.5em] uppercase text-[10px] font-black text-pink-700">
              Su optica de confianza
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic uppercase leading-none text-gray-900">
            OPTICA <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400">MOLINA</span>
          </h1>
          
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed tracking-wide italic">
            Colecciones de autor para quienes ven más allá. <br />
            Diseño, precisión y exclusividad en cada detalle.
          </p>
        </div>
      </div>

      {/* ── BANNER DE PROMOCIONES (solo aparece si hay promos activas) ── */}
      <PromocionBanner />

      <main className="container mx-auto px-6 md:px-12 py-20">
        
        {/* HEADER CATÁLOGO */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4 border-l-4 border-pink-400 pl-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
              Catálogo de Armazones
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Disponibilidad inmediata en Córdoba
            </p>
          </div>

          {!loading && (
            <div className="bg-gray-100 px-6 py-2 rounded-2xl border border-gray-200">
              <span className="text-[10px] font-black text-gray-700 tracking-widest uppercase italic">
                {products.length} Modelos Curados
              </span>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>

        ) : products.length === 0 ? (

          <div className="text-center py-32 bg-gray-100 rounded-[3rem] border border-gray-200 shadow-inner">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 uppercase tracking-widest italic">
              Galería Vacía
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Nuevos ingresos en proceso de curaduría.
            </p>
          </div>

        ) : (

          <div className="space-y-20">
            {groupedProducts.map((category) => (
              category.items.length > 0 && (
                <section key={category.id}>
                  
                  <div className="mb-6 flex items-center justify-between">
                    <Link to={`/categoria/${category.id}`}>
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-wide text-gray-900 hover:opacity-70 transition cursor-pointer">
                        {category.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {category.items.map((product) => (
                      <div
                        key={product.id}
                        className="min-w-[260px] max-w-[260px] flex-shrink-0 group transition-all duration-500 hover:scale-[1.03]"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                </section>
              )
            ))}
          </div>

        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;