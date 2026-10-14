import { ArrowRight, LockKeyhole, Mail, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8faf9]">
      <section className="mx-auto flex max-w-md flex-col px-6 py-16 sm:py-20">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <ShoppingBag size={26} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
            Sign in to NovaMart
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Access your orders, wishlist, cart, and account.
          </p>
        </div>

        <form className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-800"
            >
              Email address
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-800"
              >
                Password
              </label>

              <button
                type="button"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
          >
            Sign in
            <ArrowRight size={18} />
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              Create one
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
