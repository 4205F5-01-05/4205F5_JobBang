// --- IMPORTS ---
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import {
  MdOutlinePassword,
  MdOutlineAlternateEmail,
  MdOutlinePhoneIphone,
  MdOutlineAddHome,
  MdOutlineTableChart,
} from "react-icons/md";

import { AuthContext } from "../../context/auth-context";
import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import Spinner from "../UIElements/LoadingSpinner";

import "./RegisterLogin.css";

// --- DEFAULT FUNCTION ---
export default function RegisterLoginCandidat() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [action, setAction] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerLink = () => {
    setAction(" active");
  };
  const loginLink = () => {
    setAction("");
  };

  // --- LOGIN ---
  async function handleSubmitLogin(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    console.log(JSON.stringify(data));

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/employees/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log("Here is the reponseData", responseData);

      if (!response.ok) {
        alert(responseData.message);
        throw new Error(responseData.message);
      }

      auth.login(responseData, responseData.token);

      console.log("User logged in successfully");
      console.log("User id " + auth.userId);
      console.log("Token " + auth.token);
      console.log("User is logged in " + auth.isLoggedIn);

      const userSession = localStorage.getItem("user");
      console.log("User session " + userSession);
      console.log(
        "User stored in localStorage: ",
        localStorage.getItem("user")
      );
      console.log(
        "Token stored in localStorage: ",
        localStorage.getItem("token")
      );

      navigate("/offreEmploiCandidat");
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue, veuillez réessayer plus tard."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    event.target.reset();
  }

  // --- REGISTER ---
  async function handleSubmitRegister(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/employees/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      console.log("User registered successfully");
      console.log(responseData);

      // Login
      auth.login(responseData.employee, responseData.token);
      console.log("DEBUT, User logged after registration");
      console.log("User id " + auth.userId);
      console.log("Token " + auth.token);
      console.log("User is logged in " + auth.isLoggedIn);
      console.log("FIN, User logged after registration");

      navigate("/");
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue, veuillez réessayer plus tard."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    event.target.reset();
  }

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => setError(null)} />
      </div>

      <div className={`wrapper${action}`}>
        <div className="form-box login">
          <form action="" onSubmit={handleSubmitLogin}>
            <h1>Connexion</h1>
            <div className="input-box">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
              <MdOutlineAlternateEmail className="icon" />
            </div>
            <div className="input-box">
              <input
                id="mdp"
                name="mdp"
                type="password"
                placeholder="Mot de passe"
                required
              />
              <MdOutlinePassword className="icon" />
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
                placeholder="Nom"
                required
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                id="email"
                placeholder="Email"
                name="email"
                required
              />
              <MdOutlineAlternateEmail className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                id="mdp"
                placeholder="Mot de passe"
                name="mdp"
                required
              />
              <MdOutlinePassword className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                id="phone"
                placeholder="Phone"
                name="phone"
                required
              />
              <MdOutlinePhoneIphone className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                id="homeAddress"
                placeholder="Home adress"
                name="homeAddress"
                required
              />
              <MdOutlineAddHome className="icon" />
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
    </>
  );
}
