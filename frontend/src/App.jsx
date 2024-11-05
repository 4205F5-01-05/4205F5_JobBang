// --- IMPORTS ---
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./containers/Roots";
import { AuthContext, AuthProvider } from "./context/auth-context";

import RegisterLogin from "./components/loginRegister/RegisterLogin";
import RegisterLoginCandidat from "./components/loginRegister/RegisterLogin_Candidat";
import ListeEmplois from "./components/listeEmplois/ListeEmplois";
import PublierOffre from "./components/publierOffre/PublierOffre";
import MesOffres from "./components/mesOffres/MesOffres";
import Profile from "./components/profil/ProfilEmployeur";
import UserProfileC from "./components/profil/ProfilCandidat";
import UpdateJob from "./components/updateJob/UpdateJob";
import AfficheJobOffer from "./components/affichJoboffer/affichJobffer";
import ListeEmploiCandidat from "./components/listeEmplois/ListeEmploiCandidat";
import styled from "styled-components";
import "./App.css";

const Container = styled.div``;

// Component pour les routes protégées
const ProtectedRoute = ({ element, ...rest }) => {
  const { isLoggedIn, user, token, isEmployer } = useContext(AuthContext);
  if (user === null && token === null) {
    return <div>Loading...</div>;
  }
  return isLoggedIn ? element : <Navigate to="/signup" />;
};


// --- DEFAULT FUNCTION ---
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <RootLayout />
          <Routes>
            <Route path="/" element={<Navigate to="/offreEmploi" />} />
            <Route path="/signup" element={<RegisterLogin />} />
            <Route path="/signupCandidat" element={<RegisterLoginCandidat />} />
            <Route path="/offreEmploi" element={<ListeEmplois />} />
            {/* Les routes protégées */}
            <Route
              path="/publierOffre"
              element={<ProtectedRoute element={<PublierOffre />} />}
            />
            <Route path="/offre/:id" element={<AfficheJobOffer />} />
            <Route
              path="/mesOffres"
              element={<ProtectedRoute element={<MesOffres />} />}
            />
            <Route
              path="/profil"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/profil_C"
              element={<ProtectedRoute element={<UserProfileC />} />}
            />
            <Route
              path="/modifierOffre/:id"
              element={<ProtectedRoute element={<UpdateJob />} />}
            />
            <Route
              path="/offreEmploiCandidat"
              element={<ProtectedRoute element={<ListeEmploiCandidat />} />}
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
