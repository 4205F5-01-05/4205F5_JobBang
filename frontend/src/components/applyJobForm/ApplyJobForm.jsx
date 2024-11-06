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
        console.log("Fetching profile data...");
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

        console.log("Profile fetch response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        console.log("Profile data:", data); // Log profile data
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

  console.log("Job ID:", jobId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nomEmploye", e.target[0].value);
    formData.append("telEmploye", e.target[1].value);
    formData.append("emailEmploye", e.target[2].value);
    const file = e.target.cvFile.files[0];

    if (file) {
      formData.append("cvFile", file);
    } else {
      console.log("No file selected");
      alert("Please select a file.");
      return;
    }

    console.log("Form data before submission:", formData);

    try {
      const response = await fetch(
        `http://localhost:5000/api/candidatures/${jobId}/postuler`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          body: formData,
        }
      );

      if (response.status === 409) {
        alert("Vous avez déjà postulé pour cet emploi.");
        onClose();
        return;
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de la candidature");
      }

      const result = await response.json();
      console.log("Candidature soumise avec succès:", result);
      alert("Candidature soumise avec succès.");
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la soumission de la candidature.");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="apply-job-form" style={{ position: "relative" }}>
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "blue",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        &times;
      </button>
      <h3>Postuler pour: {jobTitle}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nom du Candidat:
          <input type="text" defaultValue={candidat?.name || ""} required />
        </label>
        <label>
          Numéro de Téléphone:
          <input type="text" defaultValue={candidat?.phone || ""} required />
        </label>
        <label>
          Adresse Email:
          <input type="email" defaultValue={candidat?.email || ""} required />
        </label>
        <label>
          CV:
          <input type="file" name="cvFile" id="cvFile" />
        </label>
        <button type="submit">Soumettre la candidature</button>
      </form>
    </div>
  );
};

export default ApplyJobForm;
