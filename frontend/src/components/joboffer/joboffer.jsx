// --- IMPORTS ---
import React from "react";
import { Box, Typography } from "@mui/material";
import "./joboffer.css";

// --- DEFAULT FUNCTION ---
export default function Joboffer({ titre, description, onDelete , onEdit }) {
  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography variant="subtitle1">{titre}</Typography>
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
      </Box>
    </div>
  );
}
