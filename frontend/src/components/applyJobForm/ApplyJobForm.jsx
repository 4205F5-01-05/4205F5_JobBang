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
    const candidature = {
      nomEmploye: candidat.name,
      telEmploye: candidat.phone,
      emailEmploye: candidat.email,
      joId: jobId, // Assurez-vous d'avoir accès à jobId
    };

    // Envoi de la candidature à l'API
    try {
      const response = await fetch(
        `http://localhost:5000/api/candidatures/${jobId}/postuler`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Spécifiez le type de contenu
            Authorization: `Bearer ${auth.token}`, // Utilisation du token pour l'authentification
          },
          body: JSON.stringify(candidature), // Convertir l'objet en JSON
        }
      );

      if (response.status === 409) {
        alert("Vous avez déjà postulé pour cet emploi.");
        onClose(); // Close the form
        return;
    }
      console.log("Candidature:", candidature);
      console.log("Réponse de l'API:", response);
      console.log("Statut de la réponse:", response.status);
      console.log("JOB OFFER ID", jobId);

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de la candidature");
      }

      // Traiter la réponse si besoin
      const result = await response.json();
      console.log("Candidature soumise avec succès:", result);

      // Fermer le formulaire après soumission
      onClose();
      // Rediriger l'utilisateur vers les offres d'emploi
      navigate("/listeEmploisCandidat");
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
    <div className="apply-job-form">
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
        
        <button type="submit">Soumettre la candidature</button>
      </form>
    </div>
  );
};

export default ApplyJobForm;
