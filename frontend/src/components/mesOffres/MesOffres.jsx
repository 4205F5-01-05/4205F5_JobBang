import { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import { AuthContext } from "../../context/auth-context";

const MesOffres = () => {
  const auth = useContext(AuthContext);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobOffers/", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Job Offers Data:", data);

        if (Array.isArray(data.jobOffers)) {
          // Filter job offers based on auth.userId
          const filteredJobOffers = data.jobOffers.filter(
            (job) => job.rid === auth.userId // Adjust to the correct property name
          );
          setJobOffers(filteredJobOffers);
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
  }, [auth]);

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
                key={job._id}
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
};

export default MesOffres;
