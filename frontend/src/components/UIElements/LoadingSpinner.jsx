import React from "react";
import "./LoadingSpinner.css"; // Assurez-vous que le chemin d'accès est correct

const Spinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div className="spinner">
      <img
        src="https://static.vecteezy.com/system/resources/previews/019/046/457/original/pencil-symbol-icon-png.png"
        alt="Loading"
      />
    </div>
  </div>
);

export default Spinner;
