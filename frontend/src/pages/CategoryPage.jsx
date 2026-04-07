import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Footer from '../components/Footer';

const CategoryPage = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      const [productsRes, categoryRes] = await Promise.all([
        api.get(`/public/products?categoryId=${id}`), // 🔥 ideal
        api.get(`/public/categories/${id}`)
      ]);

      setProducts(productsRes.data);
      setCategory(categoryRes.data);

    } catch (error) {
      console.error("Error cargando categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* HERO / HEADER */}
      <div className="py-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight">
            {category?.name || "Categoría"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">
            Explorá la colección completa
          </p>
        </div>
      </div>

      <main className="container mx-auto px-6 md:px-12 py-20">

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>

        ) : products.length === 0 ? (

          <div className="text-center py-32">
            <h3 className="text-xl text-gray-400 italic uppercase">
              Sin productos en esta categoría
            </h3>
          </div>

        ) : (

          // 🔥 GALERÍA (igual a tu estilo original)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="group transition-all duration-500 hover:scale-[1.02]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;