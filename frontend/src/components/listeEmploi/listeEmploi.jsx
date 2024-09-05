import { useContext, useState } from "react";
import "./listeEmploi.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FaUser } from "react-icons/fa";
import { Box, Button, Select, MenuItem } from "@material-ui/core";
export default function ListeEmploi() {
  return (
    <div>
      <form>
        <h2>Offre d'emplois</h2>
        <Box>
          <Select defaultValue="Temps plein">
            <MenuItem value="Temps plein">Temps Plein</MenuItem>
            <MenuItem value="Temps partiel">Temps Partiel</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
          <Select defaultValue="A Distance">
            <MenuItem value="A Distance">A Distance</MenuItem>
            <MenuItem value="En Presence">En Presence</MenuItem>
            <MenuItem value="Hybride">Hybride</MenuItem>
          </Select>
        </Box>
      </form>
    </div>
  );
}
