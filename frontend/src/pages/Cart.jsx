import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const cartItems = [
  {
    id: 1,
    name: "iPhone 15",
    category: "Electronics",
    price: 1200,
    quantity: 1,
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 89,
    quantity: 2,
  },
];

function Cart() {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 1000 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <main className="bg-[#f8faf9]">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Your shopping bag
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Shopping cart
          </h1>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
              >
                {/* Product image placeholder */}
                <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-medium text-slate-400 sm:w-28">
                  Product
                </div>

                {/* Product information */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    {item.category}
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    ${item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center rounded-xl border border-slate-200">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-emerald-600"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="flex h-10 min-w-10 items-center justify-center text-sm font-bold text-slate-900">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-emerald-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Item total */}
                <div className="flex items-center justify-between gap-5 sm:block sm:text-right">
                  <p className="font-extrabold text-slate-950">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-slate-900">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? "Free" : `$${shipping}`}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-slate-950">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
            >
              Proceed to checkout
              <ArrowRight size={18} />
            </button>

            <Link
              to="/products"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
            >
              <ShoppingBag size={17} />
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Cart;
