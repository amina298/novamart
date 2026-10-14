import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="overflow-hidden bg-[#f8faf9]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Hero content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Sparkles size={16} />
              New season is here
            </div>

            <h1 className="mt-7 max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Everything you need.
              <span className="block text-emerald-600">All in one place.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover quality products across electronics, fashion, home
              essentials, and more — all in one simple shopping experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-600"
              >
                Shop now
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition-all hover:border-emerald-300 hover:bg-emerald-50"
              >
                <ShoppingBag size={18} />
                Explore categories
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              <span>✓ Secure checkout</span>
              <span>✓ Quality products</span>
              <span>✓ Fast delivery</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-100">
                <div className="text-center">
                  <ShoppingBag
                    size={72}
                    strokeWidth={1.2}
                    className="mx-auto text-emerald-600"
                  />

                  <p className="mt-5 text-lg font-bold text-slate-800">
                    Your shopping starts here
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Explore thousands of products
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 pb-2 pt-5">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    NovaMart collection
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Curated for everyday life
                  </p>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  Featured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
