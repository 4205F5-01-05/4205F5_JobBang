import { useContext, useState } from "react";
import "./listeEmploi.css";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import JOBS from "../../data/job";
import RECRUITERS from "../../data/recruteur";

export default function ListeEmploi() {
  return (
    <div>
      <form>
        <p>Emploi</p>

        <Box className="joboffers">
          {JOBS.map((job, index) => (
            <Joboffer
              key={index}
              titre={job.titre}
              description={job.description}
            />
          ))}
        </Box>
      </form>
    </div>
  );
}
