// --- IMPORTS ---
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import { AuthContext } from "../../context/auth-context";
import "./MainNavigation.css";

// --- DEFAULT FUNCTION ---
const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  // Determine the link based on user status
  const linkPath = auth.isLoggedIn
    ? auth.isEmployer
      ? "/offreEmploi"
      : "/offreEmploiCandidat"
    : "/offreEmploi";

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      {drawerIsOpen && (
        <SideDrawer>
          <nav className="main-navigation__drawer-nav">
            <NavLinks />
          </nav>
        </SideDrawer>
      )}
      <header className="main-header">
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to={linkPath}>
            JobBang
            <img
              src="https://baustatikltd.com/wp-content/uploads/2019/01/kisspng-building-drawing-paper-architecture-sketch-5b18166769de96.8841390015283052554337_S.png"
              alt="Logo"
              height={40}
              width={50}
            />
          </Link>
        </h1>

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </header>
    </>
  );
};

export default MainNavigation;
