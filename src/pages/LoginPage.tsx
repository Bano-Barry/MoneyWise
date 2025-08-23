import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { login as loginService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { utilisateur, token } = await loginService(formData);
      login(utilisateur, token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-background relative">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-x-2 text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        Retour à l'accueil
      </Link>
      <div className="max-w-sm w-full text-text-primary">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-text-primary">
            MoneyWise
          </Link>
          <div className="mt-5">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Connectez-vous à votre compte
            </h3>
            <p className="mt-2">
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary-hover"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <p className="text-center text-negative bg-negative/10 p-2 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            {/* <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="remember-me"
                className="checkbox-item peer"
              />
              <label
                htmlFor="remember-me"
                className="text-text-secondary cursor-pointer peer-checked:text-primary"
              >
                Se souvenir de moi
              </label>
            </div> */}
            <Link
              to="/forgot-password"
              className="text-center text-primary hover:text-primary-hover"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;