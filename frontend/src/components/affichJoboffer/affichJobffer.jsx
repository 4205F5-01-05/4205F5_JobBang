import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { Box, Typography } from "@mui/material";
import "./afficheJobOffer.css";

export default function AfficheJobOffer() {
  const { id } = useParams(); 
  const [job, setJob] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobOffers/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data); // Assuming API returns the job details directly
      } catch (error) {
        setError(error);
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]); // Dependency array includes job ID

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!job) {
    return <div>No job found.</div>;
  }

  return (
    <Box p={2} className="afficheJobOffer">
      <Typography variant="h4">{job.titre}</Typography>
      <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
        Région: {job.region}
      </Typography>
      <Typography variant="body1" style={{ marginTop: "20px" }}>
        {job.description}
      </Typography>
    </Box>
  );
}
