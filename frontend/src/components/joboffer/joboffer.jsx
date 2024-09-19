import React from "react";
import { Box, Typography } from "@mui/material";
import "./joboffer.css"; // Import the CSS file

export default function Joboffer({ title, description}) {
  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="subtitle2">{description}</Typography>
        
      </Box>
    </div>
  );
}
