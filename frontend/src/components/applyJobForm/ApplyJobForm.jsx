import React, { useContext, useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthContext } from "../../context/auth-context";

const ApplyJobForm = ({ jobTitle, jobId, onClose }) => {
  const auth = useContext(AuthContext);
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext(); 


  useEffect(() => {
    const eId = user._id;
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
        setCandidat(data.employee); 
      } catch (error) {
        setError("Failed to load profile data");
        console.log(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProfile();
  }, [auth, user]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nomEmploye", e.target[0].value);
    formData.append("telEmploye", e.target[1].value);
    formData.append("emailEmploye", e.target[2].value);
    formData.append("eId", user._id);
    const file = e.target.cvFile.files[0];
    

    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    // Validate file type and size
    const validFileTypes = ["application/pdf"];
    if (!validFileTypes.includes(file.type)) {
        alert("Le fichier doit être au format PDF.");
        return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10 MB
        alert("La taille du fichier ne doit pas dépasser 10 Mo.");
        return;
    }

    formData.append("cvFile", file);

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
