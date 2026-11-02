import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { apiRequest } from "../services/api";

const inputClass =
  "w-full rounded-xl border border-steel-700/60 !bg-navy-900 px-4 py-3 !text-white placeholder:!text-steel-500 outline-none transition focus:border-volt-500 focus:ring-2 focus:ring-volt-500/20";

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (values.password.length < 8) {
      setFieldErrors({
        password: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    if (values.password !== values.password_confirmation) {
      setFieldErrors({
        password_confirmation: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || null,
          password: values.password,
        }),
      });

      if (!data.access_token || !data.user) {
        throw new Error("La réponse du serveur est incomplète.");
      }

      // Garder le téléphone localement pour l'espace client.
      const registeredUser = {
        ...data.user,
        phone: values.phone.trim(),
      };

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(registeredUser));

      navigate("/mon-compte", { replace: true });
    } catch (err) {
      if (err.errors) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(err.errors).map(([key, value]) => [
              key,
              Array.isArray(value) ? value[0] : value,
            ])
          )
        );
      } else {
        setError(err.message || "Impossible de créer le compte.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden !bg-abyss px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full border-[35px] border-volt-500/5" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full border-[40px] border-steel-500/5" />

      <div className="relative grid w-full max-w-6xl overflow-hidden border border-steel-700/50 !bg-navy-950 shadow-2xl md:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden !bg-navy-900 p-10 !text-white md:flex">
          <div className="blueprint absolute inset-0 opacity-40" />

          <div className="relative z-10">
            <div className="flex h-14 w-14 items-center justify-center border border-volt-500/40 !bg-volt-500/10 !text-volt-400">
              <UserPlus size={27} />
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] !text-volt-400">
              INDUSTRIA · Nouveaux clients
            </p>

            <h1 className="display mt-4 text-4xl font-bold !text-white">
              Rejoignez-nous.
            </h1>

            <p className="mt-5 max-w-sm leading-7 !text-steel-300">
              Créez votre espace personnel pour explorer nos gammes,
              préparer votre panier et retrouver vos informations client.
            </p>

            <div className="mt-8 h-1 w-20 !bg-volt-500" />
          </div>

          <p className="relative z-10 text-sm !text-steel-500">
            Des solutions industrielles adaptées à vos besoins.
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

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] !text-volt-400">
              Espace client
            </p>

            <h2 className="display mt-3 text-3xl font-bold !text-white">
              Créer un compte
            </h2>

            <p className="mt-3 text-sm leading-6 !text-steel-400">
              Renseignez vos informations pour créer votre compte client.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Nom complet *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={255}
                value={values.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Votre nom complet"
              />

              {fieldErrors.name && (
                <p className="mt-1 text-sm !text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Adresse e-mail *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="nom@entreprise.com"
              />

              {fieldErrors.email && (
                <p className="mt-1 text-sm !text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Téléphone (facultatif)
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={20}
                value={values.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+212 6 XX XX XX XX"
              />

              {fieldErrors.phone && (
                <p className="mt-1 text-sm !text-red-400">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Mot de passe *
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={values.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  placeholder="8 caractères minimum"
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

              {fieldErrors.password && (
                <p className="mt-1 text-sm !text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-2 block text-sm font-medium !text-steel-300"
              >
                Confirmer le mot de passe *
              </label>

              <div className="relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmation ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={values.password_confirmation}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  placeholder="Retapez votre mot de passe"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmation((current) => !current)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 !text-steel-400 transition hover:!text-volt-400"
                  aria-label={
                    showConfirmation
                      ? "Masquer la confirmation"
                      : "Afficher la confirmation"
                  }
                >
                  {showConfirmation ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {fieldErrors.password_confirmation && (
                <p className="mt-1 text-sm !text-red-400">
                  {fieldErrors.password_confirmation}
                </p>
              )}
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
              <UserPlus size={18} />
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm !text-steel-400">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-semibold !text-volt-400 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
