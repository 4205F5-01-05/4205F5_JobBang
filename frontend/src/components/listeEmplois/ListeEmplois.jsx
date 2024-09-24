import { useEffect, useState } from "react";
import "./listeEmploi.css";
import { Box, Button } from "@mui/material";
import Joboffer from "../joboffer/joboffer";

export default function ListeEmploi() {
  const [jobOffers, setJobOffers] = useState([]); // Initialize as array
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

        // Assuming the API returns 'jobOffers', update the state
        if (Array.isArray(data.jobOffers)) {
          setJobOffers(data.jobOffers);
        } else {
          console.error("jobOffers is not an array or is undefined");
          setJobOffers([]); // fallback to an empty array
        }
      } catch (error) {
        setError(error); // Handle the error
        console.error("Error fetching job offers:", error); // Log the error for debugging
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
        setJobOffers(previousOffers); // Restore previous state on error
        const errorData = await response.json();
        console.error("Erreur de l'API:", errorData.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error);
      setJobOffers(previousOffers); // Restore previous state on error
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
              key={job._id} // Use job._id as a key for a more stable identifier
              titre={job.titre}
              region={job.region}
              description={job.description}
              onDelete={() => deleteOffer(job._id)} // Pass the delete function
            />
          ))
        ) : (
          <div>No job offers found.</div>
        )}
      </Box>
    </div>
  );
}
