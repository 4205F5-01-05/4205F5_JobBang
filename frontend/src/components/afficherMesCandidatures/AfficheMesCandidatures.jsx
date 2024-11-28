import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./AfficheMesCandidatures.css";

const AfficherMesCandidatures = () => {
  const auth = useContext(AuthContext);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobOffers, setJobOffers] = useState([]); // New state to store job offers

  useEffect(() => {
    const fetchAllCandidatures = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/candidatures", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des candidatures.");
        }

        const data = await response.json();

        // Filter candidatures associated with the connected employer
        const filteredCandidatures = data.candidatures.filter(
          (candidature) => candidature.emailEmploye === auth.user.email
        );

        setCandidatures(filteredCandidatures);

        // Fetch job offers for each candidature based on joId
        const jobOffersPromises = filteredCandidatures.map(async (candidature) => {
          const jobOfferResponse = await fetch(
            `http://localhost:5000/api/jobOffers/${candidature.joId}`
          );

          if (!jobOfferResponse.ok) {
            throw new Error("Erreur lors de la récupération de l'offre d'emploi.");
          }

          const jobOfferData = await jobOfferResponse.json();
          return jobOfferData.jobOffer;
        });

        // Wait for all job offers to be fetched
        const allJobOffers = await Promise.all(jobOffersPromises);
        setJobOffers(allJobOffers);

      } catch (error) {
        setError("Erreur lors de la récupération des candidatures ou des offres.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCandidatures();
  }, [auth.token, auth.user._id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (candidatures.length === 0) {
    return <div>Aucune candidature trouvée.</div>;
  }

  return (
    <div className="mesCandidatures">
      <Typography variant="h4" gutterBottom>
        Mes Candidatures
      </Typography>

      <Box>
        {candidatures.map((candidature, index) => (
          <div key={candidature._id} className="candidatureItem">
            <Typography variant="h6">{candidature.emailEmploye}</Typography>
            <Typography variant="body1">
              Candidat: <strong>{candidature.nomEmploye}</strong>
            </Typography>

            {/* Display job offer title if available */}
            {jobOffers[index] && (
              <Typography variant="body2">
                Offre: <strong>{jobOffers[index].titre}</strong>
              </Typography>
            )}

            <Link to={`/candidature/${candidature._id}`}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Voir les détails
              </Button>
            </Link>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default AfficherMesCandidatures;
