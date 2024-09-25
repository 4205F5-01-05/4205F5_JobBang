// --- IMPORTS ---
import { useEffect, useState } from "react";
import "./listeEmploi.css";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";

// --- DEFAULT FUNCTION ---
export default function ListeEmploi() {
  const [jobOffers, setJobOffers] = useState([]); // Initialize as array
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
              <Joboffer
                key={job._id} // Use job._id as a key for a more stable identifier
                titre={job.titre}
                region={job.region}
                description={job.description}
              />
            ))
          ) : (
            <div>No job offers found.</div>
          )}
        </Box>
      </form>
    </div>
  );
}
