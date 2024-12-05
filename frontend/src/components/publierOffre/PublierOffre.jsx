import { useContext, useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AuthContext } from "../../context/auth-context";

import "./PublierOffre.css";

export default function PublierOffre() {
  const auth = useContext(AuthContext);
  const [job, setJob] = useState({
    rid: auth.userId, 
    region: "",
    titre: "",
    description:
      "Description du travail :\n\nSalaire :\n\nCompany :\n\nPersonne à contacter :\nEmail :\nTéléphone :",
    show: true, 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  // Handle radio button change for visibility
  const handleRadioChange = (e) => {
    const newValue = e.target.value === "visible" ? true : false;
    setJob({ ...job, show: newValue });
  };

  // --- PUBLIER OFFRE ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://jobbang-ke8e.onrender.com/api/jobOffers/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(job), 
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      console.log("Job successfully created!", responseData);

      // Reset form after successful submission
      setJob({
        rid: auth.userId,
        region: "",
        titre: "",
        description: "",
        show: true,
      });

      setSuccess("L'offre d'emploi a été publiée avec succès!");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, essayez plus tard.");
    }
  };

  return (
    <Box>
      <h1>Ajouter une offre d'emploi :</h1>

      {/* Error and success messages */}
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

        {/* Radio buttons for visibility */}
        <RadioGroup
          row
          value={job.show ? "visible" : "hidden"} 
          onChange={handleRadioChange} 
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

        <button type="submit">Publier l'offre</button>
      </form>
    </Box>
  );
}
