import React from "react";
import { Box, Typography, Button } from "@mui/material";
import "./joboffer.css"; // Import the CSS file

export default function Joboffer({ titre, description, onDelete }) {
  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography variant="subtitle1">{titre}</Typography>
        <Typography variant="subtitle2">{description}</Typography>
        <Button variant="contained" onClick={onDelete}>
          Supprimer
        </Button>
      </Box>
    </div>
  );
}
