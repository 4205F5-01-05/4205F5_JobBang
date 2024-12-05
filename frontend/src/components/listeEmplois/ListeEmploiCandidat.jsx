import { useEffect, useState, useContext } from "react";
import { Box, Modal } from "@mui/material";
import Joboffer from "../joboffer/joboffer";
import { AuthContext } from "../../context/auth-context";
import ApplyJobForm from "../applyJobForm/ApplyJobForm";

import "./listeEmploi.css";

const ListeEmploiCandidat = () => {
  const [jobOffers, setJobOffers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("https://jobbang-ke8e.onrender.com/api/jobOffers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText || "Failed to fetch job offers");
        }

        const data = await response.json();

        if (Array.isArray(data.jobOffers)) {
          const visibleOffers = data.jobOffers.filter((job) => job.show);
          setJobOffers(visibleOffers);
        } else {
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
    setSelectedJob(job); 
    setShowApplyForm(true); 
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
              id={job._id}
              titre={job.titre}
              onApply={!auth.isEmployer ? () => handleApply(job) : null}
            />
          ))
        ) : (
          <div>No job offers found.</div>
        )}
      </Box>
      <Modal open={showApplyForm} onClose={closeApplyForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedJob && (
            <ApplyJobForm
              jobTitle={selectedJob.titre}
              jobId={selectedJob._id}
              onClose={closeApplyForm}
              candidateInfo={{
                name: auth.user?.name,
                phone: auth.user?.phone,
                email: auth.user?.email,
              }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ListeEmploiCandidat;
