import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  console.log(localStorage);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    if (userSession) {
      auth.login(userSession.userId, userSession.token, userSession.admin);
    } else {
      navigate("/");
    }
  }, [auth]);
  const [sousMenuStates, setSousMenuStates] = useState({
    sport: false,
  });

  const handleSousMenuOpen = (menuName) => {
    setSousMenuStates({
      [menuName]: true,
    });
  };

  const handleSousMenuClose = (menuName) => {
    setSousMenuStates({
      ...sousMenuStates,
      [menuName]: false,
    });
  };

  console.log("test navlink", auth.admin);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/Signup">Publier Offres/Entreprise</NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
