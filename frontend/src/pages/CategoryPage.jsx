import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    setLoading(true);
    Promise.all([api.get(`/public/products/category/${id}`), api.get('/public/categories')])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data || []);
        setCategory(categoriesRes.data?.find((c) => String(c.id) === String(id)) || productsRes.data?.[0]?.category || null);
      })
      .catch((error) => console.error('Error cargando productos de la categoría:', error))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 pt-10 md:pt-16">
        <Link to="/" className="label-mono text-[10px] text-muted hover:text-ink">← Inicio</Link>
        <span className="label-mono block mt-6 text-[10px] md:text-[11px] text-muted">
          {loading ? 'Cargando' : `${products.length} modelos`}
        </span>
        <h1 className="font-display text-[40px] leading-none md:text-[64px] mt-2">{category?.name || 'Categoría'}</h1>
      </section>

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-10 md:py-14">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-12">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 rounded-[28px] bg-white/50 border border-black/5">
            <p className="font-display text-2xl">Sin productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-12">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
