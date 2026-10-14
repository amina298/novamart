import { Heart, ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-200/60">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <div className="flex h-full items-center justify-center text-slate-400">
          <span className="text-sm font-medium">Product image</span>
        </div>

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:text-red-500"
        >
          <Heart size={18} />
        </button>

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            {product.badge}
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute bottom-4 left-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
            Out of stock
          </span>
        )}
      </div>

      {/* Product information */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          {product.category || "NovaMart"}
        </p>

        <h3 className="mt-2 text-lg font-bold text-slate-900">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-extrabold text-slate-950">
              ${Number(product.price).toLocaleString()}
            </span>

            {!isOutOfStock && (
              <p className="mt-1 text-xs text-slate-400">
                {product.stock} available
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <ShoppingCart size={16} />
            {isOutOfStock ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
