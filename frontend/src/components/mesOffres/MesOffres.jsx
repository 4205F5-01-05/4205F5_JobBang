// --- IMPORTS ---
import { useEffect, useState, useContext } from "react";
import { Box, Modal, Button, Typography } from "@mui/material"; // Importation de Modal, Button, et Typography
import Joboffer from "../joboffer/joboffer";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";
import UpdateJob from "../updateJob/UpdateJob";

// --- DEFAULT FUNCTION ---
const MesOffres = () => {
  const auth = useContext(AuthContext);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState(null); // État pour les candidatures
  const [selectedOfferTitle, setSelectedOfferTitle] = useState(""); // État pour le titre de l'offre
  const navigate = useNavigate(); // Use navigate hook to redirect

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobOffers/", {
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
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  const deleteOffer = async (offerId) => {
    const previousOffers = [...jobOffers];
    setJobOffers((prevOffers) =>
      prevOffers.filter((job) => job._id !== offerId)
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobOffers/${offerId}`,
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

  const updateOffer = (offerId) => {
    navigate(`/modifierOffre/${offerId}`);
  };

  const fetchCandidatures = async (offerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/candidatures/offer/${offerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log("Données de l'API:", data);
      return data.candidatures || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
      return [];
    }
  };

  const handleCandidateClick = async (offer) => {
    const candidatures = await fetchCandidatures(offer._id);
    console.log(
      "Candidatures récupérées dans handleCandidateClick:",
      candidatures
    );
    setSelectedCandidates(candidatures);
    setSelectedOfferTitle(offer.titre);
  };

  const downloadCV = async (cvFile) => {
    try {
      const response = await fetch(`http://localhost:5000/${cvFile}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = cvFile.split('/').pop(); // Get the file name from the path
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading CV:", error);
    }
  };

  return (
    <div>
      <form>
        <Box className="joboffers">
          {jobOffers.length > 0 ? (
            jobOffers.map((job) => (
              <Box
                key={job._id}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Joboffer
                  titre={job.titre}
                  region={job.region}
                  description={job.description}
                  onDelete={() => deleteOffer(job._id)}
                  onEdit={() => updateOffer(job._id)}
                />
                <Button onClick={() => handleCandidateClick(job)}>
                  Voir les candidatures
                </Button>
              </Box>
            ))
          ) : (
            <div>Pas d'offre d'emploi trouvée.</div>
          )}
        </Box>
      </form>

      {/* Modal pour afficher les détails des candidats */}
      <Modal
        open={!!selectedCandidates}
        onClose={() => setSelectedCandidates(null)}
      >
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 500,
            margin: "auto",
          }}
        >
          <h2>{selectedOfferTitle}</h2> {/* Titre de l'offre affiché ici */}
          {selectedCandidates && selectedCandidates.length > 0 ? (
            selectedCandidates.map((candidate) => (
              <Box
                key={candidate._id}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 2,
                  backgroundColor: "#f9f9f9",
                  width: "fit-content",
                }}
              >
                <Typography variant="h6">{candidate.nomEmploye}</Typography>
                <Typography>Email: {candidate.emailEmploye}</Typography>
                <Typography>Téléphone: {candidate.telEmploye}</Typography>
                {candidate && candidate.cvFile && (
                  <Button
                    variant="outlined"
                    onClick={() => downloadCV(candidate.cvFile)}
                    sx={{ marginTop: 1 }}
                  >
                    Télécharger le CV
                  </Button>
                )}
              </Box>
            ))
          ) : (
            <div>Aucune candidature.</div>
          )}
          <Button onClick={() => setSelectedCandidates(null)}>Fermer</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MesOffres;
