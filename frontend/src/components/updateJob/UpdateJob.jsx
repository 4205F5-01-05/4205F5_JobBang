import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthContext } from "../../context/auth-context";

const UpdateJob = () => {
  const { id: offerId } = useParams(); // Récupère l'ID de l'offre à partir de l'URL
  const auth = useContext(AuthContext); // Contexte d'authentification pour l'API
  const navigate = useNavigate(); // Pour rediriger après mise à jour
  const [job, setJob] = useState({
    region: "",
    titre: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Récupérer les informations de l'offre pour pré-remplir le formulaire
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`https://jobbang-ke8e.onrender.com/api/jobOffers/${offerId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`, // Ajoute le token pour l'autorisation
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'offre");
        }

        const data = await response.json();

        // Remplir l'état "job" avec les données récupérées
        setJob({
          region: data.jobOffer.region || "",
          titre: data.jobOffer.titre || "",
          description: data.jobOffer.description || ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`https://jobbang-ke8e.onrender.com/api/jobOffers/${offerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`, // Ajoute le token pour l'autorisation
        },
        body: JSON.stringify(job), // Envoie les données modifiées
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'offre");
      }

      setSuccess("Offre mise à jour avec succès !");
      // Redirige vers la page des offres une fois l'offre mise à jour
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
        <button type="submit">Mettre à jour l'offre</button>
      </form>
    </Box>
  );
};

export default UpdateJob;
