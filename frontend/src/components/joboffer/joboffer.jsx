// --- IMPORTS ---
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import "./joboffer.css";

// --- DEFAULT FUNCTION ---
export default function Joboffer({
  jobId, // Ajoutez jobId ici
  titre,
  description,
  onDelete,
  onEdit,
  onApply, // onApply va recevoir jobId
}) {
  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography variant="subtitle1">{titre}</Typography>
        <Typography variant="subtitle2">{description}</Typography>

        <div className="button-group">
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
              aria-label="Supprimer l'offre d'emploi"
            >
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outlined"
              color="primary"
              onClick={onEdit}
              aria-label="Modifier l'offre d'emploi"
            >
              Edit
            </Button>
          )}
          {onApply && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onApply(jobId)} // Passez jobId ici
              aria-label="Postuler à l'offre d'emploi"
            >
              Apply
            </Button>
          )}
        </div>
      </Box>
    </div>
  );
}
