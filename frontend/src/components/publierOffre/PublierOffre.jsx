import { useContext, useState } from "react";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import JOBS from "../../data/job"; // Ensure your path is correct
import RECRUITERS from "../../data/recruteur"; // Ensure your path is correct

export default function PublierOffre() {
  const [job, setJob] = useState({
    rid: "", // Recruiter ID
    company: "",
    region: "",
    titre: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job offer submitted:", job);
    // Here you would typically handle the submission to your backend or state
  };

  return (
    <div>
      <h1>Ajouter une offre d'emploi</h1>
      <form onSubmit={handleSubmit}>
        <select name="rid" value={job.rid} onChange={handleChange} required>
          <option value="" disabled>
            Choisir un recruteur
          </option>
          {RECRUITERS.map((recruiter) => (
            <option key={recruiter.id} value={recruiter.id}>
              {recruiter.name}{" "}
              {/* Adjust this based on your recruiter object structure */}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="company"
          placeholder="Nom de l'entreprise"
          value={job.company}
          onChange={handleChange}
          required
        />
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
    </div>
  );
}
