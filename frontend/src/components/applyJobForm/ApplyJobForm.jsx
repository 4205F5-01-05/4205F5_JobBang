import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const ApplyJobForm = ({ jobTitle, onClose }) => {
  const auth = useContext(AuthContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit application logic
    onClose(); // Close the form on success
  };

  return (
    <div className="apply-job-form">
      <h3>Postuler pour: {jobTitle}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nom du Candidat:
          <input type="text" defaultValue={auth.user.name} required />
        </label>
        <label>
          Numéro de Téléphone:
          <input type="text" defaultValue={auth.user.phone} required />
        </label>
        <label>
          Adresse Email:
          <input type="email" defaultValue={auth.user.email} required />
        </label>
        <label>
          CV:
          <input type="file" required />
        </label>
        <button type="submit">Soumettre la candidature</button>
      </form>
    </div>
  );
};

export default ApplyJobForm;
