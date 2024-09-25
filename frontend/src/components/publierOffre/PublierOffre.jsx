// --- IMPORTS ---
import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { AuthContext } from "../../context/auth-context";

import "./PublierOffre.css";

// --- DEFAULT FUNCTION ---
export default function PublierOffre() {
  const auth = useContext(AuthContext);
  const [job, setJob] = useState({
    rid: auth.userId, // Recruiter ID
    region: "",
    titre: "",
    description:
      "Description du travail :\n\nSalaire :\n\nCompany :\n\nPersonne à contacter :\nEmail :\nTéléphone :",
  });
  const [error, setError] = useState(""); // State for error handling
  const [success, setSuccess] = useState(""); // Optional: To handle success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Job offer submitted:", job);

    try {
      const response = await fetch(
        `https://jobbang-ke8e.onrender.com/api/jobOffers/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`, // Add this line if using JWT token
          },
          body: JSON.stringify(job), // Send job directly
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log("Job offer created successfully!");

      // Optionally reset fields or show success messages
      setJob({ rid: auth.userId, region: "", titre: "", description: "" }); // Reset the form
      setSuccess("L'offre d'emploi a été publiée avec succès!");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, essayez plus tard.");
      console.error(err);
    }
  };

  return (
    <Box>
      <h1>Ajouter une offre d'emploi :</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error if any */}
      {success && <p style={{ color: "green" }}>{success}</p>}{" "}
      {/* Display success message */}
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
        <button type="submit">Publier l'offre</button>
      </form>
    </Box>
  );
}
