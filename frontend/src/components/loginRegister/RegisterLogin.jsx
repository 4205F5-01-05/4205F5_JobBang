import { useContext, useState } from "react";
import "./RegisterLogin.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword, MdOutlineAlternateEmail } from "react-icons/md";

export default function RegisterLogin() {
  const [action, setAction] = useState("");
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const registerLink = () => {
    setAction(" active");
  };
  const loginLink = () => {
    setAction("");
  };
  //Function pour te login
  async function handleSubmitLogin(event) {
    event.preventDefault();
    try {
      const response = await sendRequest(
        `http://localhost:3000/api/users/login`,
        "POST",
        JSON.stringify(entredValues),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(response.userId, response.token, response.admin);
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          isLoggedIn: true,
          userId: response.userId,
          token: response.token,
          admin: response.admin,
        })
      );
      console.log(auth.admin);
      const userSession = localStorage.getItem("userSession");
      console.log("test utilisateur 111: " + userSession);
    } catch (err) {
      console.error(err);
    }
  }
  //Function Qui Pour S'enregistrer
  async function handleSubmitRegister(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    try {
      const response = await fetch(`http://localhost:5000/api/users/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //pour que le bodyParser sache comment faire le parse
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      auth.login();
    } catch (err) {
      setError(err.message || "Une erreur est survenue, essayez plus tard.");
      console.error(err);
    } finally {
    }

    event.target.reset();
  }

  return (
    <div className={`wrapper${action}`}>
      <div className="form-box login">
        <form action="" onSubmit={handleSubmitLogin}>
          <h1>Connexion</h1>
          <div className="input-box">
            <input type="text" placeholder="Nom d'utilisateur" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Mot de passe" required />
            <MdOutlinePassword className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Se Souvenir de moi
            </label>
            <a href="#">Mot de passe oublier ?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Pas de compte ?{" "}
              <a href="#" onClick={registerLink}>
                Créer un compte
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box Register">
        <form onSubmit={handleSubmitRegister}>
          <h1>S'Enregister</h1>
          <div className="input-box">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nom d'utilisateur"
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              id="email"
              placeholder="email"
              name="courriel"
              required
            />
            <MdOutlineAlternateEmail className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              id="password"
              placeholder="Mot de passe"
              name="password"
              required
            />
            <MdOutlinePassword className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              J'accept les conditions d'utilisations
            </label>
          </div>
          <button type="submit">S'Enregistrer</button>
          <div className="register-link">
            <p>
              Vous avez un compte ?{" "}
              <a href="#" onClick={loginLink}>
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
