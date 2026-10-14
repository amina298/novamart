import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8faf9]">
      <section className="mx-auto flex max-w-lg flex-col px-6 py-12 sm:py-16">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <ShoppingBag size={26} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Create your account
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
            Join NovaMart
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Create an account to start shopping and manage your orders.
          </p>
        </div>

        <form className="mt-9 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* First name */}
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-slate-800"
              >
                First name
              </label>

              <div className="relative mt-2">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Amina"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Last name */}
            <div>
              <label
                htmlFor="lastName"
                className="text-sm font-semibold text-slate-800"
              >
                Last name
              </label>

              <div className="relative mt-2">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Jama"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mt-5">
            <label
              htmlFor="register-email"
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
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mt-5">
            <label
              htmlFor="phone"
              className="text-sm font-semibold text-slate-800"
            >
              Phone number
            </label>

            <div className="relative mt-2">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+254 700 000 000"
                className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-5">
            <label
              htmlFor="register-password"
              className="text-sm font-semibold text-slate-800"
            >
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
          >
            Create account
            <ArrowRight size={18} />
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
