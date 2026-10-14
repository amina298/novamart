import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { apiRequest } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiRequest("/products");
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="bg-[#f8faf9]">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Shop NovaMart
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Discover something you’ll love.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Browse our collection of products across electronics, fashion, and
            home essentials.
          </p>
        </div>

        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-square bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="h-5 w-32 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Unable to load products.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-semibold text-slate-900">
              No products available.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Check back later for new products.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;
