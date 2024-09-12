import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./containers/Roots";
import RegisterLogin from "./components/loginRegister/RegisterLogin";
import ListeEmplois from "./components/listeEmplois/ListeEmplois";
import PublierOffre from "./components/publierOffre/PublierOffre";
import MesOffres from "./components/mesOffres/MesOffres";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import "./App.css";

const Container = styled.div`
  
`;

const App = () => {
  return (
    <BrowserRouter>
      <Container>
        <RootLayout />
        <Routes>
          <Route path="/" exact element={<Navigate to="/offreEmploi" />} />
          <Route path="/signup" exact element={<RegisterLogin />} />
          <Route path="/offreEmploi" exact element={<ListeEmplois />} />
          <Route path="/publierOffre" exact element={<PublierOffre />} />
          <Route path="/mesOffres" exact element={<MesOffres />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;