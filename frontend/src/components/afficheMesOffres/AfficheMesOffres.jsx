import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AfficheMesOffres = () => {
  const auth = useContext(AuthContext);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCandidatures = async () => {
      try {
        const response = await fetch("https://jobbang-ke8e.onrender.com/api/candidatures", {
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
          (candidature) => candidature.employeeId === auth.user._id
        );

        setCandidatures(filteredCandidatures);
      } catch (error) {
        setError("Erreur lors de la récupération des candidatures.");
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
        {candidatures.map((candidature) => (
          <div key={candidature._id} className="candidatureItem">
            <Typography variant="h6">{candidature.jobOffer.titre}</Typography>{" "}
            {/* Afficher le titre de l'offre */}
            <Typography variant="body1">
              Statut: <strong>{candidature.statut}</strong>{" "}
              {/* Afficher le statut de la candidature */}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Date de postulation:{" "}
              {new Date(candidature.datePostulation).toLocaleDateString()}
            </Typography>
            <Link to={`/offre/${candidature.jobOffer._id}`}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Voir l'offre
              </Button>
            </Link>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default AfficheMesOffres;
