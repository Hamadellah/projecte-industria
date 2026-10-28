import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { apiRequest } from "../services/api";

const inputClass =
  "w-full rounded-xl border border-steel-700/60 !bg-navy-900 px-4 py-3 !text-white placeholder:!text-steel-500 outline-none transition focus:border-volt-500 focus:ring-2 focus:ring-volt-500/20";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/mon-compte", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden !bg-abyss px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full border-[35px] border-volt-500/5" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full border-[40px] border-steel-500/5" />

      <div className="relative grid w-full max-w-5xl overflow-hidden border border-steel-700/50 !bg-navy-950 shadow-2xl md:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden !bg-navy-900 p-10 !text-white md:flex">
          <div className="blueprint absolute inset-0 opacity-40" />

          <div className="relative z-10">
            <div className="flex h-14 w-14 items-center justify-center border border-volt-500/40 !bg-volt-500/10 !text-volt-400">
              <LogIn size={27} />
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] !text-volt-400">
              INDUSTRIA · Espace client
            </p>

            <h1 className="display mt-4 text-4xl font-bold !text-white">
              Heureux de vous revoir.
            </h1>

            <p className="mt-5 max-w-sm leading-7 !text-steel-300">
              Connectez-vous pour retrouver vos équipements industriels,
              gérer votre panier et suivre vos commandes.
            </p>

            <div className="mt-8 h-1 w-20 !bg-volt-500" />
          </div>

          <p className="relative z-10 text-sm !text-steel-500">
            Votre partenaire en équipements industriels.
          </p>

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full border-[25px] border-volt-500/10" />
        </section>

        <section className="relative z-10 p-6 sm:p-10 lg:p-12">
          <Link
            to="/"
            className="text-sm font-medium !text-steel-400 transition hover:!text-volt-400"
          >
            ← Retour à la boutique
          </Link>

          <div className="mt-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] !text-volt-400">
              Bienvenue
            </p>

            <h2 className="display mt-3 text-3xl font-bold !text-white">
              Connexion
            </h2>

            <p className="mt-3 text-sm leading-6 !text-steel-400">
              Saisissez vos identifiants pour accéder à votre espace client.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Adresse e-mail
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Mot de passe
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 !text-steel-400 transition hover:!text-volt-400"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="border border-red-500/30 bg-red-500/10 p-3 text-sm !text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 !bg-volt-500 px-4 py-3 font-bold !text-navy-950 transition hover:!bg-volt-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm !text-steel-400">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="font-semibold !text-volt-400 hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}