import React from "react";

const Joboffer = ({ titre, region, description, onDelete }) => {
  return (
    <div className="joboffer">
      <h2>{titre}</h2>
      <p>{region}</p>
      <p>{description}</p>
      <button onClick={onDelete}>Supprimer</button>
    </div>
  );
};

export default Joboffer;
