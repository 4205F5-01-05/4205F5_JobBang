import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/Signup">Publier Offres/Entreprise</NavLink>
      </li>
      <li>
        <NavLink to="/listeEmploi">LISTE EMPLOI</NavLink>
      </li>
      <li>
        <NavLink to="/Profil"> Mon Profil</NavLink>
      </li>

    </ul>
  );
};

export default NavLinks;
