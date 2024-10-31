// --- IMPORTS ---
import { useEffect, useState, useContext } from "react";
import "./listeEmploi.css";
import { Box } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import { AuthContext } from "../../context/auth-context";
import ApplyJobForm from "../applyJobForm/ApplyJobForm";

const ListeEmploiCandidat = () => {
  const [jobOffers, setJobOffers] = useState([]); // Initialize as array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobOffers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText || "Failed to fetch job offers");
        }

        const data = await response.json();
        console.log("Job Offers Data:", data);

        if (Array.isArray(data.jobOffers)) {
          setJobOffers(data.jobOffers);
        } else {
          console.error("jobOffers is not an array or is undefined");
          setJobOffers([]);
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching job offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job); // Store the selected job
    setShowApplyForm(true); // Show the application form
  };

  const closeApplyForm = () => {
    setShowApplyForm(false);
    setSelectedJob(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Box className="joboffers">
        {jobOffers.length > 0 ? (
          jobOffers.map((job) => (
            <Joboffer
              key={job._id}
              titre={job.titre}
              description={job.description}
              onApply={!auth.isEmployer ? () => handleApply(job) : null}
            />
          ))
        ) : (
          <div>No job offers found.</div>
        )}
      </Box>

      {showApplyForm &&
        selectedJob && ( // Check if showApplyForm and selectedJob are defined
          <ApplyJobForm
            jobTitle={selectedJob.titre} // Pass the job title
            jobId={selectedJob._id} // Pass the job ID
            onClose={closeApplyForm}
            candidateInfo={{
              name: auth.user?.name,
              phone: auth.user?.phone,
              email: auth.user?.email,
            }}
          />
        )}
    </div>
  );
};

export default ListeEmploiCandidat;
