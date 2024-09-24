import { useEffect, useState } from "react";
import "./listeEmploi.css";
import { Box, Button } from "@mui/material";
import Joboffer from "../joboffer/joboffer";

export default function ListeEmploi() {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobOffers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("Job Offers Data:", data);

        if (Array.isArray(data.jobOffers)) {
          setJobOffers(data.jobOffers);
        } else {
          console.error("jobOffers is not an array or is undefined");
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

  const deleteOffer = async (offerId) => {
    console.log("Tentative de suppression de l'offre avec ID:", offerId);

    const previousOffers = [...jobOffers];
    setJobOffers((prevOffers) =>
      prevOffers.filter((job) => job._id !== offerId)
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobOffers/${offerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setJobOffers(previousOffers);
        const errorData = await response.json();
        console.error("Erreur de l'API:", errorData.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error);
      setJobOffers(previousOffers);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Box className="joboffers">
        {jobOffers.length > 0 ? (
          jobOffers.map((job) => (
            <Joboffer
              key={job._id}
              titre={job.titre}
              region={job.region}
              description={job.description}
              onDelete={() => deleteOffer(job._id)}
            />
          ))
        ) : (
          <div>No job offers found.</div>
        )}
      </Box>
    </div>
  );
}
