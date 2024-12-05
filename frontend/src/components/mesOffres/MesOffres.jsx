// --- IMPORTS ---
import { useEffect, useState, useContext } from "react";
import { Box, Modal, Button, Typography } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

// --- DEFAULT FUNCTION ---
const MesOffres = () => {
  const auth = useContext(AuthContext);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState(null); 
  const [selectedOfferTitle, setSelectedOfferTitle] = useState(""); 
  const navigate = useNavigate(); 

  // --- OBTENIR JOB OFFERS ---
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

        if (Array.isArray(data.jobOffers)) {
          const filteredJobOffers = data.jobOffers
            .filter((job) => job.rid === auth.userId)
            .map((job) => ({
              ...job,
              show: job.show !== undefined ? job.show : true, 
            }));
          setJobOffers(filteredJobOffers);
        } else {
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

  // --- DELETE OFFER ---
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
        console.error("Une erreur est survenue: ", errorData.message);
        setJobOffers(previousOffers);
      } else {
        console.log("Offre supprimée avec succès:", offerId);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error);
      setError(error.message || "Une erreur est survenue, essayez plus tard.");
      setJobOffers(previousOffers);
    }
  };

  // --- UPDATE OFFER ---
  const updateOffer = (offerId) => {
    navigate(`/modifierOffre/${offerId}`);
  };

  // --- OBTENIR CANDIDATURES ---
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
      return data.candidatures || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
      setError(error.message || "Une erreur est survenue, essayez plus tard.");
      return [];
    }
  };

  const handleCandidateClick = async (offer) => {
    const candidatures = await fetchCandidatures(offer._id);
    setSelectedCandidates(candidatures);
    setSelectedOfferTitle(offer.titre);
  };

  // --- DOWNLOAD CV ---
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
      a.download = cvFile.split("/").pop(); 
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading CV:", error);
      setError(error.message || "Une erreur est survenue, essayez plus tard.");
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
                <RadioGroup
                  row
                  value={job.show === false ? "hidden" : "visible"} 
                  disabled
                >
                  <FormControlLabel
                    value="visible"
                    control={<Radio />}
                    label="Visible"
                  />
                  <FormControlLabel
                    value="hidden"
                    control={<Radio />}
                    label="Masquée"
                  />
                </RadioGroup>
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
