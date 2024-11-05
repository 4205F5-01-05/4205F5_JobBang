import React, { useContext, useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

const ApplyJobForm = ({ jobTitle, jobId, onClose }) => {
  const auth = useContext(AuthContext);
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext(); // Utilisation du contexte d'authentification
  const navigate = useNavigate();

  useEffect(() => {
    const eId = user._id; // Identifiant de l'utilisateur
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employees/${eId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setCandidat(data.employee); // Stockage des données du candidat
      } catch (error) {
        setError("Failed to load profile data");
        console.log(error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchProfile();
  }, [auth, user]); // Ajout de 'user' comme dépendance

  console.log(jobId);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Récupération des données du formulaire
    const formData = new FormData();
  formData.append("nomEmploye", e.target[0].value);
  formData.append("telEmploye", e.target[1].value);
  formData.append("emailEmploye", e.target[2].value);
  formData.append("cvFile", e.target.cvFile.files[0]); // Append the CV file
  formData.append("jobId", jobId);

    // Envoi de la candidature à l'API
    try {
      const response = await fetch(
        `http://localhost:5000/api/candidatures/${jobId}/postuler`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add token for authentication
          },
          body: formData, // Send FormData as the body
        }
      );

      if (response.status === 409) {
        alert("Vous avez déjà postulé pour cet emploi.");
        onClose(); // Close the form
        return;
    }
      
      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de la candidature");
      }

      // Traiter la réponse si besoin
      const result = await response.json();
      console.log("Candidature soumise avec succès:", result);

      // Fermer le formulaire après soumission
      onClose();
      // Rediriger l'utilisateur vers les offres d'emploi
      
    } catch (error) {
      console.error("Erreur:", error);
      // Gérer l'affichage d'un message d'erreur si nécessaire
    }
  };

  // Affichage de l'état de chargement ou d'erreur
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // Assurez-vous que candidat n'est pas null avant d'accéder à ses propriétés
  return (
    <div className="apply-job-form" style={{ position: 'relative' }}>
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'blue',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        &times; 
      </button>
      <h3>Postuler pour: {jobTitle}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nom du Candidat:
          <input type="text" defaultValue={candidat.name || ""} required />
        </label>
        <label>
          Numéro de Téléphone:
          <input type="text" defaultValue={candidat.phone || ""} required />
        </label>
        <label>
          Adresse Email:
          <input type="email" defaultValue={candidat.email || ""} required />
        </label>    
        <label>
          CV:
          <input type="file" name="cvFile" id="cvFile"/>
        </label>   
        <button type="submit">Soumettre la candidature</button>
      </form>
    </div>
  );
};

export default ApplyJobForm;
