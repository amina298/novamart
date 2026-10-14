import {
  ArrowRight,
  Dumbbell,
  Home as HomeIcon,
  Laptop,
  Shirt,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    description: "Smart devices, computers, and everyday technology.",
    icon: Laptop,
    items: "120+ products",
  },
  {
    name: "Fashion",
    description: "Modern clothing, footwear, and accessories.",
    icon: Shirt,
    items: "180+ products",
  },
  {
    name: "Mobile",
    description: "Phones, accessories, and mobile essentials.",
    icon: Smartphone,
    items: "90+ products",
  },
  {
    name: "Home & Living",
    description: "Furniture, lighting, decor, and home essentials.",
    icon: HomeIcon,
    items: "150+ products",
  },
  {
    name: "Beauty",
    description: "Personal care, beauty, and wellness essentials.",
    icon: Sparkles,
    items: "80+ products",
  },
  {
    name: "Sports",
    description: "Fitness equipment, sportswear, and active essentials.",
    icon: Dumbbell,
    items: "70+ products",
  },
];

function Categories() {
  return (
    <main className="bg-[#f8faf9]">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Explore NovaMart
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Shop by category.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Find what you need faster by exploring our carefully organized
            product categories.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                to="/products"
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600"
                  />
                </div>

                <h2 className="mt-7 text-xl font-bold text-slate-900">
                  {category.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {category.items}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Categories;
