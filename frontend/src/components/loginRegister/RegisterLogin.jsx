import { useContext, useState } from "react";
import "./RegisterLogin.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FaUser } from "react-icons/fa";
import {
  MdOutlinePassword,
  MdOutlineAlternateEmail,
  MdOutlinePhoneIphone,
  MdOutlineAddHome,
  MdOutlineTableChart,
} from "react-icons/md";
import PublierOffre from "../publierOffre/PublierOffre";

export default function RegisterLogin() {
  const [action, setAction] = useState("");
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const registerLink = () => {
    setAction(" active");
  };
  const loginLink = () => {
    setAction("");
  };
  //Function pour te login
  async function handleSubmitLogin(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    console.log(data);
    console.log(JSON.stringify(data));
    try {
      const response = await fetch(
        `http://localhost:5000/api/recruiters/login`,
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

      navigate("/publierOffre");
    } catch (err) {
      console.error(err);
    }
    event.target.reset();
  }
  //Function Qui Pour S'enregistrer
  async function handleSubmitRegister(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    try {
      const response = await fetch(
        `http://localhost:5000/api/recruiters/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", //pour que le bodyParser sache comment faire le parse
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
      // Login
      auth.login(responseData.recruiter.id, responseData.token);
      navigate("/publierOffre");
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
          <div className="input-box">
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Company"
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
              id="company"
              placeholder="Company"
              name="company"
              required
            />
            <MdOutlineTableChart className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              id="companyAddress"
              placeholder="Company adress"
              name="companyAddress"
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
  );
}
