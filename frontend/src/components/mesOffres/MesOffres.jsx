import React from "react";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import JOBS from "../../data/job";
import RECRUITERS from "../../data/recruteur";

const MesOffres = () => {
  // Filtrer les jobs pour n'inclure que ceux où la société est "Test"
  const filteredJobs = JOBS.filter((job, index) => {
    const company = RECRUITERS[index % RECRUITERS.length]?.company;
    return company === "Test";
  });

  return (
    <div>
      <p>MesOffres</p>
      <Box className="joboffers">
        {filteredJobs.map((job, index) => (
          <Joboffer
            key={index}
            title={job.titre}
            description={job.description}
            r_email={RECRUITERS[index % RECRUITERS.length]?.email}
            r_phone={RECRUITERS[index % RECRUITERS.length]?.phone}
          />
        ))}
      </Box>
    </div>
  );
};

export default MesOffres;
