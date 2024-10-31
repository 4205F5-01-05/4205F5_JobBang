import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./joboffer.css";

export default function Joboffer({ id, titre, description, onDelete, onEdit }) {
  const navigate = useNavigate(); 

  const handleTitleClick = () => {
    navigate(`/offre/${id}`);
  };

// --- DEFAULT FUNCTION ---
export default function Joboffer({ titre, description, onDelete , onEdit, onApply }) {

  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography
          variant="subtitle1"
          onClick={handleTitleClick}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {titre}
        </Typography>
        <Typography variant="subtitle2">{description}</Typography>
        {onDelete && (
          <button className="material-symbols-outlined" onClick={onDelete}>
            Delete
          </button>
        )}
        {onEdit && (
          <button className="material-symbols-outlined" onClick={onEdit}>
            Edit
          </button>
        )}
        {onApply && (
          <button className="material-symbols-outlined" onClick={onApply}>
            Apply
          </button>
        )}
      </Box>
    </div>
  );
}
