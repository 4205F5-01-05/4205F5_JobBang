// --- IMPORTS ---
import { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import { AuthContext } from "../../context/auth-context";

// --- DEFAULT FUNCTION ---
const MesOffres = () => {
  const auth = useContext(AuthContext);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("https://jobbang-ke8e.onrender.com/api/jobOffers/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.message);
        }

        const data = await response.json();
        console.log("Job Offers Data:", data);

        if (Array.isArray(data.jobOffers)) {
          const filteredJobOffers = data.jobOffers.filter(
            (job) => job.rid === auth.userId
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

  const deleteOffer = async (offerId) => {
    const previousOffers = [...jobOffers];
    setJobOffers((prevOffers) =>
      prevOffers.filter((job) => job._id !== offerId)
    );

    try {
      const response = await fetch(
        `https://jobbang-ke8e.onrender.com/api/jobOffers/${offerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de l'API:", errorData.message);
        setJobOffers(previousOffers);
      } else {
        console.log("Offre supprimée avec succès:", offerId);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error);
      setJobOffers(previousOffers);
    }
  };

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
                // Pass the delete function as a prop to display the delete button
                onDelete={() => deleteOffer(job._id)}
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
