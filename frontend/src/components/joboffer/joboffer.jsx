import React from "react";

const Joboffer = ({ titre, region, description, onDelete }) => {
  return (
    <div>
      <h3>{titre}</h3>
      <p>{region}</p>
      <p>{description}</p>
      <button onClick={onDelete}>Supprimer</button>{" "}
      {/* Bouton de suppression */}
    </div>
  );
};

export default Joboffer;
