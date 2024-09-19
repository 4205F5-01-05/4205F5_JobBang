import React from "react";
import { Box, Typography } from "@mui/material";
import "./joboffer.css"; // Import the CSS file

export default function Joboffer({ title, description, r_email, r_phone }) {
  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="subtitle1">{description}</Typography>
        <Typography variant="subtitle1">{r_email}</Typography>
        <Typography variant="subtitle1">{r_phone}</Typography>
      </Box>
    </div>
  );
}
