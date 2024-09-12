import React from "react";
import { Box, Typography } from "@mui/material";
import "./joboffer.css"; // Import the CSS file

export default function Joboffer({ title, company, email }) {
  return (
    <div className="joboffer">
      <Box p={2} className="wrappeJobOffer">
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="subtitle1">{company}</Typography>
        <Typography variant="body2">Email: {email}</Typography>
      </Box>
    </div>
  );
}
