import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";

import "./listeEmploi.css";

export default function ListeEmploi() {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("https://jobbang-ke8e.onrender.com/api/jobOffers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.message);
        }

        const data = await response.json();
        console.log("Job Offers Data:", data);

        if (Array.isArray(data.jobOffers)) {
          const visibleOffers = data.jobOffers.filter((job) => job.show);
          setJobOffers(visibleOffers);
        } else {
          setJobOffers([]);
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching job offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <form>
        <Box className="joboffers">
          {jobOffers.length > 0 ? (
            jobOffers.map((job) => (
              <Joboffer key={job._id} id={job._id} titre={job.titre} />
            ))
          ) : (
            <div>No job offers found.</div>
          )}
        </Box>
      </form>
    </div>
  );
}
