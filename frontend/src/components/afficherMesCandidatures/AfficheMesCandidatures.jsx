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
  const [jobOffers, setJobOffers] = useState([]);

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

        const filteredCandidatures = data.candidatures.filter(
          (candidature) => candidature.emailEmploye === auth.user.email
        );

        setCandidatures(filteredCandidatures);

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

  const deleteCandidature = async (candidatureId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/candidatures/${candidatureId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la candidature.");
      }

      setCandidatures((prevCandidatures) =>
        prevCandidatures.filter((candidature) => candidature._id !== candidatureId)
      );
    } catch (error) {
      setError("Erreur lors de la suppression de la candidature.");
      console.log(error);
    }
  };

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

            {jobOffers[index] && (
              <Typography variant="body2">
                Offre: <strong>{jobOffers[index].titre}</strong>
              </Typography>
            )}

            <Link to={`/offre/${candidature._id}`}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Voir les détails
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              style={{ marginTop: "10px" }}
              onClick={() => deleteCandidature(candidature._id)}
            >
              Supprimer ma candidature
            </Button>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default AfficherMesCandidatures;
