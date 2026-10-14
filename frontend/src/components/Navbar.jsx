import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm">
            N
          </span>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Nova<span className="text-emerald-600">Mart</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600"
          >
            Home
          </a>

          <a
            href="/products"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Shop
          </a>

          <a
            href="/categories"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Categories
          </a>

          <a
            href="/products"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Deals
          </a>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600"
          >
            <Search size={19} strokeWidth={2} />
          </button>

          <a
            href="/wishlist"
            aria-label="Wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600"
          >
            <Heart size={19} strokeWidth={2} />
          </a>

          <a
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600"
          >
            <ShoppingCart size={19} strokeWidth={2} />

            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
              0
            </span>
          </a>

          <a
            href="/login"
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
          >
            <UserRound size={17} strokeWidth={2} />
            Login
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="/"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Home
            </a>

            <a
              href="/products"
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Shop
            </a>

            <a
              href="/categories"
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Categories
            </a>

            <a
              href="/products"
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Deals
            </a>

            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-4">
              <a
                href="/wishlist"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <Heart size={17} />
                Wishlist
              </a>

              <a
                href="/cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
              >
                <ShoppingCart size={17} />
                Cart
              </a>
            </div>

            <a
              href="/login"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              <UserRound size={17} />
              Login
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
