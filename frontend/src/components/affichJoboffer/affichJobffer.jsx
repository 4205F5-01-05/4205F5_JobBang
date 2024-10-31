import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"; 
import { Box, Typography, Button } from "@mui/material";
import "./afficheJobOffer.css";
import { AuthContext } from "../../context/auth-context";

export default function AfficheJobOffer() {
  const { id } = useParams(); 
  const [job, setJob] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const auth = useContext(AuthContext); 

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobOffers/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob({
          region: data.jobOffer.region || "",
          titre: data.jobOffer.titre || "",
          description: data.jobOffer.description || ""
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, auth.token]); 

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!job) {
    return <div>No job found.</div>;
  }

 
  const isCandidate = auth.role === 'candidate'; 

  return (
    <div className="afficheJobOffer">
      <Typography variant="h4">{job.titre}</Typography>
      <Typography variant="subtitle1" className="region">
        Région: {job.region}
      </Typography>
      <Typography variant="body1" className="description">
        {job.description}
      </Typography>
      

      {isCandidate && (
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Apply for Job
        </Button>
      )}
    </div>
  );
}
