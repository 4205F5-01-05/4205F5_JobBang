import { useContext, useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import "./PublierOffre.css";

export default function PublierOffre() {
  const auth = useContext(AuthContext);
  const [job, setJob] = useState({
    rid: auth.userId, // Recruiter ID
    region: "",
    titre: "",
    description:
      "Description du travail :\n\nSalaire :\n\nCompany :\n\nPersonne à contacter :\nEmail :\nTéléphone :",
    show: true, // Default visibility is true (visible)
  });
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  // Handle radio button change for visibility
  const handleRadioChange = (e) => {
    const newValue = e.target.value === "visible" ? true : false;
    console.log("Radio changed to:", newValue); // Debugging
    setJob({ ...job, show: newValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", job); // Debugging before submitting

    try {
      const response = await fetch(
        "http://localhost:5000/api/jobOffers/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(job), // Send the entire job object including visibility (show)
        }
      );

      const responseData = await response.json();
      console.log("API Response:", responseData); // Add logging for response data

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
        show: true, // Reset visibility to "visible" by default
      });

      setSuccess("L'offre d'emploi a été publiée avec succès!");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, essayez plus tard.");
    }
  };

  console.log("Current job state:", job); // Debugging

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
          value={job.show ? "visible" : "hidden"} // Dynamically set value based on show state
          onChange={handleRadioChange} // Handle radio button changes
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
