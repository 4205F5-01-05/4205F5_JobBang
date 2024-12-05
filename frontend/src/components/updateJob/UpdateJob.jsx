import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

const UpdateJob = () => {
  const { id: offerId } = useParams(); 
  const auth = useContext(AuthContext); 
  const navigate = useNavigate(); 
  const [job, setJob] = useState({
    region: "",
    titre: "",
    description: "",
    show: false, 
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- OBTENIR INFOS ACTUELLES OFFRE ---
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `https://jobbang-ke8e.onrender.com/api/jobOffers/${offerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth.token}`, 
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'offre");
        }

        const data = await response.json();

        setJob({
          region: data.jobOffer.region || "",
          titre: data.jobOffer.titre || "",
          description: data.jobOffer.description || "",
          show: data.jobOffer.show || false, 
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [offerId, auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleVisibilityChange = (e) => {
    const newShowValue = e.target.value === "visible";
    setJob({ ...job, show: newShowValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // --- MAJ OFFRE ---
    try {
      const response = await fetch(
        `https://jobbang-ke8e.onrender.com/api/jobOffers/${offerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`, 
          },
          body: JSON.stringify(job),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'offre");
      }

      setSuccess("Offre mise à jour avec succès !");
      navigate("/mesOffres");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Box>
      <h1>Modifier l'offre d'emploi: </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="region"
          placeholder="Région"
          value={job.region}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="titre"
          placeholder="Titre de l'offre"
          value={job.titre}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description de l'offre"
          value={job.description}
          onChange={handleChange}
          required
        />
        {/* Boutons radio pour déterminer la visibilité */}
        <RadioGroup
          row
          value={job.show ? "visible" : "hidden"}
          onChange={handleVisibilityChange} 
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
        <button type="submit">Mettre à jour l'offre</button>
      </form>
    </Box>
  );
};

export default UpdateJob;
