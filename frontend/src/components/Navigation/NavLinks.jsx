// --- IMPORTS ---
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./NavLinks.css";

// --- DEFAULT FUNCTION ---
const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <>
          {auth.isEmployer ? (
            <>
              <li><NavLink to="/publierOffre">Publier une offre</NavLink></li>
              <li><NavLink to="/mesOffres">Mes Offres</NavLink></li>
              <li><NavLink to="/profil">Profil</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink to="/mesCandidatures">Mes Candidatures</NavLink></li>
              <li><NavLink to="/profil">Profil</NavLink></li>
            </>
          )}
          <li>
            <Link to="/offreEmploi">
              <button onClick={auth.logout}>Se déconnecter</button>
              <FaUser className="icon" />
            </Link>
          </li>
        </>
      )}
      {!auth.isLoggedIn && (
        <>
          <li><NavLink to="/signup">Publier Offres/Entreprise</NavLink></li>
          <li><NavLink to="/signupCandidat">Postuler/Candidat</NavLink></li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
