// --- IMPORTS ---
import React from "react";
import ProfilEmployeur from "./profil/ProfilEmployeur";
import MesOffres from "./mesOffres/MesOffres";

// --- DEFAULT FUNCTION ---
const App = () => {
  return (
    <div className="App">
      <ProfilEmployeur />
      <MesOffres />
    </div>
  );
};

export default App;
