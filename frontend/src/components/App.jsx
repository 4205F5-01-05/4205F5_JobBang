import React from "react";
import Profil from "../components/profil";
import ProfilEmployeur from "./profil/ProfilEmployeur";
import MesOffres from "./mesOffres/MesOffres";

const App = () => {
  return (
    <div className="App">
      <ProfilEmployeur />
      <MesOffres />
    </div>
  );
};

export default App;
